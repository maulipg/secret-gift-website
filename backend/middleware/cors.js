import cors from 'cors';

const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://secretgiftindia-prog.github.io',
        'https://your-netlify-site.netlify.app',
        /\.netlify\.app$/
      ]
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default corsMiddleware;
