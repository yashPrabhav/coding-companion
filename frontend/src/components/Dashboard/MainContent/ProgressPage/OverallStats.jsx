import ProgressBar from "../Common/ProgressBar";

function OverallStats() {
    return (
        <div className="overall-stats-card">

            <div className="overall-header">
                <div>
                    <h2>Overall Progress</h2>
                    <p>Your overall learning journey</p>
                </div>

                <h2 className="overall-percent">72%</h2>
            </div>

            <ProgressBar progress={72} />

            <div className="overall-footer">

                <div className="overall-item">
                    <span className="overall-label">Completed</span>
                    <span className="overall-value">18 Topics</span>
                </div>

                <div className="overall-item">
                    <span className="overall-label">Remaining</span>
                    <span className="overall-value">7 Topics</span>
                </div>

            </div>

        </div>
    );
}

export default OverallStats;