import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <input
                {...props}
                className={`input-field ${
                    error ? 'input-field-error' : 'input-field-normal'
                } ${className || ''}`}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Input;