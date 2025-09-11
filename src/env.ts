import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env file from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
