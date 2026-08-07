import AuthHeader from "../components/auth/AuthHeader";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import AuthFooter from "../components/auth/AuthFooter";

function ForgotPasswordView({ onAction }) {
    return (
        <>
            <AuthHeader
                title="Forgot Password?"
                subtitle="Enter your email to receive a reset link."
            />

            <ForgotPasswordForm />

            <AuthFooter
                question="Remember your password?"
                actionText="Back to Login"
                onAction={onAction}
            />
        </>
    );
}

export default ForgotPasswordView;