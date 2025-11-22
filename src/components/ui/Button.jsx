import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-danger';
    return (
        <button className={`btn ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
