import { AdminSchema } from '../schema/Admin.js';
import { rolesSchema } from '../schema/Roles.js';
import { UserSchema } from '../schema/User.js';
import { userVerificationSchema } from '../schema/UserVerifications.js';
const validateAdminSchema = (payload) => _.validateFactory(AdminSchema).verify(payload);
const validateUserSchema = (payload) => _.validateFactory(UserSchema).verify(payload);
const validateUserVerificationSchema = (payload) => _.validateFactory(userVerificationSchema).verify(payload);
const validateRoleSchema = (payload) => _.validateFactory(rolesSchema).verify(payload);
export { validateAdminSchema, validateUserSchema, validateUserVerificationSchema, validateRoleSchema };
