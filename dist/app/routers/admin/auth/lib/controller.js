import { eStatus } from '../../../../../types/enum.js';
import { Admin } from '../../../../models/index.js';
import { validateAdminSchema } from '../../../../models/lib/validators/index.js';
import { mailer } from '../../../../utils/index.js';
const controllers = {
    createAdmin: _.wrapWithTryCatchAsync(async (req, res) => {
        req.body = _.pick(req.body, ['sEmail', 'sMobile', 'sUsername', 'eAdminType', 'sPassword']);
        _.removeNull(req.body);
        const [error, data] = validateAdminSchema(req.body);
        if (error)
            return res.reply(messages.unprocessableEntity(), error);
        if (_.isEmptyObject(data))
            return res.reply(messages.server_error());
        const adminExist = await Admin.findOne({
            $or: [{ sEmail: req.body.sEmail }, { sUsername: req.body.sUsername }, { sMobile: req.body.sMobile }],
            eStatus: { $ne: eStatus.D },
        });
        if (adminExist && adminExist.sUsername === req.body.sUsername)
            return res.reply(messages.already_exists('Username'));
        if (adminExist && adminExist.sEmail === req.body.sEmail)
            return res.reply(messages.already_exists('Email'));
        if (adminExist && adminExist.sMobile === req.body.sMobile)
            return res.reply(messages.already_exists('Mobile'));
        data.sPassword = _.encryptPassword(req.body.sPassword);
        await Admin.insertOne(data);
        // await Admin.updateOne({ _id: newAdmin.insertedId }, { $push: { aJwtTokens: _.encodeToken({ _id: newAdmin.insertedId.toString() }) }, $set: { dUpdatedDate: new Date() } });
        return res.reply(messages.success(`Admin Creation`));
    }),
    login: _.wrapWithTryCatchAsync(async (req, res) => {
        req.body = _.pick(req.body, ['sLogin', 'sPassword']);
        _.removeNull(req.body);
        const query = { $or: [{ sEmail: req.body.sLogin }, { sMobile: req.body.sLogin }] };
        const admin = await Admin.findOne(query);
        if (!admin)
            return res.reply(messages.wrong_credentials());
        if (!_.comparePassword(req.body.sPassword, admin.sPassword))
            return res.reply(messages.wrong_credentials());
        if (admin.eStatus == eStatus.N)
            return res.reply(messages.custom.admin_deleted);
        if (admin.eStatus == eStatus.D)
            return res.reply(messages.custom.admin_deleted);
        const token = _.encodeToken({ _id: admin._id.toString() });
        await Admin.updateOne({ _id: admin._id }, { $push: { aJwtTokens: token }, $set: { dUpdatedDate: new Date() } });
        return res.reply(messages.success('Login'), {}, { authorization: token });
    }),
    forgotPassword: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sEmail']);
        const query = { sEmail: body.sEmail };
        const admin = await Admin.findOne(query);
        if (!admin)
            return res.reply(messages.custom.user_not_found);
        const sLinkToken = _.encodeToken({ sEmail: body.sEmail }, { expiresIn: 300 });
        const sLink = `${process.env.FRONTEND_URL}/reset-password/${sLinkToken}`;
        const response = await mailer.send({ sEmail: body.sEmail, sLink, type: 'forgotPassword-admin', sUsername: admin.sUsername });
        if (!response)
            return res.reply(messages.server_error());
        await Admin.updateOne({ _id: admin._id }, { $set: { sVerificationToken: sLinkToken } });
        return res.reply(messages.no_prefix('Sent reset password link on your email.'), sLink); // token is send as params in resetpassword api
    }),
    verifyEmail: _.wrapWithTryCatchAsync(async (req, res) => {
        if (!req.params.token)
            return res.reply(messages.unauthorized());
        const decodedToken = _.verifyToken(req.params.token);
        if (!decodedToken || decodedToken === 'jwt expired')
            return res.reply(messages.expired('Link'));
        const query = { sEmail: decodedToken.sEmail };
        const admin = await Admin.findOne(query);
        if (!admin)
            return res.reply(messages.already_verified());
        if (admin?.sVerificationToken != req.params.token)
            return res.reply(messages.expired('Link'));
        await Admin.updateOne({ _id: admin._id }, { $set: { sEmail: decodedToken.sNewEmail }, $unset: { sVerificationToken: true } });
        return res.reply(messages.success());
    }),
    resetPassword: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sPassword', 'sConfirmPassword']);
        const params = _.pick(req.params, ['token']);
        if (!params.token)
            return res.reply(messages.unauthorized());
        if (body.sPassword !== body.sConfirmPassword)
            return res.reply(messages.not_matched('Passwords'));
        const decodedToken = _.verifyToken(req.params.token);
        if (!decodedToken || decodedToken === 'jwt expired')
            return res.reply(messages.expired('Link'));
        const query = { sEmail: decodedToken.sEmail };
        const admin = await Admin.findOne(query);
        if (!admin)
            return res.reply(messages.custom.user_not_found);
        if (admin.sVerificationToken != req.params.token)
            return res.reply(messages.expired('Link'));
        await Admin.updateOne({ _id: admin._id }, { $set: { sPassword: body.sPassword }, $unset: { sVerificationToken: true } });
        return res.reply(messages.successfully('Your password has been changed'));
    }),
    verifyToken: _.wrapWithTryCatchAsync(async (req, res) => {
        const params = _.pick(req.params, ['token']);
        const decodedToken = _.verifyToken(req.params.token);
        if (!decodedToken || decodedToken === 'jwt expired')
            return res.reply(messages.expired('Link'));
        const user = await Admin.findOne({ sVerificationToken: params.token });
        if (!user)
            return res.reply(messages.expired('Link'));
        return res.reply(messages.successfully('Token Verified'));
    }),
};
export default controllers;
