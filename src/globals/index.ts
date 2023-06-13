import type { Express } from 'express';
import logger from './lib/logs.js';
import helper from './lib/helper.js';
import builder from './lib/messages.js';
import _emitter from './lib/emitter.js';
import { RedisClient } from '../app/utils/index.js';
import { Db } from 'mongodb';

declare global {
    var _: typeof helper;
    var log: typeof logger;
    var emitter: typeof _emitter;
    var messages: typeof builder;
    var redis: RedisClient; // it will be initialized on  redis.initialize()
    var app: Express;
    var db: Db;
}

global._ = helper;
global.log = logger;
global.emitter = _emitter;
global.messages = builder;
