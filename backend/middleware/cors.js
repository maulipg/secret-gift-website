import cors from 'cors';

const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://secretgiftindia.shop',
        'http://secretgiftindia.shop',
        'https://www.secretgiftindia.shop',
        'http://www.secretgiftindia.shop',
        'https://secretgiftindia-prog.github.io',
        /\.netlify\.app$/
      ]
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default corsMiddleware;
