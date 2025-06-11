import { useEffect, useState } from "react";

interface Coordinate {
  lat: number;
  lng: number;
}

const useMapCenter = (map: kakao.maps.Map | null) => {
  const [center, setCenter] = useState<Coordinate | null>(null);

  useEffect(() => {
    if (!map) return;

    const updateCenter = () => {
      const centerLatLng = map.getCenter();
      setCenter({ lat: centerLatLng.getLat(), lng: centerLatLng.getLng() });
    };

    // 처음 로딩 시
    updateCenter();

    // 지도 드래그 끝날 때마다 중심 좌표 업데이트
    kakao.maps.event.addListener(map, "dragend", updateCenter);

    // 줌 조작 끝날 때마다 중심 좌표 업데이트
    kakao.maps.event.addListener(map, "zoom_changed", updateCenter);

    return () => {
      kakao.maps.event.removeListener(map, "dragend", updateCenter);
      kakao.maps.event.removeListener(map, "zoom_changed", updateCenter);
    };
  }, [map]);

  return center;
};

export default useMapCenter;
