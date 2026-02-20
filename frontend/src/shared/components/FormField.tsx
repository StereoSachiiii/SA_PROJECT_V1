import { InputHTMLAttributes, useState } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function FormField({ label, error, className = '', ...props }: FormFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value && props.value.toString().length > 0;

    return (
        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                {label}
            </label>
            <div className={`relative transition-all duration-300 transform ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                <input
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus && props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur && props.onBlur(e);
                    }}
                    className={`
                        w-full bg-gray-100 text-gray-900 placeholder-gray-500
                        border border-gray-300 rounded-xl py-4 px-5
                        shadow-md focus:bg-white focus:ring-2 focus:ring-primary-500 focus:shadow-glow-gold
                        transition-all duration-200 ease-out
                        ${error ? 'ring-2 ring-red-500 bg-red-50' : ''}
                        ${className}
                    `}
                />

                {/* Tick mark indicator */}
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ${(isFocused || hasValue) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}>
                    <div className="bg-primary-500 rounded-full p-1 shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
        </div>
    );
}
