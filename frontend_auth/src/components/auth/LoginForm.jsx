import { useState } from "react";
import { loginUser } from "../../api/auth";


function LoginForm({ onForgotPassword, actionText }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setIsLoading(true);

            const result = await loginUser(
                email.trim(),
                password
            );



            window.location.assign("https://coding-companion.vercel.app/");

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
            />

            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}

            <span
                className="auth-link"
                onClick={onForgotPassword}
            >
                {actionText}
            </span>

            <button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </button>

        </form>
    );
}

export default LoginForm;