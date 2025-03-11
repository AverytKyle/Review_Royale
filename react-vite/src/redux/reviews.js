/* global google */
import { csrfFetch } from "./csrf";

const LOAD = 'reviews/LOAD';
const LOAD_BY_ID = 'reviews/LOAD_BY_ID';
const LOAD_BUSINESS_REVIEWS = 'reviews/LOAD_BUSINESS_REVIEWS';
const LOAD_GOOGLE_REVIEWS = 'reviews/LOAD_GOOGLE_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';

const loadReviews = reviews => ({
    type: LOAD,
    reviews
});

const loadById = review => ({
    type: LOAD_BY_ID,
    review
})

const loadBusinessReviews = reviews => ({
    type: LOAD_BUSINESS_REVIEWS,
    reviews
})

const loadGoogleReviews = reviews => ({
    type: LOAD_GOOGLE_REVIEWS,
    reviews
});

const create_review = review => ({
    type: CREATE_REVIEW,
    review
});

const delete_review = reviewId => ({
    type: DELETE_REVIEW,
    reviewId
});

const update_review = review => ({
    type: UPDATE_REVIEW,
    review
});

export const getAllReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
        return reviews
    }
}

export const getRecentReviews = () => async dispatch => {
    const response = await fetch(`/api/reviews/recent`);

    if (response.ok) {
        const data = await response.json();
        const transformedData = {
            Reviews: data.reviews
        };
        dispatch(loadReviews(transformedData));
        return transformedData;
    }
}

export const getReviewById = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`)

    if (response.ok) {
        const review = await response.json();
        dispatch(loadById(review));
        return review;
    }
}

export const getReviewsByBusiness = (businessId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/business/${businessId}`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadBusinessReviews(reviews));
        return reviews;
    }
}

export const getPlaceReviews = (placeId) => async dispatch => {
    const mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);

    const map = new google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 },
        zoom: 2
    });

    const service = new google.maps.places.PlacesService(map);

    const getAllDetails = async () => {
        const request = {
            placeId: placeId,
            fields: ['reviews', 'rating', 'user_ratings_total'],
            language: 'en',
            reviewsSort: 'most_relevant'
        };

        const reviews = await new Promise((resolve) => {
            service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place.reviews || []);
                } else {
                    resolve([]);
                }
            });
        });

        return reviews;
    };

    const reviews = await getAllDetails();
    document.body.removeChild(mapDiv);

    const reviewsData = {
        GoogleReviews: reviews.reduce((acc, review, index) => {
            acc[index] = {
                id: index,
                businessId: placeId,
                message: review.text,
                stars: review.rating,
                author_name: review.author_name,
                createdAt: new Date(review.time * 1000).toISOString(),
                updatedAt: new Date(review.time * 1000).toISOString()
            };
            return acc;
        }, {})
    };

    dispatch(loadGoogleReviews(reviewsData));
    return reviewsData;
};

export const getAllPlaceReviews = (businessId) => async dispatch => {
    const stringId = String(businessId);

    // Get reviews from your database
    const dbReviews = await dispatch(getReviewsByBusiness(stringId));

    // Get reviews from Google Places API
    const googleReviews = await dispatch(getPlaceReviews(businessId));

    return {
        dbReviews,
        googleReviews
    };
};

export const createReview = (reviewData, businessId) => async dispatch => {
    const formattedData = {
        userId: reviewData.userId,
        message: reviewData.message,
        stars: reviewData.stars
    }

    const response = await csrfFetch(`/api/reviews/new/${businessId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
    });

    if (response.ok) {
        const newReview = await response.json();
        dispatch(create_review(newReview));
        return newReview;
    }
}

export const updateReview = (reviewId, reviewData) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: reviewData.userId,
            businessId: reviewData.businessId,
            message: reviewData.message,
            stars: reviewData.stars
        })
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(update_review(review));
        return review
    }
}

export const deleteReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    dispatch(delete_review(reviewId));
    return response;
}

const initialState = {
    Reviews: {},
    GoogleReviews: {}
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            newState.Reviews = {};
            const reviewsArray = action.reviews.Reviews;
            reviewsArray.forEach(review => {
                newState.Reviews[review.id] = {
                    ...review
                }
            });
            return newState;
        }
        case LOAD_BUSINESS_REVIEWS: {
            const newState = { ...state };
            newState.Reviews = {};
            // Normalize the reviews data
            Object.values(action.reviews.Reviews).forEach(review => {
                newState.Reviews[review.id] = review;
            });
            return newState;
        }
        case LOAD_GOOGLE_REVIEWS: {
            const newState = { ...state };
            newState.GoogleReviews = {};
            // Normalize the reviews data
            Object.values(action.reviews.GoogleReviews).forEach(review => {
                newState.GoogleReviews[review.id] = review;
            });
            return newState;
        }
        case CREATE_REVIEW: {
            const newState = { ...state };
            const reviewId = action.review.id || Object.keys(newState.Reviews || {}).length;
            newState.Reviews = {
                ...newState.Reviews,
                [reviewId]: action.review
            };
            return newState;
        }
        case UPDATE_REVIEW: {
            const newState = { ...state };
            if (!newState.Reviews) {
                newState.Reviews = {};
            }
            if (action.payload && action.payload.id) {
                newState.Reviews[action.payload.id] = action.payload;
            }
            return newState;
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState.Reviews[action.reviewId]
            return newState;
        }
        default:
            return state;
    }
}

export default reviewsReducer;