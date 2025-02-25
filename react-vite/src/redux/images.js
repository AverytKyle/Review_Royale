import { csrfFetch } from "./csrf";

const LOAD = 'images/LOAD';
const LOAD_IMAGE_BY_ID = 'images/LOAD_IMAGE_BY_ID'
const CREATE = 'images/CREATE';
const DELETE = 'images/DELETE';
const UPDATE = 'images/UPDATE';

const load = images => ({
    type: LOAD,
    images
});

const load_image_by_id = image => ({
    type: LOAD_IMAGE_BY_ID,
    image
})

const create_image = image => ({
    type: CREATE,
    image
});

const delete_image = imageId => ({
    type: DELETE,
    imageId
});

const update_image = image => ({
    type: UPDATE,
    image
})

export const getAllImages = () => async dispatch => {
    const response = await csrfFetch(`/api/images/business/${businessId}`);
    
        if (response.ok) {
            const images = await response.json();
            dispatch(load(images));
            return images
        }
}

export const getImageById = (imageId) => async dispatch => {
    const response = await csrfFetch(`/api/images/${imageId}`);
    
        if (response.ok) {
            const image = await response.json();
            dispatch(load_image_by_id(image));
            return image
        }
}

export const createImage = (imageData) => async dispatch => {
    const formattedData = {
        businessId: imageData.businessId,
        url: imageData.url,
    }

    const response = await csrfFetch(`/api/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
    });
   
    if (response.ok) {
        const image = await response.json();
        dispatch(create_image(image));
        return image;
    }
}

export const updateImage = (imageId, imageData) => async dispatch => {
    const response = await csrfFetch(`/api/images/${imageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            businessId: imageData.businessId,
            url: imageData.url,
        })
    });

    if (response.ok) {
        const image = await response.json();
        dispatch(update_image(image));
        return image
    }
}

export const deleteImage = (imageId) => async dispatch => {
    const response = await csrfFetch(`/api/images/${imageId}`, {
            method: 'DELETE'
        });
        dispatch(delete_image(imageId));
        return response;
}

const initialState = {
    Images: {}
}

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            newState.Images = {};
            const imagesArray = action.images.Images;
            imagesArray.forEach(image => {
                newState.Images[image.id] = {
                    ...image
                }
            });
            return newState;
        }
        case LOAD_IMAGE_BY_ID: {
            const newState = { ...state };
            newState.Images = { ...action.image };
            return newState;
        }
        case CREATE: {
            const newState = { ...state };
            newState.Images[action.payload.id] = action.payload;
            return newState
        }
        case UPDATE: {
            const newState = { ...state };
            newState.Images[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE: {
            const newState = { ...state };
            delete newState.Images[action.imageId]
            return newState;
        }
        default:
            return state;
    }
}

export default imagesReducer;