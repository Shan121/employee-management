import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import AuthRoute from "./components/Routes/AuthRoute.tsx";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import EmployeeProfile from "./pages/EmployeeProfile.tsx";
import { API_URL } from "./lib/api.ts";
import AdminRoute from "./components/Routes/AdminRoute.tsx";
import Profile from "./pages/Profile.tsx";

const client = new ApolloClient({
  uri: `${API_URL}/graphql`,
  cache: new InMemoryCache(),
  credentials: "include",
});

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    element: <AuthRoute />,
    children: [
      {
        path: "/profile",
        element: (
          <Layout>
            <Profile />
          </Layout>
        ),
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/",
        element: (
          <Layout>
            <Home />
          </Layout>
        ),
      },
      {
        path: "/employee/:id",
        element: (
          <Layout>
            <EmployeeProfile />
          </Layout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
      <Toaster />
    </ApolloProvider>
  </StrictMode>
);
