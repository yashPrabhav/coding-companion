import "./DashboardHome.css";

function DashboardHome() {

    const dashboard = {

        continueLearning: {
            currentTopic: "React State",
            lastSession: "React Components",
        },

        todaysGoal: {
            title: "Complete Session 7",
        },

        progress: {
            completedTopics: 12,
            streak: 5,
        },

        nextMilestone: {
            title: "Learn React Hooks",
        }

    };

    return (

        <div className="dashboard-home">

            <div className="dashboard-grid">

                {/* Continue Learning */}

                <div className="dashboard-card">

                    <h2>Continue Learning</h2>

                    <h3>
                        {dashboard.continueLearning.currentTopic}
                    </h3>

                    <p>
                        Last Session: {dashboard.continueLearning.lastSession}
                    </p>

                    <button className="resume-btn">
                        Resume
                    </button>

                </div>

                {/* Today's Goal */}

                <div className="dashboard-card">

                    <h2>Today's Goal</h2>

                    <p>
                        {dashboard.todaysGoal.title}
                    </p>

                </div>

                {/* Progress */}

                <div className="dashboard-card">

                    <h2>Your Progress</h2>

                    <div className="progress-info">

                        <div>

                            <h3>{dashboard.progress.completedTopics}</h3>

                            <p>Completed Topics</p>

                        </div>

                        <div>

                            <h3>{dashboard.progress.streak}</h3>

                            <p>Day Streak</p>

                        </div>

                    </div>

                </div>

                {/* Next Milestone */}

                <div className="dashboard-card">

                    <h2>Next Milestone</h2>

                    <p>
                        {dashboard.nextMilestone.title}
                    </p>

                </div>

            </div>

        </div>

    );

}

export default DashboardHome;