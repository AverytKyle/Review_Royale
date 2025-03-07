import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import BusinessDetails from '../components/Businessess/BusinessDetails';
import MapContainer from '../components/Maps/MapContainer';
import LandingPage from '../components/LandingPage/LandingPage';
import CreateBusiness from '../components/Businessess/CreateBusiness';
import ManageBusinesses from '../components/Businessess/ManageBusiness';
import Layout from './Layout';

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
        path: "/my-businesses",
        element: <ManageBusinesses />,
      },
      {
        path: "/maps",
        element: <MapContainer />,
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