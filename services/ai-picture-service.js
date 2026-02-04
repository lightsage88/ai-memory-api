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
                const model = promptObj.model || 'turbo';

                // Send initial processing status for this prompt
                res.write(`data: ${JSON.stringify({ status: 'processing', message: 'queued', prompt: promptText })}\n\n`);

                // Proxy request to subnp.com and stream its response back as SSE-style `data: ` JSON lines
                const upstreamUrl = 'https://subnp.com/api/free/generate';
                const upstream = await this.axios.post(upstreamUrl, { prompt: promptText, model }, { responseType: 'stream', headers: { 'Content-Type': 'application/json' } });

                await new Promise((resolve, reject) => {
                    upstream.data.on('data', (chunk) => {
                        const chunkStr = chunk.toString();
                        const lines = chunkStr.split(/\r?\n/).filter(Boolean);
                        lines.forEach((line) => {
                            // If the upstream already emits SSE-like `data: ` lines, forward them.
                            if (line.startsWith('data:')) {
                                res.write(line + '\n\n');
                                return;
                            }

                            // Try to parse JSON; if parse succeeds, forward as-is, otherwise wrap.
                            let payload;
                            try {
                                payload = JSON.parse(line);
                            } catch (e) {
                                payload = { status: 'processing', message: line };
                            }
                            res.write(`data: ${JSON.stringify(payload)}\n\n`);
                        });
                    });

                    upstream.data.on('end', () => {
                        res.write(`data: ${JSON.stringify({ status: 'complete', prompt: promptText })}\n\n`);
                        resolve();
                    });

                    upstream.data.on('error', (err) => {
                        res.write(`data: ${JSON.stringify({ status: 'error', message: err.message })}\n\n`);
                        reject(err);
                    });
                });
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