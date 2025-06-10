import BottomPanel from "../components/BottomPanel";
import MapView from "../components/MapView";

export default function PlaceDetailPage() {
    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <MapView />
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    right: 20,
                    zIndex: 10,
                }}
            >
            </div>
            <BottomPanel />
        </div>
    );
}
