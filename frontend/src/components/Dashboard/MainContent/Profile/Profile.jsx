import "./Profile.css";

function Profile() {

    const profile = {
        name: "Yash",
        level: "Level 1 Builder",
        goal: "Build an AI company",
        bio: "Building Coding Companion while learning web development and product thinking.",
        interests: [
            "AI",
            "Programming",
            "Product Design",
            "Startups",
        ],
    };


    return (
        <div className="profile-page">

            <div className="profile-card">

                <div className="profile-avatar">
                    👤
                </div>


                <h2>{profile.name}</h2>


                <p className="profile-level">
                    {profile.level}
                </p>


                <button className="edit-profile-btn">
                    Edit Profile
                </button>

            </div>



            <div className="profile-section">

                <h3>Goal</h3>

                <p>
                    {profile.goal}
                </p>

            </div>



            <div className="profile-section">

                <h3>About Me</h3>

                <p>
                    {profile.bio}
                </p>

            </div>



            <div className="profile-section">

                <div className="section-header">

                    <h3>
                        Interests
                    </h3>


                    <span className="verified">
                        ✓ User Verified
                    </span>

                </div>



                <div className="interest-container">

                    {profile.interests.map((interest) => (

                        <span
                            className="interest-tag"
                            key={interest}
                        >

                            {interest}

                        </span>

                    ))}

                </div>


            </div>


        </div>
    );
}


export default Profile;