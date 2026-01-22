const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Validation middleware
const validateProject = [
    body('title').notEmpty().withMessage('Title is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('projectType').isIn(['web', 'mobile', 'other']).withMessage('Invalid project type'),
    body('functionalities').notEmpty().withMessage('Functionalities are required'),
    body('collectionDate').isISO8601().withMessage('Valid date is required')
];

const validatePrice = [
    body('userProposedPrice').isNumeric().withMessage('Price must be a number'),
    body('userProposedDescription').notEmpty().withMessage('Description is required')
];

const validateAdminPrice = [
    body('adminPrice').isNumeric().withMessage('Price must be a number'),
    body('adminDescription').notEmpty().withMessage('Description is required'),
    body('adminPhone').optional().isMobilePhone().withMessage('Valid phone number required')
];

// Apply auth middleware to all routes
router.use(authMiddleware);

// User routes
router.post('/', validateProject, projectController.createProject);
router.get('/', projectController.getUserProjects);
router.get('/:id', projectController.getProjectById);
router.post('/:id/contest', validatePrice, projectController.contestPrice);
router.post('/:id/accept', projectController.acceptPrice);

// Admin routes
router.post('/:id/price', adminMiddleware, validateAdminPrice, projectController.setProjectPrice);

module.exports = router;