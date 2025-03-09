import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview, getAllReviews } from '../../redux/reviews';

const DeleteReview = ({ reviewId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleclick = () => {
        dispatch(deleteReview(reviewId))
        .then(() => {
            dispatch(getAllReviews());
            closeModal();
        });
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='delete-review-container'>
            <h1 className='delete-review-title'>Confirm Delete</h1>
            <p className='delete-review--confirmation'>Are you sure you want to remove this review?</p>
            <div className='delete-review-button-container'>
                <button className='delete-review-yes-button' onClick={handleclick}>Yes (Delete Review)</button>
                <button className='delete-review-no-button' onClick={handleCancel}>No (Keep Review)</button>
            </div>
        </div>
    );
}

export default DeleteReview;