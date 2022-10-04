import BaseService from './base-service.js';
import { Filter } from '@appku/stashku';
// import axios from 'axios';


/**
 * The SampleService will serve as a playground and reminder of sorts of how to do certain things when you come back from a hiatus
 */
class SampleService extends BaseService {
    constructor(stash, log, axios) {
        super(stash, log, axios);
    }

    async sayHello(req, res) {
        this.log.debug('sayHello is running...');
        let number = Math.floor(Math.random() * (199 + 1));
        console.log('ZE NUMBAH', number);
        let response = await this.axios.get(`https://jsonplaceholder.typicode.com/todos/${number}`);
        this.log.debug(response.data.title);
        res.json(response.data.title);
    }
}

export default SampleService;