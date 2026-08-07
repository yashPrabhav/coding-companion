function AuthFooter({ question, actionText, onAction }) {
    return (
        <p>
            {question}
            <span
                className="auth-link"
                onClick={onAction}>
                {actionText}
            </span>
        </p>
    );
}

export default AuthFooter;