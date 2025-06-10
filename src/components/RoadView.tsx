import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import goToCurrentLocationIcon from "../assets/go_to_current_location.png";
import { useGeolocation } from "../hooks/useGeolocation";

const RoadView = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const roadviewRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const roadviewInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);
    const roadviewClient = useRef<any>(null);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const lat = parseFloat(searchParams.get("lat") || "37.5665");
    const lng = parseFloat(searchParams.get("lng") || "126.9780");

    const location = useGeolocation();

    const [position, setPosition] = useState({ lat, lng });
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [overlayOn, setOverlayOn] = useState(true);

    const updateRoadView = (lat: number, lng: number) => {
        const kakao = window.kakao;
        const pos = new kakao.maps.LatLng(lat, lng);
        roadviewClient.current.getNearestPanoId(pos, 50, (panoId: any) => {
            if (panoId) {
                roadviewInstance.current.setPanoId(panoId, pos);
            } else {
                setIsFullScreen(true); 
            }
        });
    };

    useEffect(() => {
        const kakao = window.kakao;
        if (!kakao || !mapRef.current || !roadviewRef.current) return;

        const map = new kakao.maps.Map(mapRef.current, {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3,
        });
        mapInstance.current = map;

        const roadview = new kakao.maps.Roadview(roadviewRef.current);
        roadviewInstance.current = roadview;

        roadviewClient.current = new kakao.maps.RoadviewClient();
        
        const markerImage = new kakao.maps.MarkerImage(
            "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png",
            new kakao.maps.Size(26, 46),
            {
                spriteSize: new kakao.maps.Size(1666, 168),
                spriteOrigin: new kakao.maps.Point(705, 114),
                offset: new kakao.maps.Point(13, 46),
            }
        );

        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            image: markerImage,
            draggable: true,
            map,
        });
        markerInstance.current = marker;

        kakao.maps.event.addListener(marker, "dragend", () => {
            const pos = marker.getPosition();
            setPosition({ lat: pos.getLat(), lng: pos.getLng() });
            updateRoadView(pos.getLat(), pos.getLng());
        });

        kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
            if (!overlayOn) return;
            const clickPos = mouseEvent.latLng;
            marker.setPosition(clickPos);
            updateRoadView(clickPos.getLat(), clickPos.getLng());
        });

        kakao.maps.event.addListener(roadview, "position_changed", () => {
            const pos = roadview.getPosition();
            map.setCenter(pos);
            if (overlayOn) marker.setPosition(pos);
        });

        updateRoadView(lat, lng);

        return () => {
            marker.setMap(null);
            mapInstance.current = null;
            roadviewInstance.current = null;
        };
    }, []);

    const toggleFullScreen = () => setIsFullScreen(prev => !prev);

    const handleMoveToCurrentLocation = () => {
        if (!location) return;
        const newLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
        mapInstance.current.setCenter(newLatLng);
        markerInstance.current.setPosition(newLatLng);
        updateRoadView(location.lat, location.lng);
    };

    // const toggleOverlay = () => {
    //     if (!mapInstance.current) return;
    //     const map = mapInstance.current;
    //     if (!overlayOn) {
    //         map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    //         markerInstance.current.setMap(map);
    //         updateRoadView(position.lat, position.lng);
    //     } else {
    //         map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    //     }
    //     setOverlayOn(!overlayOn);
    // };

    return (
        <div style={{ width: "100%", height: "100%", position: "fixed", top: 0, left: 0 }}>
            <div
                ref={roadviewRef}
                style={{
                    width: "100%",
                    height: isFullScreen ? "100%" : "50%",
                    transition: "height 0.3s",
                    zIndex: 1,
                }}
            />

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: isFullScreen ? "0%" : "50%",
                    display: isFullScreen ? "none" : "block",
                    transition: "height 0.3s",
                    zIndex: 0,
                }}
            />

            <button
                onClick={toggleFullScreen}
                style={floatingButtonStyle(20, 20)}
            >
                {isFullScreen ? "back" : "full screen"}
            </button>

            <button
                onClick={() => navigate(-1)}
                style={floatingButtonStyle(20, undefined, 20)}
            >
                close
            </button>

            <button
                onClick={handleMoveToCurrentLocation}
                style={circleButtonStyle(140)}
                aria-label="내 위치로 이동"
            >
                <img src={goToCurrentLocationIcon} alt="내 위치" style={{ width: 30, height: 30 }} />
            </button>

            {/* 오버레이 토글
            <button
                onClick={toggleOverlay}
                style={floatingButtonStyle(70, 20)}
            >
                {overlayOn ? "도로 끄기" : "도로 보기"}
            </button> */}
        </div>
    );
};

const floatingButtonStyle = (top: number, right?: number, left?: number): React.CSSProperties => ({
    position: "absolute",
    top,
    right,
    left,
    zIndex: 10,
    padding: "8px 12px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
});

const circleButtonStyle = (bottom: number): React.CSSProperties => ({
    position: "fixed",
    bottom,
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
});

export default RoadView;
