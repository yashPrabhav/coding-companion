import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";

function App() {

  const [activePage, setActivePage] = useState("dashboard");

  return (

    <DashboardPage
      activePage={activePage}
      setActivePage={setActivePage}
    />

  );

}

export default App;