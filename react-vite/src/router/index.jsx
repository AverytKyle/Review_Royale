import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import BusinessDetails from '../components/Businessess/BusinessDetails';
// import MapContainer from '../components/Maps/MapContainer';
import LandingPage from '../components/LandingPage/LandingPage';
import CreateBusiness from '../components/Businessess/CreateBusiness';
import ManageBusinesses from '../components/Businessess/ManageBusiness';
import UpdateBusiness from '../components/Businessess/UpdateBusiness';
import ManageReviews from '../components/Reviews/ManageReviews';
import Layout from './Layout';
import AllBusinesses from '../components/Businessess/AllBusinesses';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/businesses/:businessId",
        element: <BusinessDetails />,
      },
      {
        path: "/businesses/new",
        element: <CreateBusiness />,
      },
      {
        path: "/businesses/all",
        element: <AllBusinesses />,
      },
      {
        path: "/my-businesses",
        element: <ManageBusinesses />,
      },
      {
        path: "/businesses/:businessId/edit",
        element: <UpdateBusiness />,
      },
      {
        path: "/my-reviews",
        element: <ManageReviews />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);