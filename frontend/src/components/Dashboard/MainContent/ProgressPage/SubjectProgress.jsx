import  ProgressBar  from "../Common/ProgressBar";

function SubjectProgress() {

    const subjects = [
        {
            subject: "Mathematics",
            completed: 18,
            total: 25,
        },
    ];

    return (

        <div className="subject-progress-card">

            <div className="subject-header">
                <h2>Subject Progress</h2>
                <p>Track progress subject-wise</p>
            </div>

            {subjects.map((item) => {
                const progress = Math.round(
                    (item.completed / item.total) * 100
                );

                return (

                    <div
                        className="subject-row"
                        key={item.subject}
                    >

                        <div className="subject-info">

                            <div>

                                <h3>{item.subject}</h3>

                                <p>
                                    {item.completed} / {item.total} Topics
                                </p>

                            </div>

                            <span>
                                Progress: {progress}%
                            </span>

                        </div>

                        <ProgressBar progress={progress} />

                    </div>

                );

            })}

        </div>

    );

}

export default SubjectProgress;