import { useState } from "react";
import { forgotPassword } from "../../api/auth";

function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        try {
            setIsLoading(true);

            const result = await forgotPassword(email.trim());

            setMessage(result.message);


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