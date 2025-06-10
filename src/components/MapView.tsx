import { useEffect, useRef, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNavigate } from "react-router-dom";

import goToCurrentLocationIcon from "../assets/go_to_current_location.png";
import roadViewIcon from "../assets/roadView.png";
import currentLocationIcon from "../assets/current_location.png";

interface MapViewProps {
    style?: React.CSSProperties;
}

const MapView = ({ style }: MapViewProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);

    const location = useGeolocation();
    const navigate = useNavigate();

    // location 바뀔 때 리렌더링 방지
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!window.kakao || !location || !mapRef.current) return;

        const kakao = window.kakao;
        const container = mapRef.current;

        const markerImage = new kakao.maps.MarkerImage(
            currentLocationIcon,
            new kakao.maps.Size(18, 18)
        );

        if (!initialized) {
            const map = new kakao.maps.Map(container, {
                center: new kakao.maps.LatLng(location.lat, location.lng),
                level: 3,
            });

            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(location.lat, location.lng),
                map,
                image: markerImage,
            });

            mapInstance.current = map;
            markerInstance.current = marker;
            setInitialized(true);
        }
    }, [location, initialized]);

    const handleMoveToCureentLocation = () => {
        if (!location || !mapInstance.current || !markerInstance.current)
            return;
        const newPosition = new window.kakao.maps.LatLng(
            location.lat,
            location.lng
        );
        mapInstance.current.setCenter(newPosition);
        markerInstance.current.setPosition(newPosition);
    };

    const goToRoadView = () => {
        if (!mapInstance.current) return;
        const center = mapInstance.current.getCenter();
        navigate(`/roadview?lat=${center.getLat()}&lng=${center.getLng()}`);
    };

    return (
        <>
            <button
                onClick={handleMoveToCureentLocation}
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
                <img
                    src={goToCurrentLocationIcon}
                    alt="내 위치"
                    style={{ width: 30, height: 30 }}
                />
            </button>

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
                <img
                    src={roadViewIcon}
                    alt="로드뷰"
                    style={{ width: 30, height: 30 }}
                />
            </button>

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "100%",
                    ...style,
                    zIndex: 0,
                }}
            />
        </>
    );
};

export default MapView;
