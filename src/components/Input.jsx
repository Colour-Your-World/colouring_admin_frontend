import React from 'react';
import eyeIcon from '../assets/eye.svg';
import eyeClosedIcon from '../assets/eyeClosed.svg';

const Input = React.forwardRef(({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    onBlur,
    required = false,
    children,
    placeholder = "",
    maxLength,
    className = "",
    showPasswordToggle = false,
    error,
    touched,
    helperText,
    inputClassName = "",
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const showError = Boolean(touched && error);
    const helperId = helperText ? `${id || name}-helper` : undefined;
    const errorId = showError ? `${id || name}-error` : undefined;

    const inputType = showPasswordToggle && type === 'password'
        ? (showPassword ? 'text' : 'password')
        : type;

    const baseInputClasses = "w-full px-4 py-3 rounded-[10px] focus:outline-none shadow-sm transition-all duration-200 text-primary placeholder:text-secondary bg-[#FBFFF5]";
    const borderClass = showError ? 'border border-red-500 focus:border-red-500' : 'border-common focus:border-[#048B50]';

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm text-primary mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type={inputType}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    aria-invalid={showError}
                    aria-describedby={errorId || helperId}
                    ref={ref}
                    className={`${baseInputClasses} ${borderClass} ${inputClassName}`}
                    {...props}
                />

                {showPasswordToggle && type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
                    >
                        <img
                            src={showPassword ? eyeIcon : eyeClosedIcon}
                            alt="Toggle password visibility"
                            className="w-5 h-5"
                        />
                    </button>
                )}

                {children}
            </div>

            {showError && (
                <p id={errorId} className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            {!showError && helperText && (
                <p id={helperId} className="mt-2 text-sm text-secondary">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
