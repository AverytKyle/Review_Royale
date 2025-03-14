import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllBusinesses } from "../../redux/businessess";

const AllBusinesses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const businesses = useSelector((state) => state.businesses.Businesses)

    useEffect(() => {
        dispatch(getAllBusinesses())
    }, [dispatch])

    if (!businesses) return <div>Loading...</div>;

    return (
        <div>
            <div className="manage-business-title">
                <h2>All Businesses</h2>
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
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default AllBusinesses;