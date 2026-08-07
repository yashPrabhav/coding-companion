import ProgressBar from "../Common/ProgressBar";
import { FaBookOpen } from "react-icons/fa";

function CurrentStageCard() {
    return (

        <div className="current-stage-card">

            <p className="card-title">
                Current Stage
            </p>

            <div className="stage-header">

                <div className="stage-info">

                    <div className="stage-icon">

                        <FaBookOpen />

                    </div>

                    <div>

                        <h2>Linear Algebra</h2>

                        <p>
                            You're making great progress!
                        </p>

                    </div>

                </div>

                <div className="stage-status">

                    In Progress

                </div>

            </div>

            <p className="progress-text">

                <span>78%</span>

                Completed

            </p>

            <ProgressBar progress={78} />

            <button>

                Continue Learning

            </button>

        </div>

    );
}

export default CurrentStageCard;