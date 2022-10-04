// eslint-disable-next-line no-unused-vars
import log from '@appku/stashku-log';

/**
 * This class provides a shared interface for all server routers.
 */
class BaseRouter {

    /**
     * Constructs a `BaseRouter` instance.
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

        /**
         * @type {log}
         */
        this.log = log;

    }
}

export default BaseRouter;