import console from 'console';

interface ILogType {
    black(logs: any): void;
    red(logs: any): void;
    green(logs: any): void;
    yellow(logs: any): void;
    blue(logs: any): void;
    magenta(logs: any): void;
    cyan(logs: any): void;
    white(logs: any): void;
    grey(logs: any): void;
    console(logs: any): void;
    error(logs: any): void;
    warn(logs: any): void;
    table(logs: any): void;
    info(logs: any): void;
    trace(logs: any): void;
}

function prepare(color: string, ...logs: any[]) {
    const aLogs = [];
    for (let iter = 0; iter < logs.length; iter += 1) {
        aLogs.push(`\x1b${color}`);
        aLogs.push(typeof logs[iter] === 'object' ? JSON.stringify(logs[iter], null, 2) : logs[iter]);
    }
    aLogs.push('\x1b[0m');
    console.log(...aLogs);
}

const log: ILogType = {
    black: () => {},
    red: () => {},
    green: () => {},
    yellow: () => {},
    blue: () => {},
    magenta: () => {},
    cyan: () => {},
    white: () => {},
    grey: () => {},
    console: () => {},
    error: () => {},
    warn: () => {},
    table: () => {},
    info: () => {},
    trace: () => {},
};

log.black = (...logs) => prepare('\x1b[30m', ...logs);
log.red = (...logs) => prepare('\x1b[31m', ...logs);
log.green = (...logs) => prepare('\x1b[32m', ...logs);
log.yellow = (...logs) => prepare('\x1b[93m', ...logs);
log.blue = (...logs) => prepare('\x1b[1;94m', ...logs);
log.magenta = (...logs) => prepare('\x1b[35m', ...logs);
log.cyan = (...logs) => prepare('\x1b[1;36m', ...logs);
log.white = (...logs) => prepare('\x1b[37m', ...logs);
log.grey = (...logs) => prepare('\x1b[90m', ...logs);
log.console = console.log;
log.error = console.error;
log.warn = console.warn;
log.table = console.table;
log.info = console.info;
log.trace = console.trace;
export default log;
