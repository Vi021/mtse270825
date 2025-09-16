import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import LoginPage from './pages/login.jsx';
import HomePage from './pages/home.jsx';
import ProductPage from './pages/product.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // so that App (with Header + context consumer) never unmounts
        //  & auth state doesn’t reset when changing pages
        children: [
          {
            index: true,
            element: <HomePage />
            },
            {   
                path: "/products",
                element: <ProductPage />,
            }
        ]
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

        <AuthWrapper>
            <RouterProvider router={router} />
        </AuthWrapper>

);
