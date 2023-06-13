if ((await import('dotenv')).default.config().error) {
    console.error('No environment variables found!!');
    process.exit(1);
}

import('./globals/index.js');
const app = (await import('./app.js')).default;

export default app;
