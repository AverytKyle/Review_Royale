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
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const [, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getKey());
  }, [dispatch]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      const isOutsideSearchContainer = !e.target.closest('.search-input-container');
      const isOutsideLocationContainer = !e.target.closest('.location-input-container');

      if (isOutsideSearchContainer) {
        setShowSuggestions(false);
      }

      if (isOutsideLocationContainer) {
        setShowLocationSuggestions(false);
      }
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

  const handleLocationInput = (value) => {
    // Directly update the state with the input value
    setLocationTerm(value);

    if (value.length >= 2) {
      // Only attempt to fetch suggestions if we have enough characters
      fetchLocationSuggestions(value);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const fetchLocationSuggestions = async (value) => {
    try {
      const { AutocompleteService } = await google.maps.importLibrary("places");
      const service = new AutocompleteService();

      service.getPlacePredictions({
        input: value,
        componentRestrictions: { country: 'us' },
        types: ['(cities)']
      }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setLocationSuggestions(predictions);
          setShowLocationSuggestions(true);
        } else {
          setLocationSuggestions([]);
          setShowLocationSuggestions(false);
        }
      });
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSuggestionClick = (suggestion) => {
    setLocationTerm(suggestion.description);
    setShowLocationSuggestions(false);
  };

  const handleSearchInput = async (value) => {
    setSearchTerm(value);

    if (value.length >= 2) {
      try {
        // Get local database results
        const response = await fetch(`/api/businesses/search?term=${value}&location=${locationTerm}`);
        const localResults = await response.json();

        // Get Google Places results
        const { AutocompleteService } = await google.maps.importLibrary("places");
        const service = new AutocompleteService();

        let request = {
          input: value,
          componentRestrictions: { country: 'us' },
          types: ['establishment']
        };

        // If we have a location, include it in the search query
        if (locationTerm && locationTerm.trim() !== '') {
          // Combine business search term with location for better results
          request = {
            ...request,
            input: `${value} ${locationTerm}`
          };
        }

        service.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
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
          } else {
            // If no Google results, still show local results
            const localOnlyResults = (localResults?.businesses || []).map(business => ({
              ...business,
              isLocal: true,
              structured_formatting: {
                main_text: business.name,
                secondary_text: `${business.addressLineOne}, ${business.city}, ${business.state}`
              }
            }));
            setSuggestions(localOnlyResults.slice(0, 8));
            setShowSuggestions(localOnlyResults.length > 0);
          }
        });
      } catch (error) {
        console.error("Error in business search:", error);
        setSuggestions([]);
        setShowSuggestions(false);
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
          <div className="search-input-container" style={{ position: 'relative' }}>
            <input
              type="search"
              className="nav-search-bar"
              placeholder="Search for businesses"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
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
                {suggestions.map((result) => (
                  <div
                    key={result.isLocal ? result.id : result.place_id}
                    className="suggestion-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      result.isLocal ?
                        navigate(`/businesses/${result.id}`) :
                        handleSuggestionClick(result);
                    }}
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
            <div className="location-input-container" style={{ position: 'relative' }}>
              <input
                type="search"
                className="nav-location-bar"
                placeholder="Near (city, state, zip)"
                value={locationTerm}
                onChange={(e) => handleLocationInput(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (locationSuggestions.length > 0) setShowLocationSuggestions(true);
                }}
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="location-search-suggestions"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 15,
                    right: -10,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 1000
                  }}>
                  {locationSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="suggestion-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSuggestionClick(suggestion);
                      }}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div className="suggestion-main-text">
                        {suggestion.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
