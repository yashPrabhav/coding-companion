import CurrentStageCard from "./CurrentStageCard";
import TodayTasksCard from "./TodayTasksCard";
import UpcomingTopicsCard from "./UpcomingTopicsCard";
import "./Roadmap.css";

function Roadmap() {
    return (
        <div className="roadmap-page">

            <div className="roadmap-header">

                <h1>📚 Personalized Roadmap</h1>

                <p>
                    Your AI-generated learning journey.
                </p>

            </div>

            <CurrentStageCard />

            <div className="roadmap-grid">

                <TodayTasksCard />

                <UpcomingTopicsCard />

            </div>

        </div>
    );
}

export default Roadmap;