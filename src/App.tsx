import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import PredictionPage from './PredictionPage';

const App = () => {



    const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
   
   
  },
   {
        path: 'prediction/:asset',
          element:<PredictionPage/>,

      },  
]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
