import { WithId } from 'mongodb';
import { Type, Static } from '@sinclair/typebox';

const permissionSchema = Type.Object({
    sKey: Type.Optional(Type.String()),
    dCreatedDate: Type.Optional(Type.Date({ default: new Date() })),
    dUpdatedDate: Type.Optional(Type.Date({ default: new Date() })),
});

type IPermission = Static<typeof permissionSchema>;
type IPermissionWithId = WithId<IPermission>;

const Permissions = db.collection<IPermission>('permissions');

export { IPermissionWithId, IPermission, permissionSchema };
export default Permissions;
