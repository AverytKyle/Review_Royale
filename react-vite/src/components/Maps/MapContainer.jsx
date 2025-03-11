import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../redux/maps';
import { Loader } from '@googlemaps/js-api-loader';

let loader = null;

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
        if (!key) return;

        if (!loader) {
            loader = new Loader({
                apiKey: key,
                version: "weekly",
                libraries: ["places"]
            });
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