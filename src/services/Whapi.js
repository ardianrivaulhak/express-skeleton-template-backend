import axios from 'axios';
import configs from '../configs/index.js';

class Whapi {
  #api;
  #key;
  constructor() {
    this.#api = axios.create({
      baseURL: configs.whapi.key,
    });
    this.#key = configs.service.whapiKey;
  }
  sendMessage(phone, message) {
    if (configs.app.env == 'local') {
      return true;
    }
    return this.#api.post('sendMessage', {
      apiKey: this.#key,
      phone,
      message,
    });
  }
}

export default new Whapi();
