import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../redux/maps';
import { getPlaceDetails } from '../../context/PlaceDetails';
import { Loader } from '@googlemaps/js-api-loader';

function MapContainer() {
    const mapRef = useRef(null);
    const key = useSelector((state) => state.maps.key);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!key) {
            dispatch(getKey());
        }
    }, [dispatch, key]);

    useEffect(() => {
        if (key) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,marker`;
            script.async = true;
            script.defer = true;

            script.onload = async () => {
                const { Map } = await google.maps.importLibrary("maps");

                // Get user location
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    const map = new Map(mapRef.current, {
                        center: userLocation,
                        zoom: 12,
                        mapId: '751c754df1680c1b'
                    });

                    // Create a standard marker with a custom icon
                    const marker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "You are here",
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });

                    await getPlaceDetails(map);
                });
            };

            document.head.appendChild(script);
        }
    }, [key]);

    return (
        <div
            ref={mapRef}
            style={{
                width: '40%',
                height: '500px',
                border: '1px solid #ccc',
                margin: '20px 0'
            }}
        />
    );
}

export default MapContainer;