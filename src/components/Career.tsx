import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Technology – Computer Science</h4>
                <h5>Brainware University</h5>
              </div>
              <h3>2028</h3>
            </div>
            <p>
              Relevant Coursework: Data Structures & Algorithms, Operating Systems,
              Database Management Systems, Computer Networks, Software Engineering.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Basic Education</h4>
                <h5>BSEB Patna</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Successfully completed 10th grade (69%) and 12th grade (65%) under the
              BSEB Patna board.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Self Projects & Portfolio</h4>
                <h5>Personal Experience</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Actively developing personal projects to enhance technical skills and
              apply modern technologies like HTML, CSS, JavaScript, and Node.js.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
