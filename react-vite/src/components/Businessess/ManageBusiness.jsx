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
    const [, setShowModal] = useState(false);
    const [, setReviewsData] = useState({});

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
            <div className="manage-business-create-button-container">
                <button className="manage-business-create-button" onClick={() => navigate(`/businesses/new`)}>Create A New Business</button>
            </div>
        </div>

    )
}

export default ManageBusinesses;