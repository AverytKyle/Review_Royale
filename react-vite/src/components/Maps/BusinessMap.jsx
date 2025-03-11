import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './BusinessMap.css'

function BusinessMap({ business }) {
    const mapRef = useRef(null);
    const apiKey = useSelector(state => state.maps.key);

    useEffect(() => {
        if (!business?.geometry?.location || !window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            mapId: apiKey,
            center: {
                lat: business.geometry.location.lat(),
                lng: business.geometry.location.lng()
            },
            zoom: 15
        });

        // Load marker library and create marker
        window.google.maps.importLibrary("marker").then(() => {
            new window.google.maps.marker.AdvancedMarkerElement({
                map,
                position: {
                    lat: business.geometry.location.lat(),
                    lng: business.geometry.location.lng()
                },
                title: business.name
            });
        });

    }, [business, apiKey]);

    return <div ref={mapRef} style={{ width: '100%', height: '250px' }} />;
}

export default BusinessMap;