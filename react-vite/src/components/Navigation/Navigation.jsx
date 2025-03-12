/* global google */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getKey } from "../../redux/maps";
import { useDispatch, useSelector } from "react-redux";
// import { Loader } from '@googlemaps/js-api-loader';
import OpenModalButton from "../OpenModalButton";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CategoryModal from "./CategoryModal";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const mapsApiKey = useSelector(state => state.maps.key);
  const sessionUser = useSelector((state) => state.session.user);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getKey());
  }, [dispatch]);

  useEffect(() => {
    const handleDocumentClick = () => {
      setShowSuggestions(false);
    };

    // Add click listener to entire document
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const loadMapsApi = async () => {
      const response = await fetch('/api/maps/key');
      const data = await response.json();
      dispatch({ type: 'maps/LOAD_API_KEY', payload: data.googleMapsAPIKey });
    };
    loadMapsApi();
  }, [dispatch]);

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

  const handleSearchInput = async (value) => {
    setSearchTerm(value);

    if (value.length >= 2) {
      // Get local database results
      const response = await fetch(`/api/businesses/search?term=${value}&location=${locationTerm}`);
      const localResults = await response.json();

      // Get Google Places results
      const { AutocompleteService } = await google.maps.importLibrary("places");
      const service = new AutocompleteService();

      const request = {
        input: value,
        componentRestrictions: { country: 'us' },
        types: ['establishment']
      };

      if (locationTerm) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: locationTerm }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;
            request.location = location;
            request.radius = 40234; // ~25 miles in meters

            service.getPlacePredictions(request, (predictions, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                const combinedResults = [
                  ...(localResults?.businesses || []).map(business => ({
                    ...business,
                    isLocal: true,
                    structured_formatting: {
                      main_text: business.name,
                      secondary_text: `${business.addressLineOne}, ${business.city}, ${business.state}`
                    }
                  })),
                  ...predictions.map(pred => ({ ...pred, isGoogle: true }))
                ];
                setSuggestions(combinedResults.slice(0, 8));
                setShowSuggestions(true);
              }
            });
          }
        });
      } else {
        service.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const combinedResults = [
              ...(localResults?.businesses || []).map(business => ({
                ...business,
                isLocal: true,
                structured_formatting: {
                  main_text: business.name,
                  secondary_text: `${business.addressLineOne}, ${business.city}, ${business.state}`
                }
              })),
              ...predictions.map(pred => ({ ...pred, isGoogle: true }))
            ];
            setSuggestions(combinedResults.slice(0, 8));
            setShowSuggestions(true);
          }
        });
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (place) => {
    const { Place } = await google.maps.importLibrary("places");

    const initialPlace = new Place({
      id: place.place_id,
      requestedLanguage: "en",
    });

    const fields = await initialPlace.fetchFields({
      fields: ["displayName", "formattedAddress", "location", "id", "websiteURI"]
    });

    // Ensure we have a valid ID before navigation
    const businessId = fields.Eg?.id || place.place_id;

    navigate(`/businesses/${businessId}`, {
      state: {
        businessDetails: {
          id: businessId,
          name: fields.Eg?.displayName,
          address: fields.Eg?.formattedAddress,
          website: fields.Eg?.websiteURI,
        }
      }
    });

    setShowSuggestions(false);
  };

  return (
    <nav className="nav-bar-container">
      <div className="profile-section">
        <div className="nav-title">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Review Royale</h1>
        </div>
        <div className="nav-search-container">
          {/* <div className="nav-category-button">
            <OpenModalButton
              buttonText="Select Category ▼"
              modalComponent={
                <CategoryModal
                  categories={categories}
                // onSelect={handleCategorySelect}
                />
              }
            />
          </div> */}
          <div className="search-input-container" style={{ position: 'relative' }}>
            <input
              type="search"
              className="nav-search-bar"
              placeholder="Search for businesses"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
            {/* <input
              type="search"
              className="nav-location-bar"
              placeholder="Location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            /> */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 1000
                }}>
                {suggestions.map((result) => (
                  <div
                    key={result.isLocal ? result.id : result.place_id}
                    className="suggestion-item"
                    onClick={() => result.isLocal ?
                      navigate(`/businesses/${result.id}`) :
                      handleSuggestionClick(result)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div className="suggestion-main-text">
                      {result.structured_formatting.main_text}
                    </div>
                    <div className="suggestion-secondary-text">
                      {result.structured_formatting.secondary_text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
