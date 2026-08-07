import { FaBook } from "react-icons/fa";

function UpcomingTopicsCard() {
    return (
        <div className="upcoming-topics-card">

            <div className="card-header">

                <FaBook />

                <h3>Upcoming Topics</h3>

            </div>

            <div className="topic-list">

                <div className="topic-pill">
                    Vectors
                </div>

                <div className="topic-pill">
                    3D Geometry
                </div>

                <div className="topic-pill">
                    Complex Numbers
                </div>

            </div>

            <p className="milestone-text">

                Next Milestone →

            </p>

        </div>
    );
}

export default UpcomingTopicsCard;