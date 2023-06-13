import { ePermissionType, eStatus } from '../../../../../types/enum.js';
import { Permissions, Roles } from '../../../../models/index.js';
import { validateRoleSchema } from '../../../../models/lib/validators/index.js';

const controllers = {
    createRole: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sName', 'aPermission']);

        const [error, data] = validateRoleSchema(body);

        if (error) return res.reply(messages.unprocessableEntity(), _.parse(error));

        if (data.aPermission?.length) {
            const aPermission = data.aPermission.map(e => e.ePermission);
            const permissions = await Permissions.find({}).toArray();
            if (!permissions.length) return res.reply(messages.not_found('Permissions'));

            const isValid = permissions.every(({ sKey }) => aPermission.includes(sKey));
            if (!isValid) return res.reply(messages.bad_permissions());
        }

        const role = await Roles.findOne({ sName: data.sName });
        if (role) return res.reply(messages.already_exists('Role'));

        await Roles.insertOne(data);

        return res.reply(messages.successfully('Role added'));
    }),

    listRoles: _.wrapWithTryCatchAsync(async (req, res) => {
        let { start = 0, limit = 10, sort = 'dCreatedDate', order, search } = req.query;
        start = parseInt(start as string);
        limit = parseInt(limit as string);
        const orderBy = order && order === 'asc' ? 1 : -1;

        const query: Record<string, any> = { eStatus: { $ne: eStatus.D } };
        if (search) query.sName = { $regex: new RegExp('^.*' + search + '.*', 'i') };

        const count = await Roles.countDocuments(query);
        const roles = await Roles.find(query, { projection: { dCreatedDate: false, dUpdatedDate: false } })
            .sort({ [sort as string]: orderBy })
            .skip(start)
            .limit(limit)
            .toArray();

        if (!roles.length) return res.reply(messages.not_found('Roles'));

        return res.reply(messages.successfully('Roles fetched'), { roles, count });
    }),

    editRole: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sName', 'aPermission', 'eStatus']);

        const [error, data] = validateRoleSchema(body);

        if (error) return res.reply(messages.unprocessableEntity(), _.parse(error));

        const updateObj: Record<string, any> = { $set: { dUpdatedDate: data.dUpdatedDate }, $pull: {} };

        if (data.aPermission?.length) {
            const aPermission = data.aPermission.map(e => e.ePermission);
            const permissions = await Permissions.find({}).toArray();
            if (!permissions.length) return res.reply(messages.not_found('Permissions'));

            const isValid = permissions.every(({ sKey }) => aPermission.includes(sKey));
            if (!isValid) return res.reply(messages.bad_permissions());
            updateObj.$set.aPermission = data.aPermission;
        }

        const role = await Roles.findOne({ _id: _.ObjectId(req.params.id), eStatus: { $ne: eStatus.D } });
        if (!role) return res.reply(messages.not_found('Role'));

        if (data.sName) {
            const role = await Roles.findOne({ sName: data.sName, _id: { $ne: _.ObjectId(req.params.id) } });
            if (role) return res.reply(messages.already_exists('Role'));
            updateObj.$set.sName = data.sName;
        }
        if (data.eStatus) updateObj.$set.eStatus = data.eStatus;

        await Roles.updateOne({ _id: role._id }, updateObj);
        return res.reply(messages.successfully('Your changes updated'));
    }),

    deleteRole: _.wrapWithTryCatchAsync(async (req, res) => {
        const role = await Roles.findOne({ _id: _.ObjectId(req.params.id) });
        if (!role) return res.reply(messages.not_found('Role'));

        // TODO assign default role to each admin when deleting role!
        await Roles.updateOne({ _id: role._id }, { $set: { eStatus: eStatus.D } });
        return res.reply(messages.successfully('Role deleted'));
    }),

    createPermission: _.wrapWithTryCatchAsync(async (req, res) => {
        const body = _.pick(req.body, ['sKey']);
        if (!body.sKey || typeof body.sKey != 'string') return res.reply(messages.unprocessableEntity(), { path: 'sKey', message: 'Must be a string!' });

        const checkExists = await Permissions.findOne({ sKey: body.sKey });
        if (checkExists) return res.reply(messages.already_exists('Permission'));

        await Permissions.insertOne({ sKey: body.sKey });

        //*  Update all roles with assigning new permissions of none(No Read + No Write) rights
        const roles = await Roles.find({}).toArray();
        if (roles.length) await Roles.updateMany({}, { $push: { aPermissions: { sKey: body.sKey, eType: ePermissionType.N } } });

        return res.reply(messages.successfully('Permission added'));
    }),

    listPermission: _.wrapWithTryCatchAsync(async (req, res) => {
        let { start = 0, limit = 10, sort = 'dCreatedDate', order, search } = req.query;
        start = parseInt(start as string);
        limit = parseInt(limit as string);
        const orderBy = order && order === 'asc' ? 1 : -1;

        const query: Record<string, any> = {};
        if (search) query.sName = { $regex: new RegExp('^.*' + search + '.*', 'i') };

        const count = await Permissions.countDocuments(query);
        const permissions = await Permissions.find(query, { projection: { dCreatedDate: false, dUpdatedDate: false } })
            .sort({ [sort as string]: orderBy })
            .skip(start)
            .limit(limit)
            .toArray();

        if (!permissions.length) return res.reply(messages.not_found('Permissions'));

        return res.reply(messages.successfully('Permissions fetched'), { permissions, count });
    }),

    editPermission: _.wrapWithTryCatchAsync(async (req, res) => {
        // TODO
        return;
    }),
};

export default controllers;
