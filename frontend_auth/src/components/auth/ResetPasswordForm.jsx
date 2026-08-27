import { useState } from "react";
import { resetPassword } from "../../api/auth";

function ResetPasswordForm({ token, onSuccess }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please enter your new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);

            const result = await resetPassword(
                token,
                newPassword
            );

            setMessage(result.message);
            setNewPassword("");
            setConfirmPassword("");

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            className="login-form"
            onSubmit={handleSubmit}
        >
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(event) =>
                    setNewPassword(event.target.value)
                }
                disabled={isLoading}
            />

            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) =>
                    setConfirmPassword(event.target.value)
                }
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
                {isLoading
                    ? "Resetting..."
                    : "Reset Password"}
            </button>
        </form>
    );
}

export default ResetPasswordForm;