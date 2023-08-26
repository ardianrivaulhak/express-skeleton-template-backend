import { config } from 'dotenv';
config({ override: true });

export default {
    app: {
        env: process.env.APP_ENV || 'local',
        name: process.env.APP_NAME || 'RESTfull API with Express.js Framework',
        locale: process.env.LOCALE || 'en',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 3333,
        uriPrefix: process.env.URI_PREFIX || '/api/',
        merchantName: process.env.MERCHANT_NAME || 'Denger-ind',
    },
    database: {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    service: {
        apiGatewayUrl: process.env.API_GATEWAY_URL,
        whapiKey: process.env.WHAPI_KEY
    },
    auth : {
        key : process.env.AUTH_SECRET_KEY
    },
    whapi : {
        key : process.env.WHAPI_URL
    }
};