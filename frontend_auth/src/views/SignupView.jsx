import AuthHeader from "../components/auth/AuthHeader";
import SignupForm from "../components/auth/SignupForm";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import AuthFooter from "../components/auth/AuthFooter";

function SignupView({ onAction }) {

    return (

        <>
            <AuthHeader
                title="Create Your Account"
                subtitle="Start your AI-powered learning journey."
            />

            <SignupForm />

            <SocialLoginButtons />

            <AuthFooter
                question="Already have an account?"
                actionText="Sign In"
                onAction={onAction}
            />
        </>

    );

}

export default SignupView;
