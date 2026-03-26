import React from "react";
import { Link } from "react-router-dom";

const WebPage = () => {

  const coverStyle = {
    height: "50vh",  // 👈 same as services page
    backgroundImage: "url('/images/web-development.png')",
    backgroundSize: "center",
    backgroundPosition: "center 40%",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: "80px"
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)"
  };

  const coverTextStyle = {
    position: "relative",
    color: "#ffffff",
    fontSize: "48px",   // match services page
    fontWeight: "600"
  };

  const contentStyle = {
    padding: "80px 20px",
    textAlign: "center",
    backgroundColor: "#ffffff"
  };

  const paragraphStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    fontSize: "20px",
    lineHeight: "1.6",
    color: "#555"
  };

  return (
    <div>

      {/* Cover Section */}
      <div style={coverStyle}>
        <div style={overlayStyle}></div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <h1 style={coverTextStyle}>Web Development</h1>
          <p style={{ color: "#ffffff", marginTop: "10px" }}>
            <Link
                to="/"
                style={{
                  color: "#ffffff",
                  textDecoration: "none"
                }}
                onMouseOver={(e) => {
                  e.target.style.color = "#1b7b7f";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#ffffff";
                  e.target.style.textDecoration = "none";
                }} > Home  </Link> &gt;  Web-App </p>
        </div>
      </div>
      {/* Content Section */}
      <div style={contentStyle}>
        <p style={paragraphStyle}>
          We help businesses define objectives and create roadmaps.
          Our expert team delivers strategic solutions tailored to
          your organization's needs.
        </p>
      </div>

    </div>
  );
};

export default WebPage;