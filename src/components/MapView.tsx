import { useEffect, useRef, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNavigate } from "react-router-dom";

import goToCurrentLocationIcon from "../assets/go_to_current_location.png";
import roadViewIcon from "../assets/roadView.png";
import currentLocationIcon from "../assets/current_location.png";

interface MapViewProps {
  onMapLoad: (map: kakao.maps.Map) => void;
  style?: React.CSSProperties;
}

export default function MapView({ onMapLoad, style }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  const location = useGeolocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.kakao || !mapContainerRef.current || !location) return;

    const kakao = window.kakao;
    const container = mapContainerRef.current;

    const createdMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(location.lat, location.lng),
      level: 3,
    });

    const markerImage = new kakao.maps.MarkerImage(
      currentLocationIcon,
      new kakao.maps.Size(18, 18)
    );

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(location.lat, location.lng),
      map: createdMap,
      image: markerImage,
    });

    markerRef.current = marker;
    setMap(createdMap);
    onMapLoad(createdMap); // ✅ 부모(MainPage)에게 map 전달
  }, [location]);

  const handleMoveToCurrentLocation = () => {
    if (!map || !location || !markerRef.current) return;

    const newPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
    map.setCenter(newPosition);
    markerRef.current.setPosition(newPosition);
  };

  const goToRoadView = () => {
    if (!map) return;
    const center = map.getCenter();
    navigate(`/roadview?lat=${center.getLat()}&lng=${center.getLng()}`);
  };

  return (
    <>
      {/* 내 위치 이동 버튼 */}
      <button
        onClick={handleMoveToCurrentLocation}
        style={{
          position: "fixed",
          bottom: 140,
          right: 20,
          zIndex: 10,
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="내 위치로 이동"
      >
        <img src={goToCurrentLocationIcon} alt="내 위치" style={{ width: 30, height: 30 }} />
      </button>

      {/* 로드뷰 이동 버튼 */}
      <button
        onClick={goToRoadView}
        style={{
          position: "fixed",
          top: 200,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          fontSize: 12,
          cursor: "pointer",
          zIndex: 10,
        }}
        aria-label="로드뷰 열기"
      >
        <img src={roadViewIcon} alt="로드뷰" style={{ width: 30, height: 30 }} />
      </button>

      {/* 지도 */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          ...style,
          zIndex: 0,
        }}
      />
    </>
  );
}
