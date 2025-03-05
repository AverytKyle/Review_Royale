import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './BusinessMap.css'

function BusinessMap({ business }) {
    const mapRef = useRef(null);
    const apiKey = useSelector(state => state.maps.key);

    useEffect(() => {
        if (!business?.geometry?.location || !window.google) return;

        const map = new google.maps.Map(mapRef.current, {
            mapId: 'YOUR_MAP_ID', // Add your Map ID from Google Cloud Console
            center: {
                lat: business.geometry.location.lat(),
                lng: business.geometry.location.lng()
            },
            zoom: 15
        });

        // Load marker library and create marker
        google.maps.importLibrary("marker").then(() => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: {
                    lat: business.geometry.location.lat(),
                    lng: business.geometry.location.lng()
                },
                title: business.name
            });
        });

    }, [business]);

    return <div ref={mapRef} style={{ width: '100%', height: '250px' }} />;
}

export default BusinessMap;