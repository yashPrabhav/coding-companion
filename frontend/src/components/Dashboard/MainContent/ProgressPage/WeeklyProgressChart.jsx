function WeeklyProgress() {

    const weeklyData = [
        { day: "Mon", progress: 55 },
        { day: "Tue", progress: 80 },
        { day: "Wed", progress: 65 },
        { day: "Thu", progress: 90 },
        { day: "Fri", progress: 75 },
        { day: "Sat", progress: 95 },
        { day: "Sun", progress: 70 },
    ];

    return (
        <div className="weekly-progress-card">

            <div className="weekly-header">
                <h2>Weekly Progress</h2>
                <p>Your study consistency this week</p>
            </div>

            <div className="weekly-bars">

                {weeklyData.map((item) => (
                    <div className="day-column" key={item.day}>

                        <div
                            className="bar"
                            style={{ height: `${item.progress}%` }}
                        ></div>

                        <span>{item.day}</span>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default WeeklyProgress;