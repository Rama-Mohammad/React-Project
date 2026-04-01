import { createBrowserRouter } from "react-router-dom";
import Home from "../Tokenly/src/pages/Home";
import Explore from "../Tokenly/src/pages/Explore";
import Dashboard from "../Tokenly/src/pages/Dashboard";
import Profile from "../Tokenly/src/pages/Profile";


export const router = createBrowserRouter([

  {
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);