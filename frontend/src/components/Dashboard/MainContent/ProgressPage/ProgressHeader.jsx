import "./ProgressPage.css";

function ProgressHeader() {
    return (
        <div className="progress-header">

            <div>
                <h1>Progress</h1>
                <p>
                    Track your learning journey and celebrate every milestone.
                </p>
            </div>

            <button className="export-btn">
                Export Progress
            </button>

        </div>
    );
}

export default ProgressHeader;