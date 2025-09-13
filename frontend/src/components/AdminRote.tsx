import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../store";

const AdminRote = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  return userInfo && userInfo?.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRote;
