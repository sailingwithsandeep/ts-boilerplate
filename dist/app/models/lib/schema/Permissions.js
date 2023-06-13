import { Type } from '@sinclair/typebox';
const permissionSchema = Type.Object({
    sKey: Type.Optional(Type.String()),
    dCreatedDate: Type.Optional(Type.Date({ default: new Date() })),
    dUpdatedDate: Type.Optional(Type.Date({ default: new Date() })),
});
const Permissions = db.collection('permissions');
export { permissionSchema };
export default Permissions;
