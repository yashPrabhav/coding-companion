import "../components/Dashboard/DashboardView.css";

import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import TopNavBar from "../components/Dashboard/TopNavBar/TopNavBar";
import MainContent from "../components/Dashboard/MainContent/MainContent";

function DashboardView({
    activePage,
    setActivePage
}) {

    return (

        <div className="dashboard-container">

            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <div className="dashboard-view">

                <TopNavBar />

                <MainContent
                    activePage={activePage}
                />

            </div>

        </div>

    );

}

export default DashboardView;