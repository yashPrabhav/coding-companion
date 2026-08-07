function ForgotPasswordForm({ onBackToLogin }) {
    return (
        <div className="login-form">

            <input
                type="email"
                placeholder="Email"
            />

            <button>
                Send Reset Link
            </button>

        </div>
    );
}

export default ForgotPasswordForm;