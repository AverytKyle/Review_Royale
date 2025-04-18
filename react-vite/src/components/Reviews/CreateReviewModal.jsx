import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useModal } from '../../context/Modal';
import { getPlaceById } from "../../redux/businessess";
import { getAllPlaceReviews, createReview, getReviewsByBusiness } from "../../redux/reviews";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './CreateReviewModal.css'

function CreateReviewModal({ businessId }) {
    const sessionUser = useSelector((state) => state.session.user);
    const business = useSelector(state => state.businesses.Businesses);
    const reviews = useSelector(state => state.reviews.Reviews);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getReviewsByBusiness(businessId));
    }, [dispatch, businessId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Check if the user is the owner of the spot
        if (business.userId === sessionUser.id) {
            // Prevent the form from being submitted
            return;
        }

        const hasReviewed = Object.values(reviews).some(review => review.userid === sessionUser.id);
    
        if (business.userId === sessionUser.id || hasReviewed) {
            setErrors({ review: "You cannot review this business" });
            return;
        }

        const reviewData = {
            userId: sessionUser.id,
            message: review,
            stars: stars,
        }

        return dispatch(createReview(reviewData, businessId))
            .then(() => {
                closeModal();
                dispatch(getPlaceById(businessId));
                dispatch(getAllPlaceReviews(businessId));
            })
    };

    const handleStarMouseEnter = (star) => {
        setHoveredStar(star);
    };

    const handleStarMouseLeave = () => {
        setHoveredStar(0);
    };

    const handleStarClick = (star) => {
        setStars(star);
    };

    const modalHeight = errors.review ? '350px' : '300px';

    return (
        <div className='create-review-modal-container' style={{ height: modalHeight }}>
            <h1 className='create-review-modal-title'>Create a Review!</h1>
            <form className='create-review-modal-form'>
                {errors.review && <p className="errors" style={{ color: 'red', margin: '5px 0' }}>{errors.review}</p>}
                <label>
                    <textarea
                        className='modal-textarea'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Leave your review here...'
                    />
                </label>
                <div className='modal-stars'>
                    {[1, 2, 3, 4, 5].map((star, index) => (
                        <FontAwesomeIcon
                            key={index}
                            icon={star <= stars || star <= hoveredStar ? faStarSolid : faStarRegular}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarMouseEnter(star)}
                            onMouseLeave={handleStarMouseLeave}
                            className={(star <= stars || star <= hoveredStar) ? 'star-hover' : ''}
                            required
                        />
                    ))}
                </div>
                <button className='create-review-modal-submit-button' type="submit" disabled={review.length < 10 || stars === 0} onClick={handleSubmit}>Submit Your Review</button>
            </form>
        </div>
    );
}

export default CreateReviewModal;