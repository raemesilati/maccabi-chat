import React from "react";

import { Navigate, Route, RouteProps, useLocation } from "react-router-dom";
import { useUser } from "../contexts/userContext";

interface GuardedRouteProps {
  element: React.ReactElement;
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({
  element,
}: GuardedRouteProps) => {
  const location = useLocation();
  const { userContext, loading } = useUser();

  if (!userContext && !loading) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return element;
};

export default GuardedRoute;
