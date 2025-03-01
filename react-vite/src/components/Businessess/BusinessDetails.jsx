import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessById, getPlaceById } from "../../redux/businessess";

function BusinessDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const business = useSelector((state) => state.businesses.Businesses)
    const [placeDetails, setPlaceDetails] = useState(null);
    
    useEffect(() => {
        dispatch(getPlaceById(businessId))
    }, [dispatch, businessId])

    return (
        <div className="business-details-container">
            {placeDetails && (
                <div className="place-info">
                    <h1>{placeDetails.displayName}</h1>
                    <p>{placeDetails.formattedAddress}</p>
                    <div className="ratings">
                        <span>Rating: {placeDetails.rating}</span>
                        <span>Reviews: {placeDetails.userRatingCount}</span>
                    </div>
                    {placeDetails.websiteURI && (
                        <a href={placeDetails.websiteURI} target="_blank" rel="noopener noreferrer">
                            Visit Website
                        </a>
                    )}
                    {placeDetails.hasDelivery && <p>Delivery Available</p>}
                </div>
            )}
            {/* Your existing business details rendering here */}
        </div>
    );
}

export default BusinessDetails;
