function SignupForm() {
    return (
        <div className="login-form">

            <input
                type="text"
                placeholder="Full Name"
            />


            <input
                type="email"
                placeholder="Email"
            />

            <input
                type="password"
                placeholder="Password"
            />


            <button>Create Account</button>

        </div>
    );
}

export default SignupForm;
