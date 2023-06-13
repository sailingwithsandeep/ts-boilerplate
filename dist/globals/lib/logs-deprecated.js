import console from 'console';
function prepare(color, ...logs) {
    const aLogs = [];
    for (let iter = 0; iter < logs.length; iter += 1) {
        aLogs.push(`\x1b${color}`);
        aLogs.push(typeof logs[iter] === 'object' ? JSON.stringify(logs[iter], null, 2) : logs[iter]);
    }
    aLogs.push('\x1b[0m');
    console.log(...aLogs);
}
const log = {
    black: () => { },
    red: () => { },
    green: () => { },
    yellow: () => { },
    blue: () => { },
    magenta: () => { },
    cyan: () => { },
    white: () => { },
    grey: () => { },
    console: () => { },
    error: () => { },
    warn: () => { },
    table: () => { },
    info: () => { },
    trace: () => { },
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
