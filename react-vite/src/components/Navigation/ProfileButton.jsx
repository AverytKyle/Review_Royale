import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoPersonOutline } from "react-icons/io5";
import { thunkLogout } from "../../redux/session";
import { NavLink } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { getCurrentUserBusinesses } from "../../redux/businessess";
import './ProfileButton.css';

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  const handleManageBus = () => {
    dispatch(getCurrentUserBusinesses());
    closeMenu();
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className="profile-button">
        <IoPersonOutline />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div>
            <div className="user-info">
              <p>{user.firstName} {user.lastName}</p>
            </div>
            <div className="manage-businesses">
              <NavLink to={"/my-businesses"} onClick={handleManageBus}>Manage Businesses</NavLink>
            </div>
            <div>
              <button className="profile-logout" onClick={logout}>Log Out</button>
            </div>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
