import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import { deleteBusiness, getCurrentUserBusinesses } from '../../redux/businessess';
import './DeleteBusiness.css';

const DeleteBusiness = ({ businessId }) => {
    const { closeModal } = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async () => {
        await dispatch(deleteBusiness(businessId))
            .then(() => {
                navigate(`/my-businesses`)
            });
        await dispatch(getCurrentUserBusinesses());
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='delete-business-container'>
            <h1 className='delete-business-title'>Confirm Delete</h1>
            <div className='delete-business-button-container'>
                <button className='delete-business-yes-button' onClick={handleClick}>Yes (Delete Business)</button>
                <button className='delete-business-no-button' onClick={handleCancel}>No (Cancel)</button>
            </div>
        </div>
        
    )
}

export default DeleteBusiness;
