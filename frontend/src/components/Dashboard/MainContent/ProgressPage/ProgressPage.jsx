import "./ProgressPage.css";

import ProgressHeader from "./ProgressHeader";
import OverallStats from "./OverallStats";
import WeeklyProgressChart from "./WeeklyProgressChart";
import SubjectProgress from "./SubjectProgress";

function ProgressPage() {
    return (
        <div className="progress-page">

            <ProgressHeader />

            <OverallStats />

            <WeeklyProgressChart />

            <SubjectProgress />

        </div>
    );
}

export default ProgressPage;