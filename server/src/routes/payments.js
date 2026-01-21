const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only image and PDF files are allowed'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Validation middleware
const validatePayment = [
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('accountNumber').notEmpty().withMessage('Account number is required'),
    body('accountName').notEmpty().withMessage('Account name is required'),
    body('amount').optional().isNumeric().withMessage('Amount must be a number')
];

const validateApprove = [
    body('adminPhone').isMobilePhone().withMessage('Valid phone number is required')
];

// Apply auth middleware
router.use(authMiddleware);

// User routes
router.post(
    '/',
    upload.single('receipt'),
    validatePayment,
    paymentController.createPayment
);
router.get('/', paymentController.getUserPayments);

// Admin routes
router.post(
    '/:id/approve',
    adminMiddleware,
    validateApprove,
    paymentController.approvePayment
);

module.exports = router;