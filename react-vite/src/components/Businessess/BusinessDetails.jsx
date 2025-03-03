import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPlaceById } from "../../redux/businessess";
import { getPlaceReviews } from "../../redux/reviews";
import BusinessMap from "../Maps/BusinessMap";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import OpenModalButton from "../OpenModalButton";
import "./BusinessDetails.css";

function BusinessDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 10;
    const { businessId } = useParams();
    const business = useSelector((state) => state.businesses.Businesses)
    const reviews = useSelector((state) => state.reviews.Reviews)
    const [showModal, setShowModal] = useState(false);


    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = Object.values(reviews || {}).slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(Object.values(reviews || {}).length / reviewsPerPage);

    useEffect(() => {
        console.log("Business ID being used:", businessId);
        dispatch(getPlaceById(businessId))
        dispatch(getPlaceReviews(businessId))
    }, [dispatch, businessId])

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

    // const getCurrentDayHours = () => {
    //     if (!business.opening_hours?.periods) return "Hours not available";

    //     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //     const today = new Date().getDay();
    //     const currentDayPeriod = business.opening_hours.periods.find(period => period.open.day === today);

    //     if (!currentDayPeriod) return "Closed";

    //     const openTime = currentDayPeriod.open.time;
    //     const closeTime = currentDayPeriod.close.time;

    //     // Format time from 24hr to 12hr format
    //     const formatTime = (time) => {
    //         const hour = parseInt(time.slice(0, 2));
    //         const minutes = time.slice(2);
    //         const ampm = hour >= 12 ? 'PM' : 'AM';
    //         const formattedHour = hour % 12 || 12;
    //         return `${formattedHour}:${minutes} ${ampm}`;
    //     };

    //     return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
    // };

    const getCurrentDayHours = (hours) => {
        if (!hours) return null;

        const today = new Date();
        const dayOfWeek = today.getDay();
        const currentDayHours = hours[dayOfWeek];

        return currentDayHours?.time || 'Closed'; // Using optional chaining
    };


    const isBusinessOpen = () => {
        if (!business.opening_hours) return null;
        return business.opening_hours.open_now ?
            <span className="status-open">Open</span> :
            <span className="status-closed">Closed</span>;
    };

    useEffect(() => {
        if (business && business.place_id) {
            const service = new window.google.maps.places.PlacesService(document.createElement('div'));

            service.getDetails({
                placeId: business.place_id,
                fields: ['opening_hours']
            }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setIsOpen(place.opening_hours?.isOpen());
                }
            });
        }
    }, [business]);

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
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BusinessDetails;
