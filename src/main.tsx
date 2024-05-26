import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { CreateVoting } from "./components/CreateVoting/CreateVoting.tsx";
import { Votings } from "./components/Votings/Votings.tsx";
import { VotingDetail } from "./components/VotingDetail/VotingDetail.tsx";
import { MetaMaskContextProvider } from "./hooks/useMetaMask.tsx";
import { UserProvider } from "./hooks/userContext.tsx";
import { Register } from "./components/Register/Register.tsx";
import { ErrorPage } from "./components/ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-voting",
    element: <CreateVoting />,
  },
  {
    path: "/votings",
    element: <Votings />,
  },
  {
    path: '/votings/address/:address',
    element: <VotingDetail/>,
    
  },
  {
    path: '/register',
    element: <Register/>
  },
  
  {
    path: "*", // Catch undefined paths
    element: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
    <MetaMaskContextProvider>
  <UserProvider>
    <RouterProvider router={router} />
    </UserProvider>
  </MetaMaskContextProvider>
  </React.StrictMode>
  
);
