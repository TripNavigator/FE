import { useEffect, useState } from "react";

interface Coordinate {
  lat: number;
  lng: number;
}

const usePlaceSearch = (query: string, location?: Coordinate) => {
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || !window.kakao?.maps?.services) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            const ps = new window.kakao.maps.services.Places();
            setLoading(true);

            const searchOptions: any = {
                location: location
                    ? new window.kakao.maps.LatLng(location.lat, location.lng)
                    : undefined,
                radius: 5000, 
                sort: window.kakao.maps.services.SortBy.DISTANCE,
            };

            ps.keywordSearch(query, (data: any, status: any) => {
                setLoading(false);
                if (status === window.kakao.maps.services.Status.OK) {
                    const lowerQuery = query.toLowerCase();
                    const filtered = data.filter((place: any) =>
                        place.place_name.toLowerCase().startsWith(lowerQuery)
                    );
                    const names = filtered.map((place: any) => place.place_name);
                    setResults(names);
                } else {
                    setResults([]);
                }
            }, searchOptions);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, location]);

    return { results, loading };
};

export default usePlaceSearch;
