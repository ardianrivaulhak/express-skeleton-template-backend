import configs from '../configs/index.js';

const validation = import(`./${configs.app.locale}/validation`);
export default {
  validation,
};
