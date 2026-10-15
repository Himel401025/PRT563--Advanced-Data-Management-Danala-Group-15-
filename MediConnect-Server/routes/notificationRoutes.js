import express from 'express';
import Notification from '../models/Notification.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for current user
router.get('/', verifyJWT, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(40);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false
        });

        return res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
});

// Mark single notification as read
router.patch('/:id/read', verifyJWT, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );
        return res.json({ success: true, notification });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
    }
});

// Mark all as read
router.patch('/read-all', verifyJWT, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        return res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to mark all as read' });
    }
});

export default router;
