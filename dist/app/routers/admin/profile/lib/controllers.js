import { Admin } from '../../../../models/index.js';
import { validateAdminSchema } from '../../../../models/lib/validators/index.js';
import { mailer } from '../../../../utils/index.js';
const controllers = {
    editProfile: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sUsername', 'sEmail']);
        const query = { _id: req.admin._id };
        const [error, data] = validateAdminSchema(body);
        if (error)
            return res.reply(messages.unprocessableEntity(), _.parse(error));
        const admin = await Admin.findOne(query);
        if (!admin)
            return res.reply(messages.not_found('Admin'));
        const updateObj = { $set: { dUpdatedDate: new Date() }, $pull: {} };
        const adminExist = await Admin.findOne({ $or: [{ sEmail: data.sEmail }, { sUserName: data?.sUsername }] });
        if (adminExist) {
            if (data?.sUsername && adminExist.sUsername === data.sUsername)
                return res.reply(messages.already_exists('Username'));
            if (data?.sEmail && adminExist.sEmail === data?.sEmail && data.sEmail !== admin.sEmail)
                return res.reply(messages.already_exists('Email'));
        }
        if (data.sEmail && data.sEmail !== admin.sEmail) {
            const sLinkToken = _.encodeToken({ sEmail: admin.sEmail, sNewEmail: data.sEmail }, { expiresIn: 300 });
            const sLink = `${process.env.BASE_API_PATH}/admin/auth/email/verify/${sLinkToken}`;
            updateObj.$set.sVerificationToken = sLinkToken;
            updateObj.$pull.aJwtTokens = req.token;
            const response = await mailer.send({ sEmail: data.sEmail, sLink, type: 'verifyEmail' });
            if (!response)
                return res.reply(messages.server_error());
        }
        if (data.sUsername)
            updateObj.$set.sUsername = data.sUsername;
        await Admin.updateOne({ _id: admin._id }, updateObj);
        return res.reply(messages.successfully('Your changes updated'), body);
    }),
    updatePassword: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sPassword', 'sNewPassword']);
        const [error, data] = validateAdminSchema({ sPassword: body.sNewPassword });
        if (error)
            return res.reply(messages.unprocessableEntity(), _.parse(error));
        if (!_.comparePassword(body.sPassword, req.admin.sPassword))
            return res.reply(messages.wrong_password());
        if (body.sPassword === body.sNewPassword)
            return res.reply(messages.custom.duplicate_password);
        const query = { _id: req.admin._id };
        const admin = await Admin.findOne(query);
        if (!admin)
            return res.reply(messages.not_found('admin'));
        await Admin.updateOne({ _id: admin._id }, { $pull: { aJwtTokens: req.token }, $set: { sPassword: _.encryptPassword(data.sPassword) } });
        return res.reply(messages.successfully('Password changed'));
    }),
    getProfile: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.admin, ['_id', 'sUsername', 'sEmail', 'sMobile', 'eAdminType']);
        return res.reply(messages.success(), body);
    }),
    logout: _.wrapWithTryCatchAsync(async (req, res) => {
        await Admin.updateOne({ _id: req.admin._id }, { $pull: { aJwtTokens: req.token } });
        return res.reply(messages.success('Logout'));
    }),
};
export default controllers;
