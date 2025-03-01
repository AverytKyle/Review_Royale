import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../redux/maps';
// import { getPlaceDetails } from '../../context/PlaceDetails';
import { Loader } from '@googlemaps/js-api-loader';

let loader = null;

function MapContainer() {
    const mapRef = useRef(null);
    const key = useSelector((state) => state.maps.key);
    const dispatch = useDispatch();

    let placeDetails
    useEffect(() => {
        if (!key) {
            dispatch(getKey());
        }
    }, [dispatch, key]);

    useEffect(() => {
        if (!key) return;

        if (!loader) {
            loader = new Loader({
                apiKey: key,
                version: "weekly",
                libraries: ["places"]
            });
        }

        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            
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

                const marker = new AdvancedMarkerElement({
                    map,
                    position: userLocation,
                    title: "You are here"
                });

                const placeDetails = await getPlaceDetails(map);
                console.log("Place details:", placeDetails);
            });
        });

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