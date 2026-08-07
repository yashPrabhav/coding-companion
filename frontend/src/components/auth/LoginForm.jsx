function LoginForm({ onForgotPassword, actionText }) {
    return (
        <div className="login-form">

            <input
                type="email"
                placeholder="Email"
            />

            <input
                type="password"
                placeholder="Password"
            />
            <span
                className="auth-link"
                onClick={onForgotPassword}>
                {actionText}
            </span>

            <button>Sign In</button>

        </div>
    );
}

export default LoginForm;