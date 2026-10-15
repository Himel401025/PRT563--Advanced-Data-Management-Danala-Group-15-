import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import { createNotification } from './notificationHelper.js';

export const initCronJobs = () => {
    // Run every hour to check for upcoming appointments and send reminders
    cron.schedule('0 * * * *', async () => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            
            // Find confirmed appointments scheduled for today
            const appointmentsToday = await Appointment.find({
                appointmentDate: todayStr,
                status: 'confirmed'
            }).populate('patientId', 'name email').populate('doctorId', 'name email');

            for (const app of appointmentsToday) {
                // Send reminder to patient
                await createNotification({
                    recipient: app.patientId._id,
                    type: 'REMINDER_APPOINTMENT',
                    title: 'Appointment Reminder for Today',
                    message: `You have a scheduled consultation today with Dr. ${app.doctorId.name} at ${app.timeSlot}.`,
                    link: '/dashboard'
                });
            }
        } catch (error) {
            console.error('Error in appointment reminder cron job:', error);
        }
    });

    console.log('Healthcare cron jobs initialized.');
};
