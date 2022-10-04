import log from '@appku/stashku-log';
import StashKu from '@appku/stashku';
import axios from 'axios';
import moment from 'moment';

/**
 * This class provides a shared interface for all server services.
 */
class BaseService {

    /**
     * Constructs a `BaseRouter` instance.
     * @param {StashKu} stash - A shared stashku instance to utilize for database queries.
     * @param {log} log - The default logger.
     */
    constructor(stash, log) {

        /**
         * @type {any}
         */
        this.stash = stash;

        /**
         * @type {any}
         */
        this.log = log;

        /**
         * @type {any}
         */
        this.axios = axios;

        /**
         * @type {any}
         */
        this.moment = moment;
    }

}

export default BaseService;