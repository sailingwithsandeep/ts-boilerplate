import { User } from '../../../../models/index.js';

const controllers = {
    getProfile: _.wrapWithTryCatchAsync(async (req, res) => {
        req.body = _.pick(req.user, ['_id', 'sEmail', 'sMobile', 'sUsername', 'eGender', 'eUserType']);
        return res.reply(messages.successfully('Get profile'), req.body);
    }),

    changePassword: _.wrapWithTryCatchAsync(async (req, res) => {
        req.body = _.pick(req.body, ['sPassword', 'sNewPassword']);

        if (!req.body.sPassword) return res.reply(messages.required_field('current password'));
        if (!req.body.sNewPassword) return res.reply(messages.required_field('new Password'));

        if (!_.comparePassword(req.body.sPassword, req.user.sPassword)) return res.reply(messages.wrong_password());
        if (req.body.sPassword === req.body.sNewPassword) return res.reply(messages.custom.duplicate_password);

        const query = { _id: req.user._id };
        const updateQuery = { sPassword: _.encryptPassword(req.body.sNewPassword), sToken: '' };

        await User.updateOne(query, { $set: updateQuery });
        return res.reply(messages.successfully('Password changed'));
    }),

    logout: _.wrapWithTryCatchAsync(async (req, res) => {
        const query = { _id: req.user._id };

        await User.updateOne(query, { $unset: { sToken: true } });
        return res.reply(messages.successfully('Logout'));
    }),
};

export default controllers;
