import SidebarItem from "./SidebarItem";

import {
    FaHome,
    FaComments,
    FaRoute,
    FaChartLine,
    FaUser,
    FaCog,
} from "react-icons/fa";

function Sidebar({ activePage, setActivePage }) {

    return (

        <aside>

            <h2>💻 Coding Companion</h2>

            <SidebarItem
                icon={<FaHome />}
                title="Dashboard"
                active={activePage === "dashboard"}
                onClick={() => setActivePage("dashboard")}
            />

            <SidebarItem
                icon={<FaComments />}
                title="AI Chat"
                active={activePage === "chat"}
                onClick={() => setActivePage("chat")}
            />

            <SidebarItem
                icon={<FaRoute />}
                title="Personalized Roadmap"
                active={activePage === "roadmap"}
                onClick={() => setActivePage("roadmap")}
            />

            <SidebarItem
                icon={<FaChartLine />}
                title="Progress"
                active={activePage === "progress"}
                onClick={() => setActivePage("progress")}
            />

            <SidebarItem
                icon={<FaUser />}
                title="Profile"
                active={activePage === "profile"}
                onClick={() => setActivePage("profile")}
            />

            <SidebarItem
                icon={<FaCog />}
                title="Settings"
                active={activePage === "settings"}
                onClick={() => setActivePage("settings")}
            />

        </aside>

    );

}

export default Sidebar;