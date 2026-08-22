import { useState } from "react";
import "./App.css";
import CompanionShell from "./components/companion/CompanionShell";

function App() {
  const [activePage, setActivePage] = useState("companion");

  return (
    <CompanionShell
      activePage={activePage}
      setActivePage={setActivePage}
    />
  );
}

export default App;
