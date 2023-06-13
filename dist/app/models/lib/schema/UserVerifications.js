import { Type } from '@sinclair/typebox';
import { eOTPType, eReason } from '../../../../types/enum.js';
const userVerificationSchema = Type.Object({
    sLogin: Type.Optional(Type.String()),
    nOTP: Type.Optional(Type.Number()),
    eOTPType: Type.Optional(Type.Enum(eOTPType)),
    eReason: Type.Optional(Type.Enum(eReason)),
    sVerificationToken: Type.Optional(Type.String()),
    sDeviceToken: Type.Optional(Type.String()),
    iUserId: Type.Optional(Type.String({ pattern: '^[0-9a-fA-F]{24}$', default: '' })),
    bIsVerified: Type.Optional(Type.Boolean({ default: false })),
    dCreatedDate: Type.Optional(Type.Date({ default: new Date() })),
    dUpdatedDate: Type.Optional(Type.Date({ default: new Date() })),
});
const UserVerification = db.collection('userverifications');
export { userVerificationSchema };
export default UserVerification;
