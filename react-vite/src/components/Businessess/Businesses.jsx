import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinesses, getCurrentUserBusinesses } from "../../redux/businessess";

function Businesses() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const businesses = useSelector((state) => state.businesses.Businesses)
    
    useEffect(() => {
        dispatch(getCurrentUserBusinesses())
    }, [dispatch]);

}

export default Businesses;