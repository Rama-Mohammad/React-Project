import React from 'react';
import Loader from './Loader';


export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning'
  | 'dark';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Extend from ButtonHTMLAttributes to get all native button props including className
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  as = 'button',
  href,
  target,
  rel,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 active:bg-yellow-700',
    dark: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700 active:bg-gray-950',
  };
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
    xl: 'px-6 py-3.5 text-base gap-2.5',
  };
  
  // Icon size mapping
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;
  
  // Render loading spinner
  const renderLoading = () => {
    const spinnerSize = size === 'xs' || size === 'sm' ? 'small' : 'medium';
    const spinnerColor = variant === 'outline' || variant === 'ghost' ? 'gray' : 'white';
    return <Loader size={spinnerSize} color={spinnerColor} variant="spinner" />;
  };
  
  // Render icon
  const renderIcon = () => {
    if (!icon) return null;
    return React.cloneElement(icon as React.ReactElement, {
      className: `${iconSizes[size]} ${children ? '' : 'mx-0'}`
    });
  };
  
  // Content to render
  const content = (
    <>
      {loading && renderLoading()}
      {!loading && iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {!loading && iconPosition === 'right' && renderIcon()}
    </>
  );
  
  // Render as link if href provided
  if (as === 'a' && href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }
  
  // Render as button
  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

// Icon Button Component
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconPosition'> {
  icon: React.ReactNode;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-3.5',
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-6 h-6',
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    dark: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700',
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={label}
      {...props}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: iconSizes[size]
      })}
    </button>
  );
};

// Button Group Component
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col',
  };
  
  const childSpacing = orientation === 'horizontal' 
    ? '[&>:not(:first-child)]:ml-[-1px] [&>:first-child]:rounded-r-none [&>:last-child]:rounded-l-none [&>:not(:first-child):not(:last-child)]:rounded-none'
    : '[&>:not(:first-child)]:mt-[-1px] [&>:first-child]:rounded-b-none [&>:last-child]:rounded-t-none [&>:not(:first-child):not(:last-child)]:rounded-none';
  
  return (
    <div className={`inline-flex ${orientationClasses[orientation]} ${childSpacing} ${className}`}>
      {children}
    </div>
  );
};

// Loading Button Component
export interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  loadingText?: string;
  defaultText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loadingText = 'Loading...',
  defaultText = 'Submit',
  loading = false,
  children,
  ...props
}) => {
  return (
    <Button loading={loading} {...props}>
      {loading ? loadingText : (children || defaultText)}
    </Button>
  );
};

export default Button;