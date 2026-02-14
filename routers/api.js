import StashKu from '@appku/stashku';
import axios from 'axios';
import multer from 'multer';
import BaseRouter from './base-router.js';
// import DemosService from '../services/demos.js';
// import CustomersService from '../services/customers.js';
import AIPictureService from '../services/ai-picture-service.js';

class APIRouter extends BaseRouter {

    /**
     * @inheritdoc
     */
    constructor(app, router, log, db) {
        super(app, router, log, db);
        let upload = multer();
        let stash = new StashKu({
            engine: '@appku/stashku-sql',
            middleware: [log]
        });
        this.axios = axios;
        //attaching services example
        // const ds = new DemosService(stash, log, db);
        // const cs = new CustomersService(stash, log, db);
        const aps = new AIPictureService(stash, log, db);

        
        //routes examples
        // router.get('/api/demos-1', ds.readMessage.bind(ds));
        // router.get('/api/demos-2', ds.readEnvVars.bind(ds));
        // router.get('/api/demos-3', ds.readRemoteData.bind(ds));
        // router.get('/api/demos-4', ds.readJSONData.bind(ds));

        // router.post('/api/customers', cs.createCustomers.bind(cs));
        // router.get('/api/customers', cs.readCustomers.bind(cs));
        // router.put('/api/customers',  cs.updateCustomers.bind(cs));
        // router.delete('/api/customers', cs.deleteCustomers.bind(cs));
        router.get('/api/test', aps.get.bind(aps));
        router.post('/api/ai-picture', aps.post.bind(aps));

    }
}

export default APIRouter;
