import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import { useIsMobile } from '../../hook/useMobile';

export function AccessInfoMaps({ lat, long }: { lat: number | string; long: number | string }) {
    const isMobile = useIsMobile();

    const parsedLat = parseFloat(String(lat));
    const parsedLong = parseFloat(String(long));

    const sanitizedLat = isNaN(parsedLat) ? -7.763634776322426 : parsedLat;
    const sanitizedLong = isNaN(parsedLong) ? 110.3689353416943 : parsedLong;

    React.useEffect(() => {
        if (isNaN(sanitizedLat) || isNaN(sanitizedLong)) return;

        const map = new maplibregl.Map({
            container: "access-info-map",
            style: 'https://api.maptiler.com/maps/streets/style.json?key=rJesvYzd1J4oIcT9N4sA',
            center: [sanitizedLong, sanitizedLat],
            zoom: 11,
            interactive: false
        });

        new maplibregl.Marker()
            .setLngLat([sanitizedLong, sanitizedLat])
            .addTo(map);

        return () => map.remove();
    }, [sanitizedLat, sanitizedLong]);

    return (
        <div
            id="access-info-map"
            style={{
                width: "100%",
                height: isMobile ? "500px" : "400px",
                borderRadius: "8px",
                overflow: "hidden"
            }}
        />
    );
}
