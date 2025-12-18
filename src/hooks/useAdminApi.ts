import { useState } from "react";
import { useDispatch } from "react-redux";
import services, { type ApiResponse, type ApiError } from "../api/apiServices";
import { showSnackBar } from "../store/AppConfigReducer";
import { AdminUserClass } from "../responseClass/AdminUserClass";

interface RegisterUserReq {
  username: string;
  password: string;
  role: string;
}

interface UpdateUserReq {
  username?: string;
  password?: string;
  role?: string;
  active?: boolean;
}

interface RegisterResponse {
  id: number;
  username: string;
  role: string;
}

const useAdminApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<AdminUserClass[]>([]);
  const dispatch = useDispatch();

  // Success callbacks
  const getUsersSuccessCallback = (response: ApiResponse<any[]>) => {
    const adminUsers = response.data.map(user => new AdminUserClass(user));
    setUsers(adminUsers);
    setLoading(false);
  };

  const createUserSuccessCallback = (response: ApiResponse<RegisterResponse>) => {
    setLoading(false);
    dispatch(
      showSnackBar({
        message: response.message || "User registered successfully!",
        status: "success",
      })
    );
    // Refresh users list after creation
    getUsers();
  };

  const updateUserSuccessCallback = (response: ApiResponse<RegisterResponse>) => {
    setLoading(false);
    dispatch(
      showSnackBar({
        message: response.message || "User updated successfully!",
        status: "success",
      })
    );
    // Refresh users list after update
    getUsers();
  };

  const deleteUserSuccessCallback = (response: ApiResponse<any>) => {
    setLoading(false);
    dispatch(
      showSnackBar({
        message: response.message || "User deleted successfully!",
        status: "success",
      })
    );
    // Refresh users list after deletion
    getUsers();
  };

  // Error callbacks
  const getUsersErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message || "Failed to fetch users.",
        status: "error",
      })
    );
    setLoading(false);
  };

  const createUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message || "Failed to register user.",
        status: "error",
      })
    );
    setLoading(false);
  };

  const updateUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message || "Failed to update user.",
        status: "error",
      })
    );
    setLoading(false);
  };

  const deleteUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message || "Failed to delete user.",
        status: "error",
      })
    );
    setLoading(false);
  };

  // API functions
  const getUsers = () => {
    setLoading(true);
    services.GetRequest(
      "/users",
      getUsersSuccessCallback,
      getUsersErrorCallback
    );
  };

  const createUser = (userData: RegisterUserReq) => {
    setLoading(true);
    services.PostRequest(
      "/user/register",
      userData,
      createUserSuccessCallback,
      createUserErrorCallback
    );
  };

  const updateUser = (id: number, userData: UpdateUserReq) => {
    setLoading(true);
    services.PutRequest(
      `/users/${id}`,
      userData,
      updateUserSuccessCallback,
      updateUserErrorCallback
    );
  };

  const deleteUser = (id: number) => {
    setLoading(true);
    services.DeleteRequest(
      `/users/${id}`,
      deleteUserSuccessCallback,
      deleteUserErrorCallback
    );
  };

  return {
    loading,
    users,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useAdminApi;
