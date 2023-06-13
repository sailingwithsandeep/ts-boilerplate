import { Type } from '@sinclair/typebox';
import { ePermissionType, eStatus } from '../../../../types/enum.js';
const rolesSchema = Type.Object({
    sName: Type.Optional(Type.String()),
    aPermission: Type.Optional(Type.Array(Type.Object({
        ePermission: Type.Optional(Type.String()),
        ePermissionType: Type.Optional(Type.Enum(ePermissionType, { default: ePermissionType.W })),
    }))),
    eStatus: Type.Optional(Type.Enum(eStatus, { default: eStatus.Y })),
    dCreatedDate: Type.Optional(Type.Date({ default: new Date() })),
    dUpdatedDate: Type.Optional(Type.Date({ default: new Date() })),
});
const Roles = db.collection('roles');
export { rolesSchema };
export default Roles;
