import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPlaceById, getBusinessById } from "../../redux/businessess";
import { getPlaceReviews, getReviewsByBusiness } from "../../redux/reviews";
import BusinessMap from "../Maps/BusinessMap";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import OpenModalButton from "../OpenModalButton";
import "./BusinessDetails.css";

function BusinessDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const business = useSelector((state) => state.businesses.Businesses)
    const reviews = useSelector((state) => state.reviews.Reviews)
    const googleReviews = useSelector(state => state.reviews.GoogleReviews);
    const [, setShowModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (businessId.length > 3) {
                    // Google Places API path
                    await dispatch(getPlaceById(businessId));
                    await dispatch(getPlaceReviews(businessId));
                } else {
                    const businessResponse = await dispatch(getBusinessById(businessId));
                    if (businessResponse) {
                        // Use the review_connections table relationship
                        await dispatch(getReviewsByBusiness(parseInt(businessId)));
                    }
                }
            } catch (error) {
                console.error("Error loading business data:", error);
            } finally {
                setIsLoading(false);
            }
        };


        if (window.google) {
            loadData();
        } else {
            const checkGoogleInterval = setInterval(() => {
                if (window.google) {
                    clearInterval(checkGoogleInterval);
                    loadData();
                }
            }, 100);

            return () => clearInterval(checkGoogleInterval);
        }
    }, [dispatch, businessId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }


    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="fas fa-star"></i>);
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
        }

        return stars;
    };

    const getCurrentDayHours = (hours) => {
        if (!hours) return null;

        const today = new Date();
        const dayOfWeek = today.getDay();
        const currentDayHours = hours[dayOfWeek];

        return currentDayHours?.time || 'Closed'; // Using optional chaining
    };


    const isBusinessOpen = () => {
        if (!business?.opening_hours) return <p>Hours unavailable</p>;
        return business.opening_hours.isOpen() ?
            <span className="status-open">Open</span> :
            <span className="status-closed">Closed</span>;
    };

    const handleReviewButtonClick = () => {
        navigate(`/businesses/${businessId}/reviews`)
    }

    return (
        <div className="business-details-container">
            {business && (
                <div className="business-details-header">
                    <div className="business-dtails-name">
                        <h1>{business.name}</h1>
                    </div>
                    <div className="business-details-ratings">
                        <div>{renderStars(business.rating)}</div>
                        <div><p>{business.rating}</p></div>
                        <p>({business.user_ratings_total} reviews)</p>
                    </div>
                    <div className="business-details-hours-website">
                        <div>{isBusinessOpen()} {getCurrentDayHours(business.hours)}</div>
                        <div>
                            <a className="business-details-website" href={business.website} target="_blank" rel="noopener noreferrer">
                                Visit Website
                            </a>
                        </div>
                    </div>
                </div>
            )}
            <div className="business-details-review-button-container">
                <OpenModalButton
                    buttonText="Post a Review"
                    onItemClick={() => setShowModal(true)}
                    modalComponent={<CreateReviewModal businessId={businessId} />}
                    className="business-details-review-button"
                />
            </div>

            {business && (
                <div className="business-details-info">
                    <div className="business-details-location">
                        <p>{business.formatted_address}</p>
                        <p>{business.formatted_phone_number}</p>
                        <BusinessMap business={business} />
                    </div>
                    <div className="business-details-hours">
                        {business.opening_hours?.weekday_text?.map((day, index) => (
                            <p key={index}>{day}</p>
                        ))}
                    </div>
                </div>
            )}
            {business && (
                <div className="business-details-reviews">
                    {reviews && Object.values(reviews).map((review, index) => (
                        <div key={index} className="business-details-review-item">
                            <div className="business-details-review-name">{review.author_name}</div>
                            <div className="business-details-review-stars">{renderStars(review.stars)}</div>
                            <div className="business-details-review-date">{new Date(review.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}</div>
                            <div className="business-details-review-message">{review.message}</div>
                        </div>
                    ))}
                    {/* <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div> */}
                </div>
            )}
        </div>
    );
}

export default BusinessDetails;
