import { WithId } from 'mongodb';
import { Type, Static } from '@sinclair/typebox';
import { ePermissionType, eStatus } from '../../../../types/enum.js';

const rolesSchema = Type.Object({
    sName: Type.Optional(Type.String()),
    aPermission: Type.Optional(
        Type.Array(
            Type.Object({
                ePermission: Type.Optional(Type.String()),
                ePermissionType: Type.Optional(Type.Enum(ePermissionType, { default: ePermissionType.W })),
            })
        )
    ),
    eStatus: Type.Optional(Type.Enum(eStatus, { default: eStatus.Y })),
    dCreatedDate: Type.Optional(Type.Date({ default: new Date() })),
    dUpdatedDate: Type.Optional(Type.Date({ default: new Date() })),
});

type IRoles = Static<typeof rolesSchema>;
type IRoleWithId = WithId<IRoles>;

const Roles = db.collection<IRoles>('roles');

export { IRoleWithId, IRoles, rolesSchema };
export default Roles;
