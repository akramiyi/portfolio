import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:meakramiyi@gmail.com" data-cursor="disable">
                meakramiyi@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>+91 6204110766</p>
            <h4>Education</h4>
            <p>B.Tech in Computer Science</p>
          </div>
          <div className="contact-box">
            <h4>Social & Location</h4>
            <a
              href="https://github.com/akramiyi"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/akram-alii"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://instagram.com/akramiyi"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
            <p style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
              841421 - Chhapra, Bihar
            </p>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Akram Ansari</span>
            </h2>
            <h5>
              <MdCopyright /> 2025
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
