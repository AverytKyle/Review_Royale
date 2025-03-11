import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecentReviews } from "../../redux/reviews";
import './LandingPage.css'
import { getBusinessById, getPlaceById } from "../../redux/businessess";

function LandingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const recentReviews = useSelector(state => Object.values(state.reviews.Reviews));
    const [businessNames, setBusinessNames] = useState({});
    const [categories, setCategories] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const fetchedBusinesses = useRef(new Set());

    useEffect(() => {
        dispatch(getRecentReviews());
    }, [dispatch])

    useEffect(() => {
        const loadBusinessNames = async () => {
            if (!recentReviews) return;
            
            for (const review of Object.values(recentReviews)) {
                const businessInfo = review.businesses[0];
                const businessKey = businessInfo.businessId || businessInfo.googleStoreId;
                
                if (fetchedBusinesses.current.has(businessKey)) continue;
                
                fetchedBusinesses.current.add(businessKey);
                
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
        };
    
        loadBusinessNames();
    }, [dispatch, recentReviews]);    

    useEffect(() => {
        const loadUsernames = async () => {
            if (recentReviews) {
                for (const review of Object.values(recentReviews)) {
                    const response = await fetch(`/api/users/${review.userid}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setUsernames(prev => ({
                            ...prev,
                            [review.userid]: userData.username
                        }));
                    }
                }
            }
        };

        loadUsernames();
    }, [recentReviews]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const intervalId = setInterval(() => {
                setCurrentCategoryIndex((prevIndex) =>
                    prevIndex === categories.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [categories]);

    const handleCategoryClick = () => {
        navigate(`/categories/${categories[currentCategoryIndex].id}`);
    };

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

    return (
        <div className="landing-page-container">
            {categories.length > 0 && (
                <div className="landing-page-category-cycle">
                    <h2 className="landing-page-category-title">Featured Category</h2>
                    <div className="landing-page-category">
                        <button
                            className="landing-page-category-button"
                            onClick={handleCategoryClick}
                        >
                            {categories[currentCategoryIndex].category}
                        </button>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                </div>
            )}
            <div className="landing-page-recent-reviews-container">
                <h2>Recent Reviews</h2>
                <div className="landing-page-reviews-grid">
                    {Object.values((recentReviews)).map((review, index) => {
                        const businessInfo = review.businesses[0];
                        const businessKey = businessInfo?.businessId || businessInfo?.googleStoreId;

                        return (
                            <div key={index} className="landing-page-review-card">
                                <div className="landing-page-review-details">
                                    <div>
                                        <h2 className="landing-page-review-business-name">{businessNames[businessKey] || 'Loading...'}</h2>
                                    </div>
                                    <div>
                                        <p className="landing-page-review-username">{usernames[review.userid] || 'Loading...'}</p>
                                    </div>
                                    <div>
                                        <p className="landing-page-stars">{renderStars(review.stars)}</p>
                                    </div>
                                    <div>
                                        <p className="landing-page-review-message">{review.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default LandingPage;