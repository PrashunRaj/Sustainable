// models/eventModel.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: '/api/placeholder/800/400'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location:{
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const eventModel = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default eventModel;