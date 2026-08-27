import { useState } from "react";

import LoginView from "../views/LoginView";
import SignupView from "../views/SignupView";
import ForgotPasswordView from "../views/ForgotPasswordView";
import ResetPasswordView from "../views/ResetPasswordView";

function AuthenticationPage() {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token");

    const [currentView, setCurrentView] = useState(
        resetToken ? "reset" : "login"
    );

    function handleCreateAccount() {
        setCurrentView("signup");
    }

    function handleBackToLogin() {
        setCurrentView("login");
    }

    function handleForgotPassword() {
        setCurrentView("forgot");
    }

    function handleResetPassword() {
        window.history.replaceState({}, "", "/");
        setCurrentView("login");
    }

    return (
        <div className="login-page">

            <div className="login-left">

                <div className="branding">

                    <div className="ai-icon">
                        🤖
                    </div>

                    <h1>Coding Companion</h1>

                    <p>
                        Learn by Building.
                    </p>

                </div>

            </div>

            <div className="login-right">

                <div className="auth-container">

                    {currentView === "login" && (
                        <LoginView
                            onAction={handleCreateAccount}
                            onForgotPassword={handleForgotPassword}
                        />
                    )}

                    {currentView === "signup" && (
                        <SignupView
                            onAction={handleBackToLogin}
                        />
                    )}

                    {currentView === "forgot" && (
                        <ForgotPasswordView
                            onAction={handleBackToLogin}
                        />
                    )}

                    {currentView === "reset" && (
                        <ResetPasswordView
                            token={resetToken}
                            onAction={handleResetPassword}
                        />
                    )}

                </div>

            </div>

        </div>
    );
}

export default AuthenticationPage;