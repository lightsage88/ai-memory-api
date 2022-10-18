import dotenv from 'dotenv';
import express from 'express';
import configure from './configure.cjs';
import log from '@appku/stashku-log';
import cors from 'cors';

dotenv.config();
(async () => {
    let port = process.env.NODE_PORT || process.env.PORT || 8080;
    let host = process.env.NODE_HOST || process.env.HOST || '0.0.0.0';
    let app = express();
    await configure.load();
    configure.attach(app);
    log.debug(`NODE_PORT: ${process.env.NODE_PORT}`);
    log.debug(`PORT: ${process.env.PORT}`);
    log.debug(`NODE_HOST: ${process.env.NODE_HOST}`);
    log.debug(`HOST: ${process.env.HOST}`);
    app.listen(port, host, () => {
        app.use(cors())
        console.log(`listening on ${port}`);
        log.info(`Listening on: http://${host}:${port}`)
    });
})();