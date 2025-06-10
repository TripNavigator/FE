import { useEffect, useState } from "react";

type Coordinate = {
    lat: number;
    lng: number;
} | null;

export function useGeolocation() {
    const [location, setLocation] = useState<Coordinate>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser.");
            return;
        }

        const watcher = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLocation({ lat, lng });
            },

            (err) => {
                console.error("Geolocation error: ", err);
                if (err.code === 1) {
                    console.warn("Permission denied");
                } else if (err.code === 2) {
                    console.warn("Position unavailable");
                } else if (err.code === 3) {
                    console.warn("Timeout");
                }
                setLocation(null);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 5000,
            }
        );
        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    return location;
}
