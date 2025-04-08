import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPlaceById, getBusinessById } from "../../redux/businessess";
import { getReviewsByBusiness, getAllPlaceReviews, resetReviews } from "../../redux/reviews";
import BusinessMap from "../Maps/BusinessMap";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import OpenModalButton from "../OpenModalButton";
import "./BusinessDetails.css";

function BusinessDetails() {
    const dispatch = useDispatch();
    const { businessId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const business = useSelector((state) => state.businesses.Businesses)
    const reviews = useSelector((state) => state.reviews.Reviews)
    const googleReviews = useSelector(state => state.reviews.GoogleReviews);
    const [, setShowModal] = useState(false);
    const [reviewUsers, setReviewUsers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;
    
    const [photoUrls, setPhotoUrls] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const combinedReviews = [
        ...(reviews ? Object.values(reviews).map(review => ({
            ...review,
            authorName: reviewUsers[review.userid]?.firstName || 'Loading...',
            isGoogleReview: false
        })) : []),
        ...(googleReviews ? Object.values(googleReviews).map(review => ({
            ...review,
            authorName: review.author_name,
            isGoogleReview: true
        })) : [])
    ];

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = combinedReviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(combinedReviews.length / reviewsPerPage);

    // Function to cycle to the next photo
    const nextPhoto = useCallback(() => {
        if (photoUrls.length > 1) {
            setCurrentPhotoIndex((prevIndex) => 
                prevIndex === photoUrls.length - 1 ? 0 : prevIndex + 1
            );
        }
    }, [photoUrls.length]);

    // Function to cycle to the previous photo
    // const prevPhoto = useCallback(() => {
    //     if (photoUrls.length > 1) {
    //         setCurrentPhotoIndex((prevIndex) => 
    //             prevIndex === 0 ? photoUrls.length - 1 : prevIndex - 1
    //         );
    //     }
    // }, [photoUrls.length]);

    // Auto-cycle photos every 5 seconds
    useEffect(() => {
        if (photoUrls.length > 1) {
            const interval = setInterval(nextPhoto, 10000);
            return () => clearInterval(interval);
        }
    }, [photoUrls.length, nextPhoto]);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (businessId.length > 3) {
                    // Google Places API path
                    const placeData = await dispatch(getPlaceById(businessId));
                    await dispatch(getAllPlaceReviews(businessId));

                    // Get all photo URLs if available
                    if (placeData && placeData.photos && placeData.photos.length > 0) {
                        const urls = placeData.photos.map(photo => 
                            photo.getUrl({ maxWidth: 1200, maxHeight: 400 })
                        );
                        setPhotoUrls(urls);
                    }
                } else {
                    const businessResponse = await dispatch(getBusinessById(businessId));
                    if (businessResponse) {
                        // Use the review_connections table relationship
                        await dispatch(resetReviews());
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

    useEffect(() => {
        if (reviews) {
            Object.values(reviews).forEach(async (review) => {
                const response = await fetch(`/api/auth/users/${review.userid}`);
                if (response.ok) {
                    const userData = await response.json();
                    setReviewUsers(prev => ({ ...prev, [review.userid]: userData }));
                }
            });
        }
    }, [reviews]);

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

        return currentDayHours?.time || 'Closed';
    };

    const isBusinessOpen = () => {
        if (!business?.opening_hours) return <p>Hours unavailable</p>;

        // Get current time in local timezone
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinutes;

        // Parse business hours for today
        const today = now.getDay();
        const todayHours = business.opening_hours.periods[today];

        if (business.opening_hours.periods.length === 1) {
            return <span className="status-open">Open</span>;
        } else if (todayHours.close) {
            const openTime = parseInt(todayHours.open.time.slice(0, 2)) * 60 +
                parseInt(todayHours.open.time.slice(2));
            const closeTime = parseInt(todayHours.close.time.slice(0, 2)) * 60 +
                parseInt(todayHours.close.time.slice(2));

            const isOpen = currentTime >= openTime && currentTime < closeTime;

            return isOpen ?
                <span className="status-open">Open</span> :
                <span className="status-closed">Closed</span>;
        }

        return <p>Hours unavailable</p>;
    };

    const Pagination = () => {
        return (
            <div className="pagination-controls">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    const ratingLogic = () => {
        let dbReviews = [];
        let totalReviews = 0;
        let averageRating = 0;
    
        if (Object.keys(googleReviews).length > 0) {
            if (reviews) {
                dbReviews = Object.values(reviews);
                totalReviews = (business.user_ratings_total || 0) + dbReviews.length;
            } else {
                totalReviews = business.user_ratings_total || 0;
            }
            
            averageRating = business.rating || 0;
        } else {
            if (Object.keys(reviews).length > 0) {
                dbReviews = Object.values(reviews);
                totalReviews = dbReviews.length;
    
                const totalStars = dbReviews.reduce((sum, review) => {
                    const rating = review.stars;
                    return sum + rating;
                }, 0);
    
                averageRating = parseFloat((totalStars / totalReviews).toFixed(1));
            }
        }
    
        return {
            totalReviews: totalReviews,
            averageRating: parseFloat(averageRating)
        };
    };
    
    return (
        <div className="business-details-container">
            {business && (
                <div 
                    className="business-details-header"
                    style={photoUrls.length > 0 ? {
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${photoUrls[currentPhotoIndex]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'white'
                    } : {}}
                >
                    <div className="business-dtails-name">
                        <h1>{business.name}</h1>
                    </div>
                    <div className="business-details-ratings">
                        <div className="business-details-star-container">{renderStars(ratingLogic().averageRating)}</div>
                        <div><p>{ratingLogic().averageRating}</p></div>
                        <p>({ratingLogic().totalReviews} reviews)</p>
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
                    {currentReviews.map((review, index) => (
                        <div key={index} className="business-details-review-item">
                            <div className="business-details-review-name">
                                {review.authorName}
                            </div>
                            <div className="business-details-review-stars">
                                {renderStars(review.stars)}
                            </div>
                            <div className="business-details-review-date">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="business-details-review-message">
                                {review.message}
                            </div>
                        </div>
                    ))}
                    <Pagination />
                </div>
            )}
        </div>
    );
}

export default BusinessDetails;
