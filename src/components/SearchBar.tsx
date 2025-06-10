import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();

    const goSearchPage = () => {
        navigate("/SearchPage");
    };

    return (
        <div
            onClick={goSearchPage}
            style={{
                padding: "10px",
                background: "#fff",
                zIndex: 100,
                height: "40px", 
                borderRadius: "8px", 
                cursor: "pointer", 
                display: "flex",
                alignItems: "center",
            }}
        >
           <span style={{ color: "gray", padding: "15px" }}>Where do you want to go?</span>
        </div>
    );
}
