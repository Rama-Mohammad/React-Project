import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Explore from '../pages/Explore';
import Dashboard from '../pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'explore',
        element: <Explore />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);
