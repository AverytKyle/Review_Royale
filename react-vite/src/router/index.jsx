import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Businesses from '../components/Businessess/Businesses';
import MapContainer from '../components/Maps';
import Layout from './Layout';

const API_KEY = 'AIzaSyAw7P1sr8XkoP4zrOwof9Hzl1uEDgXmLhk';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
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