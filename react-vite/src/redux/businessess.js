/* global google */
import { csrfFetch } from "./csrf";

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LOAD_CURRENT = 'businesses/LOAD_CURRENT';
const LOAD_ALL = 'businesses/LOAD_ALL';
const LOAD_BY_ID = 'businesses/LOAD_BY_ID';
const CREATE = 'businesses/CREATE';
const UPDATE = 'businesses/UPDATE';
const DELETE = 'businesses/DELETE';

const loadCurrent = businesses => ({
    type: LOAD_CURRENT,
    businesses
})

const loadById = business => ({
    type: LOAD_BY_ID,
    business
})

const loadAll = businesses => ({
    type: LOAD_ALL,
    businesses
})

const createBusiness = business => ({
    type: CREATE,
    business
})

const update_business = business => ({
    type: UPDATE,
    business
})

const delete_business = (businessId) => ({
    type: DELETE,
    businessId
})

export const getCurrentUserBusinesses = () => async dispatch => {
    const response = await csrfFetch(`/api/businesses/current`);

    if (response.ok) {
        const businesses = await response.json();
        dispatch(loadCurrent(businesses));
        return businesses
    }
}

export const getBusinessById = (businessId) => async dispatch => {
    const response = await csrfFetch(`/api/businesses/${businessId}`);

    if (response.ok) {
        const business = await response.json();
        dispatch(loadById(business));
        return business
    }
}

export const getPlaceById = (placeId) => async dispatch => {
    // First load the places library
    await google.maps.importLibrary("places");
    
    // Create service with proper DOM element
    const mapDiv = document.createElement('div');
    document.body.appendChild(mapDiv);
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    const request = {
        placeId: placeId,
        fields: [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'website',
            'delivery',
            'geometry',
            'opening_hours',
            'rating',
            'reviews',
            'types',
            'photos',
            'user_ratings_total'
        ]
    };

    return new Promise((resolve, reject) => {
        service.getDetails(request, (place, status) => {
            document.body.removeChild(mapDiv);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                dispatch(loadById(place));
                resolve(place);
            } else {
                reject(status);
            }
        });
    });
};


export const getAllBusinesses = () => async dispatch => {
    const response = await csrfFetch(`/api/businesses`);

    if (response.ok) {
        const businesses = await response.json();
        dispatch(loadAll(businesses));
        return businesses
    }
}

export const createNewBusiness = (businessData) => async dispatch => {
    const formattedData = {
        userId: businessData.userId,
        name: businessData.name,
        phoneNumber: businessData.phoneNumber,
        website: businessData.website,
        addressLineOne: businessData.addressLineOne,
        addressLineTwo: businessData.addressLineTwo,
        city: businessData.city,
        state: businessData.state,
        zip: businessData.zip,
    }

    const response = await csrfFetch(`/api/businesses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
    });

    if (response.ok) {
        const business = await response.json();
        dispatch(createBusiness(business));
        return business
    }
}

export const updateBusiness = (businessId, businessData) => async dispatch => {
    const formattedData = {
        userId: businessData.userId,
        name: businessData.name,
        email: businessData.email,
        phoneNumber: businessData.phoneNumber,
        website: businessData.website,
        addressLineOne: businessData.addressLineOne,
        addressLineTwo: businessData.addressLineTwo,
        city: businessData.city,
        state: businessData.state,
        zip: businessData.zip,
    }

    const response = await csrfFetch(`/api/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
    });

    if (response.ok) {
        const business = await response.json();
        dispatch(update_business(business));
        return business
    }
}

export const deleteBusiness = (businessId) => async dispatch => {
    const response = await csrfFetch(`/api/businesses/${businessId}`, {
        method: 'DELETE'
    });
    dispatch(delete_business(businessId));
    return response;
}

const initialState = {
    Businesses: {}
}

const businessesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CURRENT: {
            const newState = { ...state };
            newState.Businesses = {};
            const businessArray = action.businesses.Businesses;
            businessArray.forEach(business => {
                newState.Businesses[business.id] = {
                    ...business
                }
            });
            return newState;
        }
        case LOAD_BY_ID: {
            const newState = { ...state };
            newState.Businesses = {};
            newState.Businesses = { ...action.business };
            return newState;
        }
        case LOAD_ALL: {
            const newState = { ...state };
            newState.Businesses = {};
            const businessArray = action.businesses.Businesses;
            businessArray.forEach(business => {
                newState.Businesses[business.id] = {
                    ...business
                }
            });
            return newState;
        }
        case CREATE: {
            const newState = { ...state };
            newState.Businesses[action.payload.id] = action.payload;
            return newState
        }
        case UPDATE: {
            const newState = { ...state };
            newState.Businesses[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE: {
            const newState = { ...state };
            delete newState.Businesses[action.businessId]
            return newState;
        }
        default:
            return state;
    }
}

export default businessesReducer;