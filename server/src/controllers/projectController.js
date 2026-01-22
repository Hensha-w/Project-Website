const Project = require('../models/Project');

// Create Project
exports.createProject = async (req, res) => {
    try {
        const { title, course, projectType, functionalities, collectionDate } = req.body;

        // Validate collection date is in the future
        const collectionDateObj = new Date(collectionDate);
        if (collectionDateObj <= new Date()) {
            return res.status(400).json({ error: 'Collection date must be in the future' });
        }

        const project = new Project({
            user: req.userId,
            title,
            course,
            projectType,
            functionalities,
            collectionDate: collectionDateObj,
            status: 'pending'
        });

        await project.save();

        res.status(201).json({
            message: 'Project created successfully',
            project: {
                id: project._id,
                title: project.title,
                course: project.course,
                projectType: project.projectType,
                status: project.status,
                collectionDate: project.collectionDate
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User Projects
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .select('-functionalities -__v');

        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('user', 'name email');

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if user owns the project or is admin
        if (project.user._id.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Contest Price
exports.contestPrice = async (req, res) => {
    try {
        const { userProposedPrice, userProposedDescription } = req.body;

        if (!userProposedPrice || !userProposedDescription) {
            return res.status(400).json({ error: 'Price and description are required' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check ownership
        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if project is priced
        if (project.status !== 'priced') {
            return res.status(400).json({ error: 'Project is not priced yet' });
        }

        // Update project
        project.userProposedPrice = userProposedPrice;
        project.userProposedDescription = userProposedDescription;
        project.status = 'contested';
        project.updatedAt = Date.now();

        await project.save();

        res.json({
            message: 'Price contested successfully',
            project: {
                id: project._id,
                userProposedPrice: project.userProposedPrice,
                userProposedDescription: project.userProposedDescription,
                status: project.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Accept Price
exports.acceptPrice = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check ownership
        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if project is priced
        if (project.status !== 'priced') {
            return res.status(400).json({ error: 'Project is not priced yet' });
        }

        // Update project status
        project.status = 'payment_pending';
        project.updatedAt = Date.now();

        await project.save();

        res.json({
            message: 'Price accepted successfully',
            project: {
                id: project._id,
                status: project.status,
                adminPrice: project.adminPrice
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ADMIN: Set Project Price
exports.setProjectPrice = async (req, res) => {
    try {
        const { adminPrice, adminDescription, adminPhone } = req.body;

        if (!adminPrice || !adminDescription) {
            return res.status(400).json({ error: 'Price and description are required' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Update project
        project.adminPrice = adminPrice;
        project.adminDescription = adminDescription;
        project.adminPhone = adminPhone;
        project.status = 'priced';
        project.updatedAt = Date.now();

        await project.save();

        res.json({
            message: 'Price set successfully',
            project: {
                id: project._id,
                adminPrice: project.adminPrice,
                adminDescription: project.adminDescription,
                status: project.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};