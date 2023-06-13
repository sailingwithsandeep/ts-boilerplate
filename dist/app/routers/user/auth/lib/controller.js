import { User } from '../../../../models/index.js';
import { validateUserSchema } from '../../../../models/lib/validators/index.js';
const controllers = {
    register: _.wrapWithTryCatchAsync(async (req, res) => {
        req.body = _.pick(req.body, ['sEmail', 'sMobile', 'sUsername', 'eGender', 'eUserType', 'sPassword']);
        const [error, data] = validateUserSchema(req.body);
        if (error)
            return res.reply(messages.unprocessableEntity(), error);
        if (_.isEmptyObject(data))
            return res.reply(messages.server_error());
        let user = await User.findOne({ sEmail: req.body.sEmail });
        if (user)
            return res.reply(messages.already_exists('Email'));
        // data.sPassword = _.encryptPassword(req.body.sPassword);
        const newUser = await User.insertOne(data);
        await User.updateOne({ _id: newUser.insertedId }, { $set: { sToken: _.encodeToken({ _id: newUser.insertedId.toString() }), dUpdatedDate: new Date() } });
        return res.reply(messages.successfully('Register'));
    }),
    login: _.wrapWithTryCatchAsync(async (req, res) => {
        req.body = _.pick(req.body, ['sLogin']);
        const query = {
            $or: [{ sEmail: req.body.sLogin }, { sMobile: req.body.sLogin }],
        };
        const user = await User.findOne(query);
        if (!user)
            return res.reply(messages.not_found('User'));
        // if (!_.comparePassword(req.body.sPassword, user.sPassword as string)) return res.reply(messages.wrong_credentials());
        await User.updateOne({ _id: user._id }, { $set: { sToken: _.encodeToken({ _id: user._id.toString() }), dUpdatedDate: new Date() } });
        return res.reply(messages.successfully('Login'), {}, { Authorization: user.sToken });
    }),
};
export default controllers;
