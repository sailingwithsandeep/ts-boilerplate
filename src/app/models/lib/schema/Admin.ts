import { WithId } from 'mongodb';
import { Type, Static } from '@sinclair/typebox';
import { eStatus, eAdminType } from '../../../../types/enum.js';

const AdminSchema = Type.Object({
    sUsername: Type.Optional(Type.String()),
    sEmail: Type.Optional(Type.String({ minLength: 3, pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$', default: '' })),
    sMobile: Type.Optional(Type.String()),
    iRoleId: Type.Optional(Type.String({ pattern: '^[0-9a-fA-F]{24}$', default: '' })),
    sPassword: Type.Optional(Type.String()),
    eAdminType: Type.Optional(Type.Enum(eAdminType, { default: eAdminType.SUPER })),
    eStatus: Type.Optional(Type.Enum(eStatus, { default: eStatus.Y })),
    aJwtTokens: Type.Optional(Type.Array(Type.String())),
    sVerificationToken: Type.Optional(Type.String()),
});

type IAdminType = Static<typeof AdminSchema>;
type AdminWithId = WithId<IAdminType>;

const Admin = db.collection<IAdminType>('admins');

await Admin.createIndexes(
    [
        {
            key: { sEmail: 1 },
        },
        {
            key: { sMobile: 1 },
        },
        {
            key: { sUsername: 1 },
        },
    ],
    {
        unique: true,
    }
);

export { AdminWithId, IAdminType, AdminSchema };
export default Admin;
