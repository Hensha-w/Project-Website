const Payment = require('../models/Payment');
const Project = require('../models/Project');

// Create Payment
exports.createPayment = async (req, res) => {
    try {
        const { projectId, accountNumber, accountName, amount } = req.body;

        // Check if project exists and is ready for payment
        const project = await Project.findOne({
            _id: projectId,
            user: req.userId,
            status: 'payment_pending'
        });

        if (!project) {
            return res.status(404).json({
                error: 'Project not found or not ready for payment'
            });
        }

        // Check receipt file
        if (!req.file) {
            return res.status(400).json({ error: 'Payment receipt is required' });
        }

        // Create payment
        const payment = new Payment({
            user: req.userId,
            project: projectId,
            accountNumber,
            accountName,
            amount: amount || project.adminPrice,
            receiptUrl: `/uploads/${req.file.filename}`,
            status: 'pending'
        });

        await payment.save();

        // Update project status
        project.status = 'in_progress';
        await project.save();

        res.status(201).json({
            message: 'Payment submitted successfully',
            payment: {
                id: payment._id,
                project: payment.project,
                amount: payment.amount,
                status: payment.status,
                receiptUrl: payment.receiptUrl
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User Payments
exports.getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.userId })
            .populate('project', 'title course')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ADMIN: Approve Payment
exports.approvePayment = async (req, res) => {
    try {
        const { adminPhone } = req.body;

        const payment = await Payment.findById(req.params.id)
            .populate('project');

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Update payment
        payment.status = 'approved';
        payment.adminPhone = adminPhone;

        // Update project with admin phone
        if (payment.project) {
            payment.project.adminPhone = adminPhone;
            await payment.project.save();
        }

        await payment.save();

        res.json({
            message: 'Payment approved successfully',
            payment: {
                id: payment._id,
                status: payment.status,
                adminPhone: payment.adminPhone
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};