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

const client = new ApolloClient({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
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
