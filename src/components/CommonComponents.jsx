import React from 'react';
import styled, {keyframes} from 'styled-components';
import {AlertCircle, CheckCircle, Info, X} from 'lucide-react';

// 스피너 애니메이션
const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

// 스피너 컴포넌트
const SpinnerWrapper = styled.div`
    animation: ${spin} 1s linear infinite;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-color: #3b82f6;
    border-radius: 9999px;

    width: ${({size}) =>
            size === 'small' ? '1rem' :
                    size === 'large' ? '3rem' :
                            '2rem'
    };

    height: ${({size}) =>
            size === 'small' ? '1rem' :
                    size === 'large' ? '3rem' :
                            '2rem'
    };

    ${({className}) => className}
`;

export const Spinner = ({size = 'medium', className = ''}) => {
    return (
        <SpinnerWrapper size={size} className={className}/>
    );
};

// 로딩 상태 컴포넌트
const LoadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
`;

const LoadingText = styled.p`
    color: #4b5563;
    margin-top: 1rem;
`;

export const LoadingState = ({message = '로딩 중입니다...'}) => {
    return (
        <LoadingWrapper>
            <Spinner size="large"/>
            <LoadingText>{message}</LoadingText>
        </LoadingWrapper>
    );
};

// 카드 컴포넌트
const CardWrapper = styled.div`
    background-color: ${({theme}) => theme.darkMode ? '#1f2937' : 'white'};
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    ${({className}) => className}
`;

const CardHeader = styled.div`
    padding: 1rem;
    border-bottom: 1px solid ${({theme}) => theme.darkMode ? '#374151' : '#e5e7eb'};
`;

const CardTitle = styled.h3`
    font-weight: 500;
`;

const CardBody = styled.div`
    padding: 1rem;
`;

const CardFooter = styled.div`
    padding: 1rem;
    background-color: ${({theme}) => theme.darkMode ? '#374151' : '#f9fafb'};
    border-top: 1px solid ${({theme}) => theme.darkMode ? '#374151' : '#e5e7eb'};
`;

export const Card = ({children, className = '', title, footer}) => {
    return (
        <CardWrapper className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardBody>{children}</CardBody>
            {footer && (
                <CardFooter>{footer}</CardFooter>
            )}
        </CardWrapper>
    );
};

// 알림 컴포넌트
const getAlertStyles = (type) => {
    switch (type) {
        case 'info':
            return {
                bg: ({theme}) => theme.darkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                border: ({theme}) => theme.darkMode ? '#1e40af' : '#bfdbfe',
                text: ({theme}) => theme.darkMode ? '#93c5fd' : '#1e40af',
                icon: <Info size={20} color="#3b82f6"/>,
            };
        case 'success':
            return {
                bg: ({theme}) => theme.darkMode ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4',
                border: ({theme}) => theme.darkMode ? '#166534' : '#bbf7d0',
                text: ({theme}) => theme.darkMode ? '#86efac' : '#166534',
                icon: <CheckCircle size={20} color="#22c55e"/>,
            };
        case 'warning':
            return {
                bg: ({theme}) => theme.darkMode ? 'rgba(234, 179, 8, 0.1)' : '#fefce8',
                border: ({theme}) => theme.darkMode ? '#854d0e' : '#fef08a',
                text: ({theme}) => theme.darkMode ? '#facc15' : '#854d0e',
                icon: <Info size={20} color="#eab308"/>,
            };
        case 'error':
            return {
                bg: ({theme}) => theme.darkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                border: ({theme}) => theme.darkMode ? '#b91c1c' : '#fecaca',
                text: ({theme}) => theme.darkMode ? '#f87171' : '#b91c1c',
                icon: <AlertCircle size={20} color="#ef4444"/>,
            };
        default:
            return getAlertStyles('info');
    }
};

const AlertWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    border: 1px solid ${({type}) => getAlertStyles(type).border};
    background-color: ${({type}) => getAlertStyles(type).bg};
`;

const AlertIconWrapper = styled.div`
    margin-right: 0.5rem;
`;

const AlertContent = styled.div`
    margin-left: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({type}) => getAlertStyles(type).text};
`;

const AlertCloseButton = styled.button`
    margin-left: auto;
    margin-right: -0.375rem;
    margin-top: -0.375rem;
    margin-bottom: -0.375rem;
    padding: 0.375rem;
    border-radius: 0.5rem;
    display: inline-flex;
    height: 2rem;
    width: 2rem;
    color: ${({type}) => getAlertStyles(type).text};

    &:hover {
        background-color: ${({theme}) => theme.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }
`;

