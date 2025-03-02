import { useEffect, useRef } from 'react';
import './BusinessMap.css'

function BusinessMap({ business }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (business?.geometry?.location) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: {
                    lat: business.geometry.location.lat(),
                    lng: business.geometry.location.lng()
                },
                zoom: 15,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
            });

            new window.google.maps.Marker({
                position: {
                    lat: business.geometry.location.lat(),
                    lng: business.geometry.location.lng()
                },
                map: map
            });
        }
    }, [business]);

    return (
        <div className="business-map-container">
            <div ref={mapRef} style={{ width: '300px', height: '200px' }} />
            <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${business?.formatted_address}&destination_placeId=${business?.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-link"
            >
                Get Directions
            </a>
        </div>
    );
}

export default BusinessMap;
