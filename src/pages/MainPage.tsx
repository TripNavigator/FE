import React, { useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import BottomPanel from "../components/BottomPanel";
import CategorySelector from "../components/CategorySelector";
import FooterNav from "../components/FooterNav";
import { useGeolocation } from "../hooks/useGeolocation";
import useCategoryMarkers from "../hooks/useCategoryMarkers";

export default function MainPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [category, setCategory] = useState("식당")
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const location = useGeolocation();

    useCategoryMarkers({ map: mapRef.current, category, location });

    return (
        <div style={{width:"100vw", height: "100vh", position: "relative" }}>
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
                <SearchBar /><p />
                <CategorySelector
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>
                <BottomPanel />
                <FooterNav />
        </div>
    );
}
