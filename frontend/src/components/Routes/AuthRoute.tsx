import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_EMPLOYEE } from "@/graphql/queries/employee.query";

const AuthRoute = () => {
  const { loading, data } = useQuery(GET_AUTHENTICATED_EMPLOYEE, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (loading === false && !data?.authenticatedEmployee) {
      console.log("NOT AUTHENTICATED");
      navigate("/login", { replace: true });
    }
    console.log("AUTHENTICATED");
  }, [loading, data, navigate]);

  return <Outlet />;
};

export default AuthRoute;
