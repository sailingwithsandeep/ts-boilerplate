import { Type } from '@sinclair/typebox';
import { eCountries, eGender, eStatus } from '../../../../types/enum.js';
const UserSchema = Type.Object({
    sUsername: Type.Optional(Type.String()),
    sEmail: Type.Optional(Type.String({ minLength: 3, pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$', default: '' })),
    sMobile: Type.Optional(Type.String()),
    eGender: Type.Optional(Type.Enum(eGender, { default: eGender.M })),
    sCountry: Type.Optional(Type.Enum(eCountries, { default: eCountries.NG })),
    sToken: Type.Optional(Type.String()),
    sSocketId: Type.Optional(Type.String({ default: '' })),
    isEmailVerified: Type.Optional(Type.Boolean({ default: false })),
    bSoundEnabled: Type.Optional(Type.Boolean({ default: true })),
    bTerms: Type.Optional(Type.Boolean({ default: false })),
    eStatus: Type.Optional(Type.Enum(eStatus, { default: eStatus.Y })),
});
const User = db.collection('users');
await User.createIndexes([
    {
        key: { sEmail: 1 },
    },
    {
        key: { sMobile: 1 },
    },
], {
    unique: true,
});
export { UserSchema };
export default User;
