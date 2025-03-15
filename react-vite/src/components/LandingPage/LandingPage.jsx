import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecentReviews } from "../../redux/reviews";
import './LandingPage.css'
import { getBusinessById, getPlaceById } from "../../redux/businessess";

function LandingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const recentReviews = useSelector(state => state.reviews.Reviews || []);
    // const businesses = useSelector(state => state.businesses.Businesses);
    const [businessNames, setBusinessNames] = useState({});
    const [categories, setCategories] = useState({});
    const [usernames, setUsernames] = useState({});
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const fetchedBusinesses = useRef(new Set());

    const categoryImages = {
        "Restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Food": "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Hotel": "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Delivery": "https://plus.unsplash.com/premium_photo-1682088887477-4f63f185ba7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    };

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

    const handleViewAllBusinesses = () => {
        navigate('/businesses/all');
    };

    return (
        <div className="landing-page-container">
            {categories.length > 0 && (
                <div
                    className="landing-page-category-cycle"
                    style={{
                        backgroundImage: `url(${categoryImages[categories[currentCategoryIndex].category]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div className="category-content-overlay">
                        <h2 className="landing-page-category-title">Featured Categories</h2>
                        <div className="landing-page-category">
                            <button
                                className="landing-page-category-button"
                            // onClick={handleCategoryClick}
                            >
                                {categories[currentCategoryIndex].category}
                            </button>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                </div>
            )}
            <div className="landing-page-recent-reviews-container">
                <h2 className="landing-page-recent-reviews-title">Recent Reviews</h2>
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
                <div className="landing-page-businesses-button-container">
                    <button
                        className="view-all-businesses-button"
                        onClick={handleViewAllBusinesses}
                    >
                        View All Businesses
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;