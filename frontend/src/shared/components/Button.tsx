import React, { forwardRef } from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes safely.
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        icon: Icon,
        iconPosition = 'left',
        disabled,
        children,
        ...props
    }, ref) => {
        const variants = {
            primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200/50 active:scale-95',
            secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 active:scale-95',
            outline: 'bg-transparent border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 active:bg-slate-50',
            ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
            danger: 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 active:scale-95',
            success: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 active:scale-95',
        };

        const sizes = {
            sm: 'px-4 py-2 text-[10px]',
            md: 'px-6 py-3 text-xs',
            lg: 'px-8 py-4 text-sm font-black',
            icon: 'p-2',
        };

        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none gap-2';

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isLoading && Icon && iconPosition === 'left' && <Icon className={cn("w-4 h-4", size === 'sm' ? 'w-3.5 h-3.5' : '')} />}
                {children}
                {!isLoading && Icon && iconPosition === 'right' && <Icon className={cn("w-4 h-4", size === 'sm' ? 'w-3.5 h-3.5' : '')} />}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
