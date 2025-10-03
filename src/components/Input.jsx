import React from 'react';
import eyeIcon from '../assets/eye.svg';
import eyeClosedIcon from '../assets/eyeClosed.svg';

const Input = ({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    required = false,
    children,
    placeholder = "",
    maxLength,
    className = "",
    showPasswordToggle = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = showPasswordToggle && type === 'password'
        ? (showPassword ? 'text' : 'password')
        : type;

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
                    className="w-full px-4 py-3 rounded-[10px] focus:outline-none shadow-sm transition-all duration-200 text-primary placeholder:text-secondary bg-[#FBFFF5] border-common"
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
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
        </div>
    );
};

export default Input;
