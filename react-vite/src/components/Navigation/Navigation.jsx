import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CategoryModal from "./CategoryModal";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [categories, setCategories] = useState([]);

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

  const handleCategorySelect = (categoryId) => {

  };

  const handleSearch = () => {

  }

  return (
    <nav className="nav-bar-container">
      <div className="profile-section">
        <div className="nav-title">
          <h1>Review Royale</h1>
        </div>
        <div className="nav-search-container">
          <div className="nav-category-button">
            <OpenModalButton
              buttonText="Select Category ▼"
              modalComponent={
                <CategoryModal
                  categories={categories}
                  onSelect={handleCategorySelect}
                />
              }
            />
          </div>
          <input
            type="search"
            className="nav-search-bar"
            placeholder="Search for businesses"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {sessionUser ? (
          <div className="logged-in-container">
            <ProfileButton className="nav-profile-button" />
          </div>
        ) : (
          <div className="non-logged-buttons-container">
            <OpenModalButton
              buttonText="Log In"
              className="non-logged-button"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              className="non-logged-button"
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
