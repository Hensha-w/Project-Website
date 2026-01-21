const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true
    },
    projectType: {
        type: String,
        enum: ['web', 'mobile', 'other'],
        required: [true, 'Project type is required']
    },
    functionalities: {
        type: String,
        required: [true, 'Functionalities are required'],
        trim: true
    },
    collectionDate: {
        type: Date,
        required: [true, 'Collection date is required']
    },
    adminPrice: {
        type: Number,
        min: 0
    },
    adminDescription: {
        type: String,
        trim: true
    },
    userProposedPrice: {
        type: Number,
        min: 0
    },
    userProposedDescription: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'priced', 'accepted', 'contested', 'payment_pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    adminPhone: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedAt on save
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Project', projectSchema);