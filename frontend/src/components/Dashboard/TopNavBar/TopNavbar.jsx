import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function TopNavbar() {
    return (
        <header className="top-navbar">

            <div className="search-box">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search..."
                />

            </div>

            <div className="navbar-right">

                <FaBell className="navbar-icon" />

                <div className="user-profile">

                    <FaUserCircle className="user-icon" />

                    <span>Yash</span>

                </div>

            </div>

        </header>
    );
}

export default TopNavbar;