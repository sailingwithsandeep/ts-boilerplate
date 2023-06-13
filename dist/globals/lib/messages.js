class Messages {
    custom;
    constructor() {
        this.custom = {
            custom_message: { code: 200, message: 'custom message' },
            insufficient_balance: { code: 419, message: 'Sorry, You have insufficient balance' },
            wait_for_turn: { code: 419, message: 'Please wait for your turn.' },
            invalid_hand_length: { code: 419, message: 'Invalid hand length' },
            admin_blocked: { code: 419, message: 'Your account is blocked please contact to the support' },
            admin_deleted: { code: 419, message: 'Your account is deleted please contact to the support' },
            user_create_success: { code: 200, message: 'Congratulations!! You have been registered successfully.' },
            login_otp_success: { code: 201, message: 'Verification OTP sent to your registered mobile number.' },
            user_not_found: { code: 404, message: "Sorry, we didn't find any account with that Email id" },
            insufficient_chips: { code: 419, message: 'You have insufficient balance' },
            invalid_password: { code: 419, message: 'Please enter valid password with length 8 to 15.' },
            duplicate_password: { code: 419, message: 'You can not use old password as your new password' },
            username_update_err: { code: 419, message: 'You can not update your user name more than one time.' },
            not_allowed_region: { code: 400, message: 'This game is restricted in your region.' },
            invalid_social_acc: { code: 419, message: 'Invalid social account.' },
            server_error: { code: 500, message: `Internal Server Error!` },
        };
    }
    prepare(code, prefix, message) {
        const str = prefix ? `${prefix} ${message}` : message;
        return {
            code,
            message: str.charAt(0).toUpperCase() + str.slice(1),
        };
    }
    wrong_credentials(prefix = '') {
        return this.prepare(403, prefix, 'Invalid Credentials.');
    }
    invalid_req(prefix = '') {
        return this.prepare(406, prefix, 'Invalid Request');
    }
    invalid_field(prefix = '') {
        return this.prepare(419, prefix, 'Invalid Field');
    }
    wrong_otp(prefix = '') {
        return this.prepare(403, prefix, 'Entered OTP is invalid');
    }
    server_error(prefix = '') {
        return this.prepare(500, prefix, 'Server error');
    }
    server_maintenance(prefix = '') {
        return this.prepare(500, prefix, 'Maintenance mode is active');
    }
    unauthorized(prefix = '') {
        return this.prepare(401, prefix, 'Authentication Error, please try logging again');
    }
    inactive(prefix = '') {
        return this.prepare(403, prefix, 'Inactive');
    }
    not_found(prefix = '') {
        return this.prepare(404, prefix, 'Not found');
    }
    not_matched(prefix = '') {
        return this.prepare(406, prefix, 'Not matched');
    }
    not_verified(prefix = '') {
        return this.prepare(406, prefix, 'Not verified');
    }
    already_exists(prefix = '') {
        return this.prepare(409, prefix, 'Already exists');
    }
    user_deleted(prefix = '') {
        return this.prepare(406, prefix, 'Deleted by admin');
    }
    user_blocked(prefix = '') {
        return this.prepare(406, prefix, 'Blocked by admin');
    }
    required_field(prefix = '') {
        return this.prepare(419, prefix, 'Field required');
    }
    too_many_request(prefix = '') {
        return this.prepare(429, prefix, 'Too many request');
    }
    delete_success(prefix = '') {
        return this.prepare(200, prefix, 'Deleted successfully.');
    }
    expired(prefix = '') {
        return this.prepare(417, prefix, 'Expired');
    }
    canceled(prefix = '') {
        return this.prepare(419, prefix, 'Canceled');
    }
    created(prefix = '') {
        return this.prepare(201, prefix, 'Created');
    }
    updated(prefix = '') {
        return this.prepare(200, prefix, 'Updated');
    }
    deleted(prefix = '') {
        return this.prepare(417, prefix, 'Deleted');
    }
    blocked(prefix = '') {
        return this.prepare(401, prefix, 'Blocked');
    }
    success(prefix = '') {
        return this.prepare(200, prefix, 'Success');
    }
    participant_not_added(prefix = '') {
        return this.prepare(419, prefix, 'Participant not added!');
    }
    successfully(prefix = '') {
        return this.prepare(200, prefix, 'Successfully');
    }
    error(prefix = '') {
        return this.prepare(500, prefix, 'Error');
    }
    wrong_password(prefix = '') {
        return this.prepare(403, prefix, 'Current Password is Incorrect');
    }
    unprocessableEntity(prefix = '') {
        return this.prepare(422, prefix, 'Unprocessable entity.');
    }
    already_verified(prefix = '') {
        return this.prepare(302, prefix, 'Already Verified.');
    }
    bad_permissions(prefix = '') {
        return this.prepare(422, prefix, 'Permissions are invalid!');
    }
    no_prefix(prefix = '') {
        return this.prepare(200, prefix, '');
    }
    getString(key) {
        return this.custom[key].message;
    }
}
export default new Messages();
