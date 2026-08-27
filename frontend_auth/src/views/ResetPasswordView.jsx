import AuthHeader from "../components/auth/AuthHeader";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import AuthFooter from "../components/auth/AuthFooter";

function ResetPasswordView({ token, onAction }) {
    return (
        <>
            <AuthHeader
                title="Reset Password"
                subtitle="Create a new password for your account."
            />

            <ResetPasswordForm
                token={token}
                onSuccess={onAction}
            />

            <AuthFooter
                question="Remember your password?"
                actionText="Back to Login"
                onAction={onAction}
            />
        </>
    );
}

export default ResetPasswordView;