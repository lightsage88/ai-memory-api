import BaseService from './base-service.js';
import { Client  as craiyonClient } from 'craiyon';

class AIPictureService extends BaseService {
    constructor(stash, log, axios, moment) {
        super(stash, log, axios, moment);
        this.craiyon = new craiyonClient();
        this.aiPromptsWithArt = [];
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
            console.log('incoming req', req);
            this.aiPromptsWithArt = [];
            const prompts = req.body.prompts;
            console.log('prompts coming in', prompts);
            for (let i = 0; i < prompts.length; i++) {
                const prompt = prompts[i];
                console.log('das prompt', prompt);
                const promptText = prompt.prompt;
                let response = await this.craiyon.generate({prompt: promptText});
                const artBase64 = response._images[0].base64;
                this.aiPromptsWithArt.push({
                    ...prompt,
                    artBase64
                })
            }
            console.log('sending this back', this.aiPromptsWithArt);
            res.send(this.aiPromptsWithArt);
        } catch (error) {
            this.log.error(error);
            res.send(error);
        } finally {
            this.aiPromptsWithArt = [];
        }
    }
}

export default AIPictureService;