import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import './LandingPage.css'

function LandingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            }
        };

        const fetchReviews = async () => {
            const response = await fetch('/api/reviews/recent');
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews);
            }
        };


        fetchCategories();
        fetchReviews();
    }, []);

    console.log("Reviews", reviews)

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
            <div className="landing-page-recent-reviews">
                <h2>Recent Reviews</h2>
                <div className="landing-page-reviews-grid">
                    {reviews.map(review => (
                        <div key={review.id} className="landing-page-review-card">
                            <h3>{review.title}</h3>
                            <p>{review.content}</p>
                            <div className="landing-page-review-rating">Rating: {review.rating}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LandingPage;