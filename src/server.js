import path from 'path';
import express from 'express';
import configs from './configs/index.js';
import routes from './routes/index.js';
import cors from 'cors';
import './models/index.js';
global.__dirname = path.resolve('./');

const app = express();
const { name, host, port, uriPrefix } = configs.app;

app.use(express.json()); // for parsing application/json
app.use(cors());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(uriPrefix, routes);

app.listen({ host, port });

console.log(`${name} is listening on ${host}:${port}${uriPrefix}`);
