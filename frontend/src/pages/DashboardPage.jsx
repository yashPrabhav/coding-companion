import DashboardView from "../views/DashboardView";

function DashboardPage({
    activePage,
    setActivePage
}) {

    return (

        <DashboardView
            activePage={activePage}
            setActivePage={setActivePage}
        />

    );

}

export default DashboardPage;