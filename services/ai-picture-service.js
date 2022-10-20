import BaseService from "./base-service.js";
import { Client as craiyonClient } from "craiyon";

class AIPictureService extends BaseService {
  constructor(stash, log, axios, moment) {
    super(stash, log, axios, moment);
    this.craiyon = new craiyonClient();
  }

  /**
   * TODO update this
   * @param {Object} req - the request body
   * @param {Object} res - the response body
   * @returns {base64} - the picture described by the prompt from the request body.
   */
  

  async post(req, res) {
    console.log("postSingle going...");
    try {
      console.log("postSingle running with req.body", req.body);
      const prompt = req.body.body.prompt;
      let response = await this.craiyon.generate({ prompt });
      const artBase64 = response._images[0].base64;
      const toSend = {
        prompt,
        artBase64,
      };
      console.log('toSend', toSend);
      res.json(toSend);
    } catch (error) {
      res.send(error);
    }
  }
}

export default AIPictureService;
