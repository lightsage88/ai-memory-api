import BaseService from './base-service.js';

class AIPictureService extends BaseService {
    constructor(stash, log) {
        super(stash, log);
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
            this.aiPromptsWithArt = [];

            const incomingPrompts = req.body.prompts || (req.body.prompt ? [{ prompt: req.body.prompt, model: req.body.model }] : []);
            console.log('incomingPrompts:', incomingPrompts);

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            if (res.flushHeaders) res.flushHeaders();

            for (let i = 0; i < incomingPrompts.length; i++) {
                const promptObj = incomingPrompts[i];
                const promptText = promptObj.prompt;

                // Send initial processing status for this prompt
                res.write(`data: ${JSON.stringify({ status: 'processing', message: 'Generating image...', prompt: promptText })}\n\n`);

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
                        res.write(`data: ${JSON.stringify({ status: 'complete', prompt: promptText, imageUrl: response.data.output })}\n\n`);
                    } else {
                        res.write(`data: ${JSON.stringify({ status: 'error', message: 'No image URL returned', prompt: promptText })}\n\n`);
                    }
                } catch (err) {
                    res.write(`data: ${JSON.stringify({ status: 'error', message: err.message, prompt: promptText })}\n\n`);
                }
            }

            res.end();
        } catch (error) {
            this.log.error(error);
            try {
                res.write(`data: ${JSON.stringify({ status: 'error', message: error.message })}\n\n`);
                res.end();
            } catch (e) {
                res.status(500).send({ error: error.message });
            }
        } finally {
            this.aiPromptsWithArt = [];
        }
    }
}

export default AIPictureService;