export const Alert = ({type = 'info', message, onClose}) => {
    const styles = getAlertStyles(type);

    return (
        <AlertWrapper role="alert" type={type}>
            <AlertIconWrapper>{styles.icon}</AlertIconWrapper>
            <AlertContent type={type}>{message}</AlertContent>
            {onClose && (
                <AlertCloseButton
                    type={type}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={16}/>
                </AlertCloseButton>
            )}
        </AlertWrapper>
    );
};

// 버튼 컴포넌트
const getButtonVariantStyles = (variant) => {
    switch (variant) {
        case 'primary':
            return {
                bg: '#2563eb',
                hoverBg: '#1d4ed8',
                text: 'white',
            };
        case 'secondary':
            return {
                bg: ({theme}) => theme.darkMode ? '#374151' : '#e5e7eb',
                hoverBg: ({theme}) => theme.darkMode ? '#4b5563' : '#d1d5db',
                text: ({theme}) => theme.darkMode ? '#f9fafb' : '#1f2937',
            };
        case 'success':
            return {
                bg: '#22c55e',
                hoverBg: '#16a34a',
                text: 'white',
            };
        case 'danger':
            return {
                bg: '#ef4444',
                hoverBg: '#dc2626',
                text: 'white',
            };
        case 'outline':
            return {
                bg: 'transparent',
                hoverBg: ({theme}) => theme.darkMode ? '#374151' : '#f3f4f6',
                text: ({theme}) => theme.darkMode ? '#f9fafb' : '#1f2937',
                border: ({theme}) => theme.darkMode ? '#4b5563' : '#d1d5db',
            };
        default:
            return getButtonVariantStyles('primary');
    }
};

const getButtonSizeStyles = (size) => {
    switch (size) {
        case 'small':
            return {
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
            };
        case 'large':
            return {
                padding: '0.75rem 1.5rem',
                fontSize: '1.125rem',
            };
        default:
            return {
                padding: '0.5rem 1rem',
                fontSize: '1rem',
            };
    }
};

const ButtonWrapper = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;

    background-color: ${({variant}) => getButtonVariantStyles(variant).bg};
    color: ${({variant}) => getButtonVariantStyles(variant).text};
    border: ${({variant}) =>
            variant === 'outline'
                    ? `1px solid ${getButtonVariantStyles(variant).border}`
                    : 'none'
    };

    padding: ${({size}) => getButtonSizeStyles(size).padding};
    font-size: ${({size}) => getButtonSizeStyles(size).fontSize};

    &:hover {
        background-color: ${({variant}) => getButtonVariantStyles(variant).hoverBg};
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    ${({className}) => className}
`;

const ButtonIcon = styled.span`
    margin-right: 0.5rem;
`;

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
    return (
        <ButtonWrapper
            type={type}
            variant={variant}
            size={size}
            disabled={disabled}
            className={className}
            onClick={onClick}
        >
            {icon && <ButtonIcon>{icon}</ButtonIcon>}
            {children}
        </ButtonWrapper>
    );
};

// 모달 컴포넌트
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.div`
    background-color: ${({theme}) => theme.darkMode ? '#1f2937' : 'white'};
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    z-index: 10;
    width: 100%;
    max-width: 28rem;
    margin: 0 1rem;
    overflow: hidden;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${({theme}) => theme.darkMode ? '#374151' : '#e5e7eb'};
`;

const ModalTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 500;
`;

const ModalCloseButton = styled.button`
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};

    &:hover {
        color: ${({theme}) => theme.darkMode ? '#f9fafb' : '#111827'};
    }
`;

const ModalBody = styled.div`
    padding: 1rem;
`;

const ModalFooter = styled.div`
    padding: 1rem;
    background-color: ${({theme}) => theme.darkMode ? '#374151' : '#f9fafb'};
    border-top: 1px solid ${({theme}) => theme.darkMode ? '#374151' : '#e5e7eb'};
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`;

export const Modal = ({isOpen, onClose, title, children, footer}) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalBackdrop onClick={onClose}/>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <ModalCloseButton onClick={onClose}>
                        <X size={20}/>
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>{children}</ModalBody>
                {footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContainer>
        </ModalOverlay>
    );
};

// 폼 필드 컴포넌트
const FormFieldContainer = styled.div`
    ${({className}) => className}
`;

const FormLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({theme}) => theme.darkMode ? '#e5e7eb' : '#374151'};
    transition: color 0.2s ease;
`;

const RequiredMark = styled.span`
    color: #ef4444;
    margin-left: 2px;
