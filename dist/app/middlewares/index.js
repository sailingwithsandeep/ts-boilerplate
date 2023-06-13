import { Admin } from '../models/index.js';
const middlewares = {
    isAdminAuthenticated: _.wrapWithTryCatchAsync(async (req, res, next) => {
        const token = req.header('authorization');
        if (!token)
            return res.reply(messages.unauthorized());
        const decodedToken = _.verifyToken(token);
        if (!decodedToken)
            return res.reply(messages.unauthorized());
        const user = await Admin.findOne({ _id: _.ObjectId(decodedToken._id), aJwtTokens: token });
        if (!user)
            return res.reply(messages.unauthorized());
        if (user.eStatus === 'D')
            return res.reply(messages.custom.admin_deleted);
        if (user.eStatus === 'N')
            return res.reply(messages.custom.admin_blocked);
        req.admin = user;
        req.token = token;
        next();
    }),
};
export default middlewares;
