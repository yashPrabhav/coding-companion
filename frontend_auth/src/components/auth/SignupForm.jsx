import { useState } from "react";
import { signupUser } from "../../api/auth";
import { saveSession } from "../../auth/session";

function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!name.trim() || !email.trim() || !password) {
            setError("Name, email and password are required.");
            return;
        }

        try {
            setIsLoading(true);

            const result = await signupUser(
                name.trim(),
                email.trim(),
                password
            );

            saveSession(result.token, result.user);

            console.log("Signup successful:", result.user);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isLoading}
            />

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

            <button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Creating Account..." : "Create Account"}
            </button>

        </form>
    );
}

export default SignupForm;