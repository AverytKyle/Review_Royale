import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews } from "../../redux/reviews";
import { getBusinessById, getPlaceById } from "../../redux/businessess";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import './ManageReviews.css';
import UpdateReview from "./UpdateReview";
import DeleteReview from "./DeleteReview";

const ManageReviews = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [, setShowModal] = useState(false);
    const [businessNames, setBusinessNames] = useState({});
    const [placeNames, setPlaceNames] = useState({});
    const reviews = useSelector(state => state.reviews.Reviews);

    useEffect(() => {
        dispatch(getAllReviews())
            .then(() => setIsLoading(false));
    }, [dispatch]);

    useEffect(() => {
        const loadBusinessNames = async () => {
            if (reviews) {
                for (const review of Object.values(reviews)) {
                    const businessInfo = review.businesses[0];

                    if (businessInfo.businessId) {
                        const business = await dispatch(getBusinessById(businessInfo.businessId));
                        setBusinessNames(prev => ({
                            ...prev,
                            [businessInfo.businessId]: business.name
                        }));
                    } else if (businessInfo.googleStoreId) {
                        const place = await dispatch(getPlaceById(businessInfo.googleStoreId));
                        setBusinessNames(prev => ({
                            ...prev,
                            [businessInfo.googleStoreId]: place.name
                        }));
                    }
                }
            }
        };

        loadBusinessNames();
    }, [reviews, dispatch]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
                    {i <= rating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="manage-reviews-container">
            <h1 className="manage-reviews-title">Manage your reviews</h1>
            <div className="manage-reviews-card-container">
                {Object.values((reviews))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((review, index) => {
                        const businessInfo = review.businesses[0];
                        const businessKey = businessInfo?.businessId || businessInfo?.googleStoreId;

                        return (
                            <div key={review.id} className="manage-reviews-card">
                                <div className="manage-reviews-details">
                                    <h2 className="manage-reviews-business-name">{businessNames[businessKey] || 'Loading...'}</h2>
                                    <p className="manage-reviews-created">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    <p className="manage-reviews-review-text">{review.message}</p>
                                    <p className="manage-reviews-stars">{renderStars(review.stars)}</p>
                                </div>
                                <div className="manage-reviews-button-container">
                                    <button className="manage-reviews-delete-button">
                                        <OpenModalMenuItem
                                            itemText="Update"
                                            onItemClick={() => setShowModal(true)}
                                            modalComponent={<UpdateReview reviewId={review.id} businessId={businessNames[businessKey]}/>}
                                        />
                                    </button>
                                    <button className="delete-button">
                                        <OpenModalMenuItem
                                            itemText="Delete"
                                            onItemClick={() => setShowModal(true)}
                                            modalComponent={<DeleteReview reviewId={review.id} />}
                                        />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );

}

export default ManageReviews;