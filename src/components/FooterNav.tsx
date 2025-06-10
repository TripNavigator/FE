// components/FooterNav.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

const FooterNav = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "56px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      <button onClick={() => navigate("/")} style={navButtonStyle}>홈</button>
      <button onClick={() => navigate("/favPage")} style={navButtonStyle}>찜</button>
      <button onClick={() => navigate("/myPage")} style={navButtonStyle}>마이</button>
    </div>
  );
};

const navButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "14px",
  cursor: "pointer",
};

export default FooterNav;
