import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

/**
 * This class configures the express server instance used to serve the application frontend.
 */
class ConfigureExpress {

    /**
     * Constructs a `ConfigureExpress` instance.
     * @param {express} app - The express app.
     * @param {express.Router} router - The top-most express router.
     * @param {log} log - The default logger.
     */
    constructor(app, router, log) {

        /**
         * @type {express}
         */
        this.app = app;

        /**
         * @type {express.Router}
         */
        this.router = router;

        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(expressSession({
            secret: process.env.SESSION_SECRET || 'g9u23Z4f9_3jhi5gKJ=87gr48g44df4RE4uh',
            resave: true,
            saveUninitialized: false
        }));
        // app.use(errorHandler);
        // app.use(router);
        log.debug('Express server has been configured.');
    }
}

export default ConfigureExpress;
