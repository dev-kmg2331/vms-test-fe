import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

/**
 * 로딩 스피너 컴포넌트
 */
export const Spinner = ({ size = 'medium', className = '' }) => {
    const sizeClass = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    }[size] || 'w-8 h-8';

    return (
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClass} ${className}`}></div>
    );
};

/**
 * 로딩 중 표시 컴포넌트
 */
export const LoadingState = ({ message = '로딩 중입니다...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Spinner size="large" className="mb-4" />
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

/**
 * 카드 컴포넌트
 */
export const Card = ({ children, className = '', title, footer }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
            {title && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium">{title}</h3>
                </div>
            )}
            <div className="p-4">{children}</div>
            {footer && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                    {footer}
                </div>
            )}
        </div>
    );
};

/**
 * 알림 컴포넌트
 */
export const Alert = ({ type = 'info', message, onClose }) => {
    const types = {
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-300 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-300',
            icon: <Info size={20} className="text-blue-500" />,
        },
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-300 dark:border-green-800',
            text: 'text-green-800 dark:text-green-300',
            icon: <CheckCircle size={20} className="text-green-500" />,
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-300 dark:border-yellow-800',
            text: 'text-yellow-800 dark:text-yellow-300',
            icon: <Info size={20} className="text-yellow-500" />,
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-300 dark:border-red-800',
            text: 'text-red-800 dark:text-red-300',
            icon: <AlertCircle size={20} className="text-red-500" />,
        },
    };

    const style = types[type] || types.info;

    return (
        <div
            className={`flex items-center p-4 mb-4 rounded-lg border ${style.bg} ${style.border}`}
            role="alert"
        >
            <div className="mr-2">{style.icon}</div>
            <div className={`ml-3 text-sm font-medium ${style.text}`}>{message}</div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${style.text} hover:bg-opacity-20 hover:bg-gray-200 dark:hover:bg-gray-700`}
                    aria-label="Close"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

/**
 * 버튼 컴포넌트
 */
export const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
    icon,
    onClick,
    type = 'button',
}) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200',
    };

    const sizes = {
        small: 'py-1 px-3 text-sm',
        medium: 'py-2 px-4',
        large: 'py-3 px-6 text-lg',
    };

    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.medium;

    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${sizeClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

/**
 * 모달 컴포넌트
 */
export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-full max-w-md mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">{children}</div>
                {footer && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * 폼 입력 필드 컴포넌트
 */
export const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }
          ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
          text-gray-900 dark:text-white
        `}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

/**
 * 드롭다운 선택 컴포넌트
 */
export const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = '선택하세요',
    required = false,
    error,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }
          ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
          text-gray-900 dark:text-white
        `}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

// 공통 컴포넌트 예시 (사용 방법 표시용)
const CommonComponents = () => {
    return <div>공통 컴포넌트 모음</div>;
};

export default CommonComponents;