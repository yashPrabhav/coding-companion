import AIChat from "./AIChat/AIChat";
import DashboardHome from "./DashboardHome/DashboardHome";
import Roadmap from "./Roadmap/Roadmap";
import ProgressPage from "./ProgressPage/ProgressPage";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";

function MainContent({ activePage }) {

    return (

        <main className="main-content">

            {activePage === "dashboard" && <DashboardHome />}

            {activePage === "chat" && <AIChat />}

            {activePage === "roadmap" && <Roadmap />}

            {activePage === "progress" && <ProgressPage />}

            {activePage === "profile" && <Profile />}

            {activePage === "settings" && <Settings />}

        </main>

    );

}

export default MainContent;