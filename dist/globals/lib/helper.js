import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Value } from '@sinclair/typebox/value';
import { ObjectId } from 'mongodb';
const validation = {
    imageMimeTypes: ['image/png', 'image/jpeg'],
    imageExtensions: ['jpeg', 'jpg', 'png'],
    imageFormat: [
        { extension: 'jpeg', type: 'image/jpeg' },
        { extension: 'jpg', type: 'image/jpeg' },
        { extension: 'png', type: 'image/png' },
        { extension: 'heic', type: 'image/heic' },
        { extension: 'heif', type: 'image/heif' },
    ],
};
const helper = {
    code: {
        Continue: 100,
        Switching_Protocols: 101,
        Processing: 102,
        Early_Hints: 103,
        OK: 200,
        Created: 201,
        Accepted: 202,
        'Non-Authoritative_Information': 203,
        No_Content: 204,
        Reset_Content: 205,
        Partial_Content: 206,
        'Multi-Status': 207,
        Already_Reported: 208,
        IM_Used: 226,
        Multiple_Choices: 300,
        Moved_Permanently: 301,
        Found: 302,
        See_Other: 303,
        Not_Modified: 304,
        Use_Proxy: 305,
        Temporary_Redirect: 307,
        Permanent_Redirect: 308,
        Bad_Request: 400,
        Unauthorized: 401,
        Payment_Required: 402,
        Forbidden: 403,
        Not_Found: 404,
        Method_Not_Allowed: 405,
        Not_Acceptable: 406,
        Proxy_Authentication_Required: 407,
        Request_Timeout: 408,
        Conflict: 409,
        Gone: 410,
        Length_Required: 411,
        Precondition_Failed: 412,
        Payload_Too_Large: 413,
        URI_Too_Long: 414,
        Unsupported_Media_Type: 415,
        Range_Not_Satisfiable: 416,
        Expectation_Failed: 417,
        "I'm_a_Teapot": 418,
        Misdirected_Request: 421,
        Unprocessable_Entity: 422,
        Locked: 423,
        Failed_Dependency: 424,
        Too_Early: 425,
        Upgrade_Required: 426,
        Precondition_Required: 428,
        Too_Many_Requests: 429,
        Request_Header_Fields_Too_Large: 431,
        Unavailable_For_Legal_Reasons: 451,
        Internal_Server_Error: 500,
        Not_Implemented: 501,
        Bad_Gateway: 502,
        Service_Unavailable: 503,
        Gateway_Timeout: 504,
        HTTP_Version_Not_Supported: 505,
        Variant_Also_Negotiates: 506,
        Insufficient_Storage: 507,
        Loop_Detected: 508,
        Bandwidth_Limit_Exceeded: 509,
        Not_Extended: 510,
        Network_Authentication_Required: 511,
    },
    isObject: (o) => {
        return o instanceof Object && o.constructor === Object;
    },
    handleCatchError: (error, res) => {
        log.error(`Damn son, That's quite a mess you got there!  \n----------ERROR--------- ${error.message}, stack: ${error.stack} `);
        return res.reply(messages.custom.server_error);
    },
    salt(length, type) {
        if (process.env.NODE_ENV !== 'prod')
            return 1234;
        if (type === 'string') {
            return crypto
                .randomBytes(Math.ceil(length / 2))
                .toString('hex')
                .slice(0, length);
        }
        let min = 1;
        let max = 9;
        for (let i = 1; i < length; i += 1) {
            min += 0;
            max += 9;
        }
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isDate: (o) => {
        return o instanceof Object && o.constructor === Date;
    },
    parse: (data) => {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return data;
        }
    },
    stringify: (data, offset = 0) => {
        return JSON.stringify(data, null, offset);
    },
    toString: (key) => {
        try {
            return key.toString();
        }
        catch (error) {
            return '';
        }
    },
    capitalize: (s) => (s && s[0].toUpperCase() + s.slice(1)) || '',
    getRandomNumber: (min = 0, max = 100000) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isEqual: (id1, id2) => {
        return (id1 ? id1.toString() : id1) === (id2 ? id2.toString() : id2);
    },
    pick: (obj, array) => {
        const clonedObj = helper.clone(obj);
        return array.reduce((acc, elem) => {
            if (elem in clonedObj)
                acc[elem] = clonedObj[elem];
            return acc;
        }, {});
    },
    isEmail(email) {
        const regeX = /[a-z0-9._%+-]+@[a-z0-9-]+[.]+[a-z]{2,5}$/;
        return !regeX.test(email);
    },
    isEmpty: (obj) => {
        if (obj === null || obj === undefined || Array.isArray(obj) || typeof obj !== 'object') {
            return true;
        }
        return Object.getOwnPropertyNames(obj).length === 0;
    },
    randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isValidDate: (d) => d instanceof Date && !isNaN(d),
    now: () => {
        const dt = new Date();
        return `[${`${dt}`.split(' ')[4]}:${dt.getMilliseconds()}]`;
    },
    ISODate: () => {
        const date = new Date();
        return date.toISOString();
    },
    getTimeDifference(start, end) {
        const diff = end.getTime() - start.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const seconds = Math.floor(diff / 1000) % 60;
        return {
            days,
            hours,
            minutes,
            seconds,
            ms: diff % 1000,
        };
    },
    getTimeDifferenceFormatted(start, end) {
        const diff = end.getTime() - start.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor(diff / 1000);
        const ms = diff;
        return {
            days,
            hours,
            minutes,
            seconds,
            ms,
        };
    },
    delay: (ttl) => new Promise(resolve => setTimeout(resolve, ttl)),
    getRandomWithProbability: (results, weights) => {
        let s = 0;
        const num = Math.random();
        const lastIndex = weights.length - 1;
        for (let i = 0; i < lastIndex; i += 1) {
            s += weights[i];
            if (num < s)
                return results[i];
        }
        return results[lastIndex];
    },
    findMaxFromArrayOfObject: (arrayOfObject, fieldToCheck) => {
        let index = 0;
        let temp = -Infinity;
        for (let i = 0; i < arrayOfObject.length; i += 1) {
            if (temp <= arrayOfObject[i][fieldToCheck]) {
                temp = arrayOfObject[i][fieldToCheck];
                index = i;
            }
        }
        return arrayOfObject[index];
    },
    randomizeAlphaNumericString: (length, size) => {
        let result = '';
        const output = new Set();
        const characters = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'; // used 0-9 twice to reduce generating only chars string
        const charactersLength = characters.length;
        for (let j = 0; j < size; j += 1) {
            for (let i = 0; i < length; i += 1) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            output.add(result);
            result = '';
        }
        return [...output];
    },
    decodeToken: (token) => {
        try {
            return jwt.decode(token);
        }
        catch (error) {
            return undefined;
        }
    },
    clone: (data) => {
        const originalData = data.toObject ? data.toObject() : data; // for mongodb result operations
        const eType = originalData ? originalData.constructor : 'normal';
        if (eType === Object)
            return { ...originalData };
        if (eType === Array)
            return [...originalData];
        return data;
        // return JSON.parse(JSON.stringify(data));
    },
    isEmptyObject(obj = {}) {
        return !Object.keys(obj).length;
    },
    encodeToken: (body, expTime) => {
        try {
            return expTime ? jwt.sign(helper.clone(body), process.env.JWT_SECRET) : jwt.sign(helper.clone(body), process.env.JWT_SECRET);
        }
        catch (error) {
            return undefined;
        }
    },
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                return err ? err.message : decoded; // return true if token expired
            });
        }
        catch (error) {
            return error ? error.message : error;
        }
    },
    addDays: (date, days) => {
        const inputDate = new Date(date);
        return new Date(inputDate.setDate(inputDate.getDate() + days));
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    emptyCallback: (error, response) => { },
    encryptPassword: (password) => {
        const numberOfSalt = 1;
        const salt = bcrypt.genSaltSync(numberOfSalt);
        return bcrypt.hashSync(password, salt);
    },
    isoTimeString() {
        const today = new Date();
        return today;
    },
    errorCallback: (error) => {
        if (error)
            console.log(error);
    },
    getDate(_date = undefined, currentTime = false) {
        const date = _date ? new Date(_date) : new Date();
        if (!currentTime)
            date.setHours(0, 0, 0, 0);
        // const timeOffset = date.getTimezoneOffset() === 0 ? 19800000 : 0;
        // return new Date(date.toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }));
        return new Date(date - date.getTimezoneOffset() * 60000);
    },
    formattedDate: () => {
        return new Date().toLocaleString('en-us', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    },
    checkValidImageType: (sFileName, sContentType) => {
        const extension = sFileName.split('.').pop().toLowerCase();
        const valid = validation.imageFormat.find(format => format.extension === extension && format.type === sContentType);
        return !!valid;
    },
    wrapWithTryCatchAsync: function (fn) {
        return async function asyncHandler(req, res, next) {
            try {
                await fn(req, res, next);
            }
            catch (error) {
                _.handleCatchError(error, res);
            }
        };
    },
    removeNull: (obj) => {
        for (const propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
                delete obj[propName];
            }
        }
    },
    removeNullUndefined: (object, body) => {
        for (const key of body) {
            object[key] = !body[key] ? null : body[key];
        }
    },
    comparePassword: function (bodyPassword, dbPassword) {
        return bcrypt.compareSync(bodyPassword, dbPassword);
    },
    validateFactory: (schema) => {
        function applyDefaults(obj, schema) {
            if (_.isEmptyObject(obj))
                throw new Error('Empty Body!!');
            Object.entries(schema.properties).forEach(([key, value]) => {
                if (value.default && !obj[key]) {
                    obj[key] = value.default;
                    obj['dCreatedDate'] = new Date();
                    obj['dUpdatedDate'] = new Date();
                }
                else if (Array.isArray(obj[key]) && key == 'arrayObjectField')
                    for (const iterator of obj[key])
                        iterator.id = _.ObjectId();
                // * For adding objectId in nested docs
            });
            return obj;
        }
        const C = TypeCompiler.Compile(schema);
        /**
         * validate data as per schema, and throws error if invalid
         * @param data input data that needs validation
         * @returns data
         */
        const verify = (data) => {
            // try {
            const isValid = C.Check(data);
            const modifiedData = Value.Cast(schema, data); // - it will auto cast value to schema type
            try {
                const defaults = applyDefaults(modifiedData, schema);
                if (isValid && defaults)
                    return [null, defaults];
            }
            catch (error) {
                return [error, {}];
            }
            return [_.stringify([...C.Errors(data)].map(({ path, message }) => ({ path, message }))), {}];
            // } catch (err: any) {
            //     log.error(`error on validatorFactory.verify(). \nREASON: ${err.message} \nPAYLOAD: ${JSON.stringify(data)}`);
            //     return [err, {} as T];
            // }
        };
        return { schema, verify };
    },
    stringToArray: function (str) {
        try {
            if (!str.length)
                return str;
            const arrayStartIndex = str.indexOf('[');
            const arrayEndIndex = str.lastIndexOf(']');
            const output = [];
            if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
                const arrayString = str.substring(arrayStartIndex, arrayEndIndex + 1);
                const array = eval?.(`"use strict";(${arrayString})`);
                for (const iterator of array)
                    output.push(iterator);
            }
            return output;
        }
        catch (error) {
            return str;
        }
    },
    ObjectId: (id = '') => (id ? new ObjectId(id) : new ObjectId()),
};
export default helper;
