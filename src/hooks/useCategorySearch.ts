import { useEffect, useState, useRef } from "react";

interface Coordinate {
    lat: number;
    lng: number;
}

interface PlaceResult {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
}

const useCategorySearch = (
    map: kakao.maps.Map | null,
    category: string | undefined,
    location?: Coordinate | null
) => {
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [loading, setLoading] = useState(false);

    // 이전 마커들을 기억하기 위한 ref
    const markersRef = useRef<kakao.maps.Marker[]>([]);

    useEffect(() => {
        // 지도, 카테고리, 위치 없으면 결과 초기화하고 마커 삭제
        if (!map || !category || !location || !window.kakao?.maps?.services) {
            // 이전 마커 제거
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
            setResults([]);
            return;
        }

        const ps = new window.kakao.maps.services.Places();
        const bounds = new window.kakao.maps.LatLngBounds();
        const center = new window.kakao.maps.LatLng(location.lat, location.lng);

        setLoading(true);

        // 이전 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        ps.categorySearch(
            category,
            (data: any[], status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const places = data.map((place) => {
                        const lat = parseFloat(place.y);
                        const lng = parseFloat(place.x);
                        const position = new window.kakao.maps.LatLng(lat, lng);
                        const marker = new window.kakao.maps.Marker({
                            map,
                            position,
                        });

                        markersRef.current.push(marker);
                        bounds.extend(position);

                        return {
                            id: place.id,
                            name: place.place_name,
                            lat,
                            lng,
                            address: place.road_address_name || place.address_name,
                        };
                    });

                    setResults(places);
                    map.setBounds(bounds);
                } else {
                    setResults([]);
                }
                setLoading(false);
            },
            {
                location: center,
                radius: 5000,
                sort: window.kakao.maps.services.SortBy.DISTANCE,
            }
        );
    }, [map, category, location]);

    return { results, loading };
};

export default useCategorySearch;
