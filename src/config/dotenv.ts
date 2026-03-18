import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config({ path: '.env' }));

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const TIMEZONE = process.env.TIMEZONE || 'Asia/Bangkok';
