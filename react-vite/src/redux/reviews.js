import { csrfFetch } from "./csrf";

const LOAD = 'reviews/LOAD';
const LOAD_BUSINESS_REVIEWS = 'reviews/LOAD_BUSINESS_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';

const loadReviews = reviews => ({
    type: LOAD,
    reviews
});

const loadBusinessReviews = reviews => ({
    type: LOAD_BUSINESS_REVIEWS,
    reviews
})

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

export const getReviewsByBusiness = (businessId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/businesses/${businessId}`);
    
        if (response.ok) {
            const reviews = await response.json();
            dispatch(loadBusinessReviews(reviews));
            return reviews
        }
}

export const createReview = (reviewData) => async dispatch => {
    const formattedData = {
        userId: reviewData.userId,
        businessId: reviewData.businessId,
        message: reviewData.message,
        stars: reviewData.stars
    }

    const response = await csrfFetch(`/api/reviews/businesses/${businessId}`, {
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
    Reviews: {}
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
            const reviewsArray = action.reviews.Reviews;
            reviewsArray.forEach(review => {
                newState.Reviews[review.id] = {
                    ...review
                }
            });
            return newState;
        }
        case CREATE_REVIEW: {
            const newState = { ...state };
            newState.Reviews[action.payload.id] = action.payload;
            return newState
        }
        case UPDATE_REVIEW: {
            const newState = { ...state };
            newState.Reviews[action.payload.id] = action.payload;
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