`;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const FormInput = styled.input`
    width: 100%;
    padding: 0.625rem 0.75rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    font-size: 0.95rem;

    background-color: ${({theme, disabled}) =>
            disabled
                    ? theme.darkMode ? '#2d3748' : '#f3f4f6'
                    : theme.darkMode ? '#1f2937' : 'white'
    };

    border: 1px solid ${({theme, error}) =>
            error
                    ? '#ef4444'
                    : theme.darkMode ? '#4b5563' : '#d1d5db'
    };

    color: ${({theme}) => theme.darkMode ? 'white' : '#111827'};

    &:hover:not(:disabled) {
        border-color: ${({theme, error}) =>
                error
                        ? '#f87171'
                        : theme.darkMode ? '#9ca3af' : '#9ca3af'
        };
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    }

    &:focus {
        outline: none;
        border-color: ${({error}) => error ? '#ef4444' : '#3b82f6'};
        box-shadow: 0 0 0 3px ${({error}) => error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
        transform: translateY(-1px);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

const InputIcon = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.75rem;
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
    pointer-events: none;
`;

const FormError = styled.p`
    margin-top: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #ef4444;
    animation: errorShake 0.4s ease-in-out;

    @keyframes errorShake {
        0%, 100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-5px);
        }
        75% {
            transform: translateX(5px);
        }
    }
`;

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
                              icon = null,
                              className = '',
                          }) => {
    return (
        <FormFieldContainer className={className}>
            {label && (
                <FormLabel htmlFor={name}>
                    {label} {required && <RequiredMark>*</RequiredMark>}
                </FormLabel>
            )}
            <InputWrapper>
                <FormInput
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    error={error}
                />
                {icon && <InputIcon>{icon}</InputIcon>}
            </InputWrapper>
            {error && <FormError>{error}</FormError>}
        </FormFieldContainer>
    );
};

// 셀렉트 컴포넌트
const SelectContainer = styled.div`
    position: relative;
    width: 100%;
`;

const SelectInput = styled.select`
    width: 100%;
    padding: 0.625rem 0.75rem;
    padding-right: 2.5rem; // 화살표를 위한 공간
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    appearance: none; // 기본 화살표 제거
    font-size: 0.95rem;

    background-color: ${({theme, disabled}) =>
            disabled
                    ? theme.darkMode ? '#2d3748' : '#f3f4f6'
                    : theme.darkMode ? '#1f2937' : 'white'
    };

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;

    border: 1px solid ${({theme, error}) =>
            error
                    ? '#ef4444'
                    : theme.darkMode ? '#4b5563' : '#d1d5db'
    };

    color: ${({theme}) => theme.darkMode ? 'white' : '#111827'};

    &:hover:not(:disabled) {
        border-color: ${({theme, error}) =>
                error
                        ? '#f87171'
                        : theme.darkMode ? '#9ca3af' : '#9ca3af'
        };
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
    }

    &:focus {
        outline: none;
        border-color: ${({error}) => error ? '#ef4444' : '#3b82f6'};
        box-shadow: 0 0 0 3px ${({error}) => error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.25)'};
        transform: translateY(-1px);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }

    option {
        padding: 0.75rem 0.5rem;
        background-color: ${({theme}) => theme.darkMode ? '#1f2937' : 'white'};
        color: ${({theme}) => theme.darkMode ? '#e5e7eb' : '#1f2937'};
    }

    &::after {
        content: '';
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
    }
`;

const SelectWrapper = styled.div`
    position: relative;

    &::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        height: 2px;
        width: 0;
        background-color: #3b82f6;
        transition: width 0.3s ease;
    }

    &:focus-within::after {
        width: 100%;
    }
`;

const SelectLabel = styled(FormLabel)`
    font-weight: 600;
    color: ${({theme}) => theme.darkMode ? '#e5e7eb' : '#374151'};
    margin-bottom: 0.375rem;
`;

const SelectPlaceholder = styled.option`
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#9ca3af'};
`;

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
        <FormFieldContainer className={className}>
            {label && (
                <SelectLabel htmlFor={name}>
                    {label} {required && <RequiredMark>*</RequiredMark>}
                </SelectLabel>
            )}
            <SelectWrapper>
                <SelectContainer>
                    <SelectInput
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        error={error}
                    >
                        <SelectPlaceholder value="">{placeholder}</SelectPlaceholder>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </SelectInput>
                </SelectContainer>
            </SelectWrapper>
            {error && <FormError>{error}</FormError>}
        </FormFieldContainer>
    );
};

export default {Spinner, LoadingState, Card, Alert, Button, Modal, FormField, Select};