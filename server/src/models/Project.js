const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
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
        min: [0, 'Price cannot be negative'],
        default: null
    },
    adminDescription: {
        type: String,
        trim: true,
        default: ''
    },
    userProposedPrice: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        default: null
    },
    userProposedDescription: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'priced', 'accepted', 'contested', 'payment_pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    adminPhone: {
        type: String,
        trim: true,
        default: ''
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

// Update timestamp before saving
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update timestamp before findOneAndUpdate
projectSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;