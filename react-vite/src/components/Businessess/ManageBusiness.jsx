import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getCurrentUserBusinesses } from "../../redux/businessess";
import { getReviewsByBusiness } from "../../redux/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteBusiness from "./DeleteBusiness";
import './ManageBusiness.css';

const ManageBusinesses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const businesses = useSelector((state) => state.businesses.Businesses)
    const [reviewsData, setReviewsData] = useState({});

    useEffect(() => {
        const loadData = async () => {
            const businessData = await dispatch(getCurrentUserBusinesses());
            if (businessData) {
                const reviews = await Promise.all(
                    Object.values(businessData).map(business =>
                        dispatch(getReviewsByBusiness(business.id))
                    )
                );
                setReviewsData(reviews[0].Reviews);
            }
        };
        loadData();
    }, [dispatch]);

    // const calculateAverageRating = (businessId) => {
    //     const business = businesses[businessId];
    //     const reviewConnections = business?.reviews || [];
        
    //     console.log("Business reviews for debugging:", business.reviews);
    //     // This will show us exactly what review data we have access to through the business object
        
    //     if (!reviewConnections.length) return 0;
        
    //     const sum = reviewConnections.reduce((acc, connection) => {
    //         // Let's see what each connection contains
    //         console.log("Review connection:", connection);
    //         return acc + connection.stars;
    //     }, 0);
        
    //     return (sum / reviewConnections.length).toFixed(1);
    // };
    

    // // console.log("reviewData:", reviewsData)

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
                                    <p>{business.city},</p>
                                    <p>{business.state}</p>
                                    <p>{business.zip}</p>
                                </div>
                            </div>
                            <div className="manage-business-button-container">
                            <button className="manage-business-update" onClick={() => navigate(`/businesses/${business.id}/edit`)}>Update</button>
                                <button className="manage-business-delete">
                                    <OpenModalMenuItem
                                        itemText="Delete"
                                        onItemClick={() => setShowModal(true)}
                                        modalComponent={<DeleteBusiness businessId={business.id} />}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    )
}

export default ManageBusinesses;