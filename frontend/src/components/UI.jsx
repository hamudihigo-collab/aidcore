import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    ...props
}) => {
    const baseStyles = 'font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:opacity-50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="animate-spin">⏳</span>}
            {children}
        </button>
    );
};

export const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        {children}
    </div>
);

export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export const Modal = ({ isOpen, title, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                {children}
            </Card>
        </div>
    );
};
