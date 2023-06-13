import { AdminSchema, IAdminType } from '../schema/Admin.js';
import { IRoles, rolesSchema } from '../schema/Roles.js';
import { IUserType, UserSchema } from '../schema/User.js';
import { IUserVerificationType, userVerificationSchema } from '../schema/UserVerifications.js';

const validateAdminSchema = (payload: IAdminType) => _.validateFactory<IAdminType>(AdminSchema).verify(payload);
const validateUserSchema = (payload: IUserType) => _.validateFactory<IUserType>(UserSchema).verify(payload);
const validateUserVerificationSchema = (payload: IUserVerificationType) => _.validateFactory<IUserVerificationType>(userVerificationSchema).verify(payload);
const validateRoleSchema = (payload: IRoles) => _.validateFactory<IRoles>(rolesSchema).verify(payload);

export { validateAdminSchema, validateUserSchema, validateUserVerificationSchema, validateRoleSchema };
