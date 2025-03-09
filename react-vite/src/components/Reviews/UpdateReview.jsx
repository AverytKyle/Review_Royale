import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useModal } from '../../context/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { updateReview, getReviewById, getAllReviews } from '../../redux/reviews';
import { getBusinessById, getPlaceById } from '../../redux/businessess';

const UpdateReview = ({ reviewId, businessId }) => {
    const sessionUser = useSelector((state) => state.session.user);
    const reviewDetails = useSelector(state => state.reviews.Reviews[reviewId]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (reviewDetails) {
            setReview(reviewDetails.message);
            setStars(reviewDetails.stars);
        }
    }, [reviewDetails]);
    

    useEffect(() => {
        const loadData = async () => {
            if (businessId.length > 3) {
                await dispatch(getPlaceById(businessId));
            } else {
                await dispatch(getBusinessById(businessId));
            }
        }
        loadData();
    }, [dispatch, businessId])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const reviewData = {
            userId: sessionUser.id,
            businessId: businessId,
            message: review,
            stars: stars,
        }

        return dispatch(updateReview(reviewId, reviewData))
            .then(() => {
                closeModal();
                dispatch(getAllReviews());
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
            <h1 className='create-review-modal-title'>Update Review</h1>
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

export default UpdateReview;