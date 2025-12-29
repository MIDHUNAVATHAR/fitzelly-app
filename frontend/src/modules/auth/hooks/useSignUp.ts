import { useState } from 'react';
import { AuthService } from '../services/AuthService';

export function useSignUp() {
    // const navigate = useNavigate();
    const [gymName, setGymName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');

    // UI steps: 'DETAILS' -> 'OTP'
    const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{
        gymName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        otp?: string;
    }>({});

    const validateDetails = () => {
        const errors: typeof fieldErrors = {};
        let isValid = true;

        if (!gymName.trim()) { errors.gymName = 'Gym name is required'; isValid = false; }
        if (!email) { errors.email = 'Email is required'; isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(email)) { errors.email = 'Please enter a valid email address'; isValid = false; }
        if (!password) { errors.password = 'Password is required'; isValid = false; }
        else if (password.length < 6) { errors.password = 'Password must be at least 6 characters'; isValid = false; }
        if (password !== confirmPassword) { errors.confirmPassword = 'Passwords do not match'; isValid = false; }

        setFieldErrors(errors);
        return isValid;
    };

    const handleInitiateSignUp = async () => {
        setGeneralError('');
        if (!validateDetails()) return;

        setIsLoading(true);
        try {
            await AuthService.initiateSignup({ email });
            setStep('OTP'); // Move to next step
        } catch (error: any) {
            setGeneralError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteSignUp = async (onSuccess?: () => void) => {
        setGeneralError('');
        if (!otp || otp.length < 6) {
            setFieldErrors(prev => ({ ...prev, otp: "Please enter a valid 6-digit OTP" }));
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.register({
                gymName,
                email,
                password,
                otp
            });

            // Note: We don't log them in automatically here anymore, 
            // we redirect to login as per requirement.

            if (onSuccess) onSuccess();

        } catch (error: any) {
            setGeneralError(error.message);
            setIsLoading(false);
        } finally {
            if (generalError) setIsLoading(false);
        }
    };

    const reset = () => {
        setStep('DETAILS');
        setGymName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOtp('');
        setGeneralError('');
        setFieldErrors({});
    };

    return {
        gymName, setGymName,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        otp, setOtp,
        step,
        isLoading,
        generalError,
        fieldErrors,
        handleInitiateSignUp,
        handleCompleteSignUp,
        reset
    };
}
