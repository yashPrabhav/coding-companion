import { FaClipboardCheck } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";

function TodayTasksCard() {

    return (

        <div className="today-tasks-card">

            <div className="card-header">

                <FaClipboardCheck />

                <h3>Today's Tasks</h3>

            </div>

            <div className="task-list">

                <div className="task-item">

                    <FaCheckCircle className="task-completed" />

                    <span>Linear Equations</span>

                </div>

                <div className="task-item">

                    <FaRegCircle className="task-pending" />

                    <span>Matrix Multiplication</span>

                </div>

                <div className="task-item">

                    <FaRegCircle className="task-pending" />

                    <span>Determinants</span>

                </div>

            </div>

            <p className="task-summary">

                2 Tasks Remaining

            </p>

        </div>

    );

}

export default TodayTasksCard;