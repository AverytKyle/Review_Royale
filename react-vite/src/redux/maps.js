import { csrfFetch } from './csrf';
import { Loader } from '@googlemaps/js-api-loader';

const LOAD_API_KEY = 'maps/LOAD_API_KEY';

const loadApiKey = (key) => ({
  type: LOAD_API_KEY,
  payload: key,
});

export const getKey = () => async (dispatch) => {
  const res = await csrfFetch('/api/maps/key', {
    method: 'POST',
  });
  const data = await res.json();
  dispatch(loadApiKey(data.googleMapsAPIKey));
};

export const initializeMaps = async (apiKey) => {
  const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'marker']
  });

  return await loader.load();
};

const initialState = { key: null };

const mapsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_API_KEY:
      return { key: action.payload };
    default:
      return state;
  }
};

export default mapsReducer;