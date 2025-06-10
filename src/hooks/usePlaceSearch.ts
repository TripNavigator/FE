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

      // 키워드 검색
      ps.keywordSearch(query, (data: any, status: any) => {
        let keywordResults: string[] = [];
        if (status === window.kakao.maps.services.Status.OK) {
          keywordResults = data.map((place: any) => place.place_name);
        }

        // 카테고리 검색 (예: 음식점(FD6) 또는 카페(CE7) 등)
        const categoryCodes = ["FD6", "CE7"];
        let categoryResults: string[] = [];
        let completedRequests = 0;

        categoryCodes.forEach((code) => {
          ps.categorySearch(
            code,
            (categoryData: any, categoryStatus: any) => {
              if (categoryStatus === window.kakao.maps.services.Status.OK) {
                categoryResults = [
                  ...categoryResults,
                  ...categoryData.map((place: any) => place.place_name),
                ];
              }

              completedRequests++;
              if (completedRequests === categoryCodes.length) {
                const allResults = [...new Set([...keywordResults, ...categoryResults])];
                setResults(allResults);
                setLoading(false);
              }
            },
            searchOptions
          );
        });
      }, searchOptions);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, location]);

  return { results, loading };
};

export default usePlaceSearch;
