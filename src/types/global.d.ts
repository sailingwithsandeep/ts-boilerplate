import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { eStatus } from './enum';
import { UserWithId } from '../app/models/lib/schema/User.ts';
import { AdminWithId } from '../app/models/lib/schema/Admin.ts';

declare interface IMetaData {
    code: number;
    message: string;
}

declare interface ICustomMessages {
    [key: string]: IMetaData;
    custom_message: IMetaData;
    insufficient_balance: IMetaData;
    wait_for_turn: IMetaData;
    invalid_hand_length: IMetaData;
    admin_blocked: IMetaData;
    admin_deleted: IMetaData;
    user_create_success: IMetaData;
    login_otp_success: IMetaData;
    user_not_found: IMetaData;
    invalid_password: IMetaData;
    duplicate_password: IMetaData;
    username_update_err: IMetaData;
    not_allowed_region: IMetaData;
    invalid_social_acc: IMetaData;
    server_error: IMetaData;
}

declare type IReply = ({ code, message }: IMetaData, data: any = {}, header: unknown = undefined) => void;
declare type IControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void>;

interface IController {
    [index: string]: IControllerType;
}

declare interface ICallback {
    (message?: Record<string, unknown> | string | boolean | null, data?: any): void;
}

declare module 'express-serve-static-core' {
    interface Request {
        user: UserWithId;
        admin: AdminWithId;
        settings: ISetting;
        protoData: ITablePrototypeType;
        table: ITableType;
        sRemoteAddress: string;
        token: string;
    }
    interface Response {
        reply: IReply;
    }
}
