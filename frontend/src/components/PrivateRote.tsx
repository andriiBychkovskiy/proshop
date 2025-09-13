import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../store";

const PrivateRote = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRote;
