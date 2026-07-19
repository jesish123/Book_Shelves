const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const primary = process.env.MONGO_URI;
    const local = 'mongodb://localhost:27017/Workshop_4';

    const tryConnect = async (uri, name) => {
        try {
            await mongoose.connect(uri, { dbName: 'Workshop_4' });
            console.log('MongoDB Connected:', mongoose.connection.name, `(${name})`);
            return true;
        } catch (err) {
            console.error(`Connection to ${name} failed:`, err.message);
            return false;
        }
    };

    if (primary) {
        const ok = await tryConnect(primary, 'primary');
        if (ok) return;
        console.log('Falling back to local MongoDB...');
    }

    const okLocal = await tryConnect(local, 'local');
    if (!okLocal) {
        console.error('Primary and local MongoDB connections failed. Attempting in-memory MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const okMem = await tryConnect(uri, 'in-memory');
            if (okMem) {
                console.log('Connected to in-memory MongoDB (development).');
                return;
            }
            console.error('In-memory MongoDB connection failed. Exiting.');
            process.exit(1);
        } catch (err) {
            console.error('Failed to start in-memory MongoDB:', err.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;