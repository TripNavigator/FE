import { useEffect } from "react";

interface Props {
  map: kakao.maps.Map | null;
  category: string;
  location: { lat: number; lng: number } | null;
}

const useCategoryMarkers = ({ map, category, location }: Props) => {
  useEffect(() => {
    if (!map || !category || !location) return;

    const ps = new window.kakao.maps.services.Places();
    const bounds = new window.kakao.maps.LatLngBounds();
    const markers: kakao.maps.Marker[] = [];

    const callback = (data: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        alert(data);
        data.forEach((place) => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);
          const marker = new window.kakao.maps.Marker({
            map,
            position,
          });
          markers.push(marker);
          bounds.extend(position);
        });
        map.setBounds(bounds);
      }
    };

    const options = {
      location: new window.kakao.maps.LatLng(location.lat, location.lng),
      radius: 2000,
    };

    ps.keywordSearch(category, callback, options);

    return () => {
      // 마커 정리
      markers.forEach((m) => m.setMap(null));
    };
  }, [map, category, location]);
};

export default useCategoryMarkers;
