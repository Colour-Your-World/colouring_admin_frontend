import React from 'react';

const Button = ({ 
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  onClick,
  ...props 
}) => {
  
  const baseClasses = `
    font-semibold transition-all duration-200 
    focus:outline-none cursor-pointer
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
  `;

  const variantClasses = {
    primary: 'bg-primary text-white ',
    secondary: 'bg-[#F3F8EC] text-[#0F100B] border-2 border-[#0F100B]!',
    outline: 'bg-transparent text-[#048B50] border-2 border-[#048B50] hover:bg-[#048B50] hover:text-white ',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 ',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-2 text-lg',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      style={{
        borderRadius: '54px',
        border: '1px solid',
        borderImageSource: 'radial-gradient(100% 100% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 91.9%)'
      }}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
