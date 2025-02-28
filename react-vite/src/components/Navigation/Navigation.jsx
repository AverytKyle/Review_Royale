import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getKey } from "../../redux/maps";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from '@googlemaps/js-api-loader';
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
  const mapsApiKey = useSelector(state => state.maps.key);
  const sessionUser = useSelector((state) => state.session.user);
  const [categories, setCategories] = useState([]);
  const suggestionsRef = useRef(null);

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
    if (!mapsApiKey) return;

    const loader = new Loader({
      apiKey: mapsApiKey,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load();
  }, [mapsApiKey]);

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
      const { PlacesService } = await google.maps.importLibrary("places");
      const service = new PlacesService(document.createElement('div'));

      if (locationTerm) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: locationTerm }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;

            service.textSearch({
              query: value,
              location: location,
              radius: 40234
            }, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                setSuggestions(results.slice(0, 5));
                setShowSuggestions(true);
              }
            });
          }
        });
      } else {
        // Default to current location or general search if no location specified
        service.textSearch({
          query: value
        }, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(results.slice(0, 5));
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
    const { PlacesService } = await google.maps.importLibrary("places");
    const service = new PlacesService(document.createElement('div'));

    service.getDetails({
      placeId: place.place_id,
      fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'email']
    }, (placeDetails, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        navigate('/search', {
          state: {
            results: [{
              id: place.place_id,
              name: placeDetails.name,
              address: placeDetails.formatted_address,
              phone: placeDetails.formatted_phone_number,
              website: placeDetails.website,
              email: placeDetails.email
            }],
            searchTerm: placeDetails.name
          }
        });
      }
    });

    setShowSuggestions(false);
  };

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
                // onSelect={handleCategorySelect}
                />
              }
            />
          </div>
          <div className="search-input-container" style={{ position: 'relative' }}>
            <input
              type="search"
              className="nav-search-bar"
              placeholder="Search for businesses"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
            <input
              type="search"
              className="nav-location-bar"
              placeholder="Location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
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
                {suggestions.map((place) => (
                  <div
                    key={place.place_id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(place)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div>{place.name}</div>
                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                      {place.formatted_address}
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
