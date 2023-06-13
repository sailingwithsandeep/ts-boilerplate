import logger from './lib/logs.js';
import helper from './lib/helper.js';
import builder from './lib/messages.js';
import _emitter from './lib/emitter.js';
global._ = helper;
global.log = logger;
global.emitter = _emitter;
global.messages = builder;
