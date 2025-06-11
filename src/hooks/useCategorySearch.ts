import { useEffect, useRef, useState } from "react";

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
    url: string;
    phone: string;
}

const useCategorySearch = (
    map: kakao.maps.Map | null,
    category: string | undefined,
    location?: Coordinate | null
) => {
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [loading, setLoading] = useState(false);

    const markersRef = useRef<kakao.maps.Marker[]>([]);
    const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
    const contentNodeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!map || !category || !location || !window.kakao?.maps?.services) {
            // Clean up markers and overlay
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            if (overlayRef.current) overlayRef.current.setMap(null);
            setResults([]);
            return;
        }

        const ps = new window.kakao.maps.services.Places();
        const bounds = new window.kakao.maps.LatLngBounds();
        const center = new window.kakao.maps.LatLng(location.lat, location.lng);

        setLoading(true);

        // 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 커스텀 오버레이 초기화
        if (!contentNodeRef.current) {
            const div = document.createElement("div");
            div.className = "placeinfo_wrap";
            contentNodeRef.current = div;
        }

        if (!overlayRef.current) {
            overlayRef.current = new window.kakao.maps.CustomOverlay({
                content: contentNodeRef.current,
                zIndex: 1,
            });

            // prevent map event bubbling
            const preventMap = window.kakao.maps.event.preventMap;
            contentNodeRef.current.addEventListener("mousedown", preventMap);
            contentNodeRef.current.addEventListener("touchstart", preventMap);
        }

        ps.categorySearch(
            category,
            (data: any[], status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const places: PlaceResult[] = data.map((place) => {
                        const lat = parseFloat(place.y);
                        const lng = parseFloat(place.x);
                        const position = new window.kakao.maps.LatLng(lat, lng);

                        const marker = new window.kakao.maps.Marker({
                            map,
                            position,
                        });

                        // 마커 클릭 시 커스텀 오버레이 표시
                        window.kakao.maps.event.addListener(marker, "click", () => {
                            const content = `
                                <div class="placeinfo">
                                    <a class="title" href="${place.place_url}" target="_blank">${place.place_name}</a>
                                    ${place.road_address_name
                                        ? `<span>${place.road_address_name}</span><span class="jibun">(지번: ${place.address_name})</span>`
                                        : `<span>${place.address_name}</span>`
                                    }
                                    <span class="tel">${place.phone ?? ""}</span>
                                </div>
                                <div class="after"></div>
                            `;

                            if (contentNodeRef.current && overlayRef.current) {
                                contentNodeRef.current.innerHTML = content;
                                overlayRef.current.setPosition(position);
                                overlayRef.current.setMap(map);
                            }
                        });

                        markersRef.current.push(marker);
                        bounds.extend(position);

                        return {
                            id: place.id,
                            name: place.place_name,
                            lat,
                            lng,
                            address: place.road_address_name || place.address_name,
                            url: place.place_url,
                            phone: place.phone,
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
