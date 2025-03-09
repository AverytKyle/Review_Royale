import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBusinessById, updateBusiness } from "../../redux/businessess";
import "./CreateBusiness.css";

const UpdateBusiness = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.session.user.id)
    const { businessId } = useParams();
    const business = useSelector(state => state.businesses.Businesses)
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [website, setWebsite] = useState("");
    const [addressLineOne, setAddressLineOne] = useState("");
    const [addressLineTwo, setAddressLineTwo] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [, setErrors] = useState([]);

    useEffect(() => {
        dispatch(getBusinessById(businessId))
    }, [dispatch, businessId]);

    useEffect(() => {
        if (business) {
            setName(business.name || "");
            setPhoneNumber(business.phoneNumber || "");
            setWebsite(business.website || "");
            setAddressLineOne(business.addressLineOne || "");
            setAddressLineTwo(business.addressLineTwo || "");
            setCity(business.city || "");
            setState(business.state || "");
            setZip(business.zip || "");
        }
    }, [business])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const businessData = {
            name: name,
            phoneNumber: phoneNumber,
            website: website,
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            city: city,
            state: state,
            zip: zip
        }

        return dispatch(updateBusiness(businessId, businessData))
            .then(() => navigate(`/businesses/${businessId}`))
    }

    if (!business) {
        return <div>Loading...</div>;
    }

    return (
        <div className="create-business-container">
            <form className="create-business-form" onSubmit={handleSubmit}>
                <div>
                    <h1 className="create-business-title">Update {business.name}</h1>
                </div>
                <div className="create-business-input-container">
                    <input className="create-business-name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name your business"
                        required
                    />
                </div>
                <div className="create-business-phone-website">
                    <div className="create-business-input-container">
                        <input className="create-business-phone-input"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone number"
                            required
                        />
                    </div>
                    <div className="create-business-input-container">
                        <input className="create-business-website-input"
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="Website"
                            required
                        />
                    </div>
                </div>
                <div className="create-business-input-container">
                    <input className="create-business-address1-input"
                        type="text"
                        value={addressLineOne}
                        onChange={(e) => setAddressLineOne(e.target.value)}
                        placeholder="Address"
                        required
                    />
                </div>
                <div className="create-business-input-container">
                    <input className="create-business-address2-input"
                        type="text"
                        value={addressLineTwo}
                        onChange={(e) => setAddressLineTwo(e.target.value)}
                        placeholder="Address cont."
                    />
                </div>
                <div className="create-business-location">
                    <div className="create-business-input-container">
                        <input className="create-business-city-input"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            required
                        />
                    </div>
                    <div className="create-business-input-container">
                        <input className="create-business-state-input"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                            required
                        />
                    </div>
                    <div className="create-business-input-container">
                        <input className="create-business-zip-input"
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="Zip"
                            required
                        />
                    </div>
                </div>
                <div className="create-business-button-container">
                    <button
                        type="submit"
                        className="create-business-button"
                    // disabled={!isFormValid()}
                    // style={{
                    //     opacity: isFormValid() ? 1 : 0.5,
                    //     cursor: isFormValid() ? 'pointer' : 'not-allowed'
                    // }}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateBusiness;