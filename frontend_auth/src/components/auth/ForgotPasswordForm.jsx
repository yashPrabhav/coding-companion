import { useState } from "react";
import { forgotPassword } from "../../api/auth";

function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [resetLink, setResetLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");
        setResetLink("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        try {
            setIsLoading(true);

            const result = await forgotPassword(email.trim());

            console.log("FORGOT PASSWORD RESULT:", result);

            setMessage(result.message);

            // Development-only reset link.
            if (result.resetLink) {
                setResetLink(result.resetLink);
            }

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

            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}

            {message && (
                <p className="auth-success">
                    {message}
                </p>
            )}

            {resetLink && (
                <button
                    type="button"
                    onClick={() => {
                        window.location.href = resetLink;
                    }}
                >
                    Open Reset Password
                </button>
            )}

            <button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

        </form>
    );
}

export default ForgotPasswordForm;