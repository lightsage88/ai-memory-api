import StashKu from '@appku/stashku';
import axios from 'axios';
import BaseRouter from './base-router.js';
import AIPictureService from '../services/ai-picture-service.js';
import SampleService from '../services/sample.js';

class APIRouter extends BaseRouter {

    /**
     * @inheritdoc
     */
    constructor(app, router, log, axios) {
        super(app, router, log);
        let stash = new StashKu({
            engine: '@appku/stashku-sql',
            middleware: [log]
        });
        this.axios = axios;
        const aps = new AIPictureService(stash, log);
        const ss = new SampleService(stash, log);

        router.post('/api/ai-picture-single', aps.post.bind(aps));
    }
}

export default APIRouter;
