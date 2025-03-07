import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getCurrentUserBusinesses } from "../../redux/businessess";
import { getReviewsByBusiness } from "../../redux/reviews";

const ManageBusinesses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const businesses = useSelector((state) => state.businesses.Businesses)
    // const reviews = useSelector((state) => state.reviews.Reviews);

    useEffect(() => {
        const loadBusinessData = async () => {
            const businessData = await dispatch(getCurrentUserBusinesses());
            // Wait for businesses to load then fetch reviews
            if (businessData) {
                Object.values(businessData).forEach(business => {
                    dispatch(getReviewsByBusiness(business.id));
                });
            }
        };
        loadBusinessData();
    }, [dispatch]);


    // const getBusinessReviews = (businessId) => {
    //     const business = businesses[businessId];
    //     return business?.reviews || [];
    // };

    // const calculateAverageRating = (businessId) => {
    //     const business = businesses[businessId];
    //     const reviewConnections = business?.reviews || [];
        
    //     const reviewsData = reviewConnections.map(connection => {
    //         // Access the stars directly from the connection if that's where it lives
    //         return connection;
    //     });
        
    //     if (!reviewsData.length) return 0;
        
    //     const sum = reviewsData.reduce((acc, review) => acc + review.stars, 0);
    //     return (sum / reviewsData.length).toFixed(1);
    // };
    

    // const renderStars = (rating) => {
    //     const stars = [];
    //     const roundedRating = Math.round(rating);
    //     for (let i = 1; i <= 5; i++) {
    //         stars.push(
    //             <span key={i} className={i <= roundedRating ? "filled-star" : "empty-star"}>
    //                 ★
    //             </span>
    //         );
    //     }
    //     return stars;
    // };

    if (!businesses) return <div>Loading...</div>;

    return (
        <div className="manage-business-container">
            <div className="manage-business-title">
                <h2>Manage your businesses</h2>
            </div>
            <div className="manage-business-card-container">
                {Object.values(businesses).map((business, index) => (
                    <div key={index} className="manage-business-card" onClick={(e) => {
                        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                            navigate(`/businesses/${business.id}`)
                        }
                    }}>
                        <div className="manage-business-details">
                            <div className="manage-business-name">
                                <h3>{business.name}</h3>
                            </div>
                            {/* <div className="manage-business-rating">
                                <div className="manage-business-stars">{renderStars(calculateAverageRating(business.id) || 0)}</div>
                                <div className="manage-business-rating-value">{calculateAverageRating(business.id)} ({business.reviews?.length || 0} reviews)</div>
                            </div> */}
                            <div className="manage-business-address-container">
                                <div className="manage-business-address">
                                    <p>{business.addressLineOne}</p>
                                    <p>{business.addressLineTwo}</p>
                                </div>
                                <div className="manage-business-state-container">
                                    <p>{business.city}</p>
                                    <p>{business.state}</p>
                                    <p>{business.zip}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    )
}

export default ManageBusinesses;