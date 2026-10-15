import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/authRoutes.js';
import specializationRoutes from './routes/specializationRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { initCronJobs } from './utils/cronJobs.js';
import { setIo } from './utils/notificationHelper.js';

const app = express();
const port = process.env.PORT || 5000;
const httpServer = createServer(app);

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Socket.io Setup (Active in local & persistent environments)
const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            return callback(null, true);
        },
        credentials: true
    }
});

setIo(io);

// Socket.io Connection Logic
io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(userId.toString());
            console.log(`User joined room: ${userId}`);
        }
    });

    socket.on('disconnect', () => {
        // Disconnect handler
    });
});

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        // Allow all origins and reflect back origin for credentials support
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Serverless-Ready Database Connection Caching
let cachedConnection = null;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mediconnect_healthcare';
        cachedConnection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
            family: 4
        });
        console.log('MongoDB connected successfully');
        return cachedConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
};

// Middleware to ensure DB connection per request in serverless environment
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    next();
});

// Root Healthcheck API Endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'Online',
        project: 'MediConnect Healthcare Patient Appointment Booking API',
        version: '1.0.0',
        environment: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Server',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Connect DB initially
connectDB();

// Initialize Cron Jobs (local/dedicated container)
if (!process.env.VERCEL) {
    initCronJobs();
}

// Start HTTP Server when run locally (not in Vercel serverless function)
if (!process.env.VERCEL) {
    httpServer.listen(port, () => {
        console.log(`MediConnect Healthcare Server is running on port: ${port}`);
    });
}

// Export app for Vercel Serverless Function deployment
export default app;
