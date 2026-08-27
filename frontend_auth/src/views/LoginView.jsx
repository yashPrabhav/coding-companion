import AuthHeader from "../components/auth/AuthHeader";
import LoginForm from "../components/auth/LoginForm";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import AuthFooter from "../components/auth/AuthFooter";

function LoginView({ onAction, onForgotPassword }) {

    return (

        <>
            <AuthHeader
                title="Welcome Back"
                subtitle="Continue building with AIRANK."
            />

            <LoginForm
                onForgotPassword={onForgotPassword}
                actionText="Forgot Password" />
            <SocialLoginButtons />

            <AuthFooter
                question="Don't have an account?"
                actionText="Create one"
                onAction={onAction}
            />
        </>

    );

}

export default LoginView;
