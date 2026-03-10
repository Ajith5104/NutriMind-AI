import React, { useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { ToastContext } from './ToastContext';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, variant = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, variant }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        onClose={() => removeToast(toast.id)}
                        show={true}
                        delay={5000}
                        autohide
                        bg={toast.variant}
                        className="glass-panel border-0"
                        style={{ 
                            background: toast.variant === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            backdropFilter: 'blur(12px)',
                            color: '#fff'
                        }}
                    >
                        <Toast.Header closeVariant="white" className="bg-transparent border-0 text-white">
                            <strong className="me-auto">Notification</strong>
                        </Toast.Header>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};
