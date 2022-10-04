import BaseService from './base-service.js';
import { Client  as craiyonClient } from 'craiyon';

class AIPictureService extends BaseService {
    constructor(stash, log, axios, moment) {
        super(stash, log, axios, moment);
        this.craiyon = new craiyonClient();
    }

    /**
     * This method makes a post request to the AI Picture Service. It will leverage the class'
     * instance of 'Client' from 'craiyon' and will use the prompt string from the request body
     * to create an image using the AI driven picture generator and then will send the base64
     * of that image back as the response
     * @param {Object} req - the request body
     * @param {Object} res - the response body
     * @returns {base64} - the picture described by the prompt from the request body.
     */
    async post(req, res) {
        try {
            const prompt = req.body.prompt;
            const response = await this.craiyon.generate({prompt});
            const imageBase64 = response._images[0].base64;
            res.send(imageBase64);
        } catch (error) {
            this.log.error(error);
            res.send(error);
        }
    }
}

export default AIPictureService;