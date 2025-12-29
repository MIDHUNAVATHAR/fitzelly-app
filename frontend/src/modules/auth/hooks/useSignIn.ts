import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

export function useSignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const errors: { email?: string; password?: string } = {};
        let isValid = true;

        // Email Validation
        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password Validation
        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSignIn = async (onSuccess?: () => void) => {
        setGeneralError('');

        if (!validate()) return;

        setIsLoading(true);
        try {
            const response = await AuthService.login({ email, password });

            // Store token/user - implementing basic localStorage for now
            // In a real app, use a Context or Redux store
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            window.dispatchEvent(new Event('auth-change'));

            if (onSuccess) {
                // onSuccess(); // Don't close modal manually, let route change handle it to prevent flash
                navigate('/gym/dashboard');
            }
            // TODO: Redirect to dashboard logic here

        } catch (error: any) {
            setGeneralError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        isLoading,
        generalError,
        fieldErrors,
        handleSignIn
    };
}
