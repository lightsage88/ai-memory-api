import BaseService from './base-service.js';

class AIPictureService extends BaseService {
    constructor(stash, log, db) {
        super(stash, log, db);
        this.aiPromptsWithArt = [];
    }

    async get(req, res) {
        const [rows] = await this.db.query('SELECT 1 + 1 AS result');
        res.json({ message: 'AI Picture Service is up and running!', rows });
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
            const imageData = [];
            const incomingPrompts = req.body.prompts || (req.body.prompt ? [{ prompt: req.body.prompt, model: req.body.model }] : []);
            console.log('incomingPrompts:', incomingPrompts);

            for (let i = 0; i < incomingPrompts.length; i++) {
                const promptObj = incomingPrompts[i];
                const promptText = promptObj.prompt;

                try {
                    // Call Pixazo.ai Flux Schnell API
                    const upstreamUrl = 'https://gateway.pixazo.ai/flux-1-schnell/v1/getData';
                    const response = await this.axios.post(upstreamUrl, {
                        prompt: promptText,
                        num_steps: 4,
                        height: 512,
                        width: 512
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Ocp-Apim-Subscription-Key': process.env.PIXAZO_API_KEY
                        }
                    });
                    if (response.data && response.data.output) {
                        imageData.push({
                            image_url: response.data.output,
                            promptText,
                    });
                    }
                } catch (err) {
                    this.log.error(`Error generating image for prompt "${promptText}":`, err.message);
                }
            }

            res.json({ imageData });
        } catch (error) {
            this.log.error(error);
            res.status(500).send({ error: error.message });
        }
    }
}

export default AIPictureService;