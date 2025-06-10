import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import back_arrows from "../assets/back_arrows.png";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    onSelect: (value: string) => void;
}

const SearchInput = ({ value, onChange, suggestions, onSelect }: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus(); 
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none",
                        border: "none",
                        fontSize: 20,
                        padding: "0 12px",
                        cursor: "pointer",
                        color: "#333",
                    }}
                    aria-label="뒤로가기"
                >
                    <img 
                    src={back_arrows}
                    alt="뒤로가기"
                    style={{width: 15, height: 15}}
                    />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Where do you want to go?"
                    style={{
                        flex: 1,
                        padding: "18px 10px",
                        fontSize: "16px",
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        outline: "none",
                    }}
                />
            </div>

            <div style={{ marginTop: 8 }}>
                {suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(suggestion)}
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #eee",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            textAlign: "left"
                        }}
                    >
                        {suggestion}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchInput;
