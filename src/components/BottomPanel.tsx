import React, { useState } from "react";

interface BottomPanelProps {
  content?: React.ReactNode;
}

const BottomPanel: React.FC<BottomPanelProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const panelHeight = isOpen ? "45%" : "56px"; // 최소 높이를 Footer보다 살짝 높게

  return (
    <div
      style={{
        position: "fixed",
        bottom: "56px", // 👈 Footer 위로 띄우기
        left: 0,
        right: 0,
        height: panelHeight,
        backgroundColor: "#fff",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
        transition: "height 0.3s ease-in-out",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      {/* 화살표 헤더 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: "#ccc",
          }}
        />
      </div>

      {/* 펼쳐졌을 때 내용 */}
      {isOpen && (
        <div
          style={{
            padding: "16px",
            overflowY: "auto",
            height: "calc(100% - 40px)",
          }}
        >
          {content || <p>아직 선택된 장소가 없습니다.</p>}
        </div>
      )}
    </div>
  );
};

export default BottomPanel;
