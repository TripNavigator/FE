import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import BottomPanel from "../components/BottomPanel";
import CategorySelector from "../components/CategorySelector";
import FooterNav from "../components/FooterNav";
import { useGeolocation } from "../hooks/useGeolocation";
import useCategorySearch from "../hooks/useCategorySearch";
import type { Category } from "../types/Category";

export default function MainPage() {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const location = useGeolocation();
    const { results, loading } = useCategorySearch(
        map,
        selectedCategory?.code,
        location ?? undefined
    );

    const handleSelectCategory = (category: Category) => {
        if (selectedCategory?.code === category.code) {
            // 같은 걸 다시 누르면 선택 해제
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <MapView onMapLoad={setMap} />

            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    right: 20,
                    zIndex: 10,
                }}
            >
                <SearchBar />
                <CategorySelector
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />
            </div>

            <BottomPanel
                content={
                    loading ? (
                        <p>로딩 중...</p>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((place) => (
                                <li key={place.id}>
                                    <strong>{place.name}</strong>
                                    <br />
                                    {place.address}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>장소를 찾을 수 없습니다.</p>
                    )
                }
            />

            <FooterNav />
        </div>
    );
}
