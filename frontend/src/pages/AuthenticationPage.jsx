import { useState } from "react";
import LoginView from "../views/LoginView";
import SignupView from "../views/SignupView";
import ForgotPasswordView from "../views/ForgotPasswordView";

function AuthenticationPage() {

    const [currentView, setCurrentView] = useState("login");

    function handleCreateAccount() {
        setCurrentView("signup");
    }

    function handleBackToLogin() {
        setCurrentView("login");
    }
    function handleForgotPassword() {
        setCurrentView("forgot");
    }

    return (


        <div className="login-page">

            <div className="login-left">

                <div className="branding">

                    <div className="ai-icon">
                        🤖
                    </div>

                    <h1>AIRANK</h1>

                    <p>
                        Learn by Building.
                    </p>

                </div>

            </div>

            <div className="login-right">

                <div className="auth-container">

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

                    </div>
                </div>

            </div>

        </div>

    );
}

export default AuthenticationPage;

