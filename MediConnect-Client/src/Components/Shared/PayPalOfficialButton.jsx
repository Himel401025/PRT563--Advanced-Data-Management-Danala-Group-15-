import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../../api/axios';
import { AlertCircle, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const PayPalOfficialButton = ({ appointment, onSuccess, onError }) => {
    const [paymentError, setPaymentError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!appointment) return null;

    const amount = (appointment.consultationFee || 50).toFixed(2);
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

    const handleCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: `Healthcare Consultation - Dr. ${appointment.doctorId?.name || 'Specialist'} (${appointment.specializationName || 'General Medicine'})`,
                    amount: {
                        currency_code: 'USD',
                        value: amount
                    }
                }
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    const handleApprove = async (data, actions) => {
        setIsProcessing(true);
        setPaymentError('');

        try {
            const details = await actions.order.capture();
            
            // Send captured PayPal order details to our backend
            const res = await api.post('/payment/capture-paypal-order', {
                appointmentId: appointment._id,
                orderID: data.orderID || details.id,
                paymentDetails: details
            });

            if (res.data.success) {
                if (onSuccess) {
                    onSuccess(res.data.transaction, res.data.appointment);
                }
            } else {
                setPaymentError(res.data.message || 'Failed to capture appointment on server.');
            }
        } catch (err) {
            console.error('PayPal Capture Error:', err);
            setPaymentError(err.message || 'Payment capture failed. Please try again.');
            if (onError) onError(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSimulationFallback = async () => {
        setIsProcessing(true);
        setPaymentError('');
        try {
            const fakeOrderId = `PAYPAL-SB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const res = await api.post('/payment/capture-paypal-order', {
                appointmentId: appointment._id,
                orderID: fakeOrderId,
                paymentDetails: {
                    payer: { email_address: 'sb-buyer@example.com', name: { given_name: 'Sandbox', surname: 'Buyer' } },
                    status: 'COMPLETED'
                }
            });

            if (res.data.success) {
                if (onSuccess) {
                    onSuccess(res.data.transaction, res.data.appointment);
                }
            }
        } catch (err) {
            setPaymentError(err.response?.data?.message || 'Transaction failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {paymentError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{paymentError}</span>
                </div>
            )}

            {isProcessing ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#003087]"></div>
                    <p className="text-xs font-bold text-slate-600">Capturing PayPal Sandbox Transaction...</p>
                </div>
            ) : (
                <PayPalScriptProvider options={{ 'client-id': clientId, currency: 'USD', intent: 'capture' }}>
                    <div className="relative z-10">
                        <PayPalButtons
                            style={{
                                layout: 'vertical',
                                color: 'gold',
                                shape: 'rect',
                                label: 'paypal',
                                height: 44
                            }}
                            createOrder={handleCreateOrder}
                            onApprove={handleApprove}
                            onError={(err) => {
                                console.error('PayPal Smart Button Error:', err);
                                setPaymentError('PayPal popup closed or connection interrupted.');
                            }}
                            onCancel={() => {
                                setPaymentError('PayPal transaction was cancelled by user.');
                            }}
                        />
                    </div>
                </PayPalScriptProvider>
            )}

            {/* Quick Sandbox Instant Demo Button for convenience */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                    <Lock size={12} className="text-emerald-600" />
                    Official PayPal Sandbox v2
                </span>
                <button
                    type="button"
                    onClick={handleSimulationFallback}
                    className="text-teal-600 hover:text-teal-700 font-bold hover:underline"
                >
                    ⚡ Instant Sandbox Demo Capture
                </button>
            </div>
        </div>
    );
};

export default PayPalOfficialButton;
