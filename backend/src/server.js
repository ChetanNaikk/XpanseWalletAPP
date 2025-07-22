import express from 'express';
import dotenv from 'dotenv';
import { initDB } from "./config/db.js";
import ratelimit from './config/upstash.js';
import ratelimiter from './middleware/rateLimiter.js';

import transactionsRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';

dotenv.config();

const app = express()

if(process.env.NODE_ENV === "production") job.start();
//middleware
app.use(ratelimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
    res.send("It's working");
});

app.use('/api/transactions', transactionsRoute);


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});