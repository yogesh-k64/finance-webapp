import { useState } from "react";
import { useDispatch } from "react-redux";
import services, { type ApiResponse, type ApiError } from "../api/apiServices";
import { showSnackBar } from "../store/AppConfigReducer";
import type { LinkUserReferralRequest, User } from "../utils/interface";
import { setUsers } from "../store/customerSlice";
import { UserClass } from "../responseClass/UserClass";
import { isNonEmpty } from "../utils/utilsFunction";
import { storeRefreshUser } from "../store/RefreshReducer";

const useUserApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Success callbacks
  const getUsersSuccessCallback = (response: ApiResponse<User[]>) => {
    const users = response.data;
    const userObjArr = users.map((user) => new UserClass(user));
    dispatch(setUsers(userObjArr));
    setLoading(false);
  };

  const getUserByIdSuccessCallback = (response: ApiResponse<User>) => {
    setLoading(false);
    console.log("User fetched successfully:", response.message || "User retrieved");
  };

  const getUserHandoutsSuccessCallback = (response: ApiResponse<any[]>) => {
    setLoading(false);
    console.log(
      "User handouts fetched successfully:",
      response.message || "Handouts retrieved"
    );
  };

  const createUserSuccessCallback = (response: ApiResponse<User>) => {
    setLoading(false);
    dispatch(storeRefreshUser(true));
    console.log("User created successfully:", response.message || "User created");
  };

  const updateUserSuccessCallback = (response: ApiResponse<User>) => {
    setLoading(false);
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
    dispatch(storeRefreshUser(true));
    console.log("User updated successfully:", response.message || "User updated");
  };

  const deleteUserSuccessCallback = (response: ApiResponse<any>) => {
    setLoading(false);
    dispatch(storeRefreshUser(true));
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
    console.log("User deleted successfully:", response.message || "User deleted");
  };

  const linkReferralSuccessCallback = (
    response: ApiResponse<any>,
    userId: number
  ) => {
    setLoading(false);
    console.log(
      "User referral linked successfully:",
      response.message || "Referral linked"
    );
    getUserById(userId);
  };

  // Error callbacks
  const getUsersErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    dispatch(setUsers([]));
    console.error("API Error:", error);
    setLoading(false);
  };

  const getUserByIdErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    console.error("API Error:", error);
    setLoading(false);
  };

  const getUserHandoutsErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    console.error("API Error:", error);
    setLoading(false);
  };

  const createUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    console.error("API Error:", error);
    setLoading(false);
  };

  const updateUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    console.error("API Error:", error);
    setLoading(false);
  };

  const deleteUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    console.error("API Error:", error);
    setLoading(false);
  };

  const linkReferralErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    console.error("API Error:", error);
    setLoading(false);
  };

  // API functions
  const getUsers = () => {
    setLoading(true);
    console.log("Fetching users...");
    services.GetRequest(
      "/users",
      getUsersSuccessCallback,
      getUsersErrorCallback
    );
  };

  const getUserById = (id: number) => {
    setLoading(true);
    services.GetRequest(
      `/users/${id}`,
      getUserByIdSuccessCallback,
      getUserByIdErrorCallback
    );
  };

  const getUserHandouts = (id: number) => {
    setLoading(true);
    services.GetRequest(
      `/users/${id}/handouts`,
      getUserHandoutsSuccessCallback,
      getUserHandoutsErrorCallback
    );
  };

  const createUser = (userData: UserClass, referredBy?: string) => {
    const reqObj = {
      name: userData.getName(),
      address: userData.getAddress(),
      info: userData.getInfo(),
      mobile: userData.getMobile(),
      ...(isNonEmpty(referredBy) ? { referredBy: Number(referredBy) } : {}),
    };
    setLoading(true);
    services.PostRequest(
      "/users",
      reqObj,
      createUserSuccessCallback,
      createUserErrorCallback
    );
  };

  const updateUser = (id: number, userData: UserClass) => {
    const reqObj = {
      name: userData.getName(),
      address: userData.getAddress(),
      info: userData.getInfo(),
      mobile: userData.getMobile(),
    };
    setLoading(true);
    services.PutRequest(
      `/users/${id}`,
      reqObj,
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

  const linkUserReferral = (
    id: number,
    referralData: LinkUserReferralRequest
  ) => {
    setLoading(true);
    services.PostRequest(
      `/users/${id}/referral`,
      referralData,
      (response) => linkReferralSuccessCallback(response, id),
      linkReferralErrorCallback
    );
  };

  return {
    loading,

    // Actions
    getUsers,
    getUserById,
    getUserHandouts,
    createUser,
    updateUser,
    deleteUser,
    linkUserReferral,
  };
};

export default useUserApi;
