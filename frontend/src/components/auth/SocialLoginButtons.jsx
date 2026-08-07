import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function SocialLoginButtons() {
    return (

        <div className="social-login">

            <div className="divider">

                <span>OR</span>

            </div>

            <button className="social-btn">

                <FcGoogle size={22} />

                <span>Continue with Google</span>

            </button>

            <button className="social-btn">

                <FaGithub size={22} />

                <span>Continue with GitHub</span>

            </button>

        </div>

    );
}

export default SocialLoginButtons;