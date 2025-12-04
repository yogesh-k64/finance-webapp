import { useState } from "react";
import { useDispatch } from "react-redux";
import services, { type ApiResponse, type ApiError } from "../api/apiServices";
import { showSnackBar } from "../store/AppConfigReducer";
import type { LinkUserReferralRequest, User, Handout } from "../utils/interface";
import { setUsers } from "../store/customerSlice";
import { UserClass } from "../responseClass/UserClass";
import { HandoutClass } from "../responseClass/HandoutClass";
import { isNonEmpty } from "../utils/utilsFunction";
import { storeRefreshUser } from "../store/RefreshReducer";

const useUserApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userHandouts, setUserHandouts] = useState<HandoutClass[]>([]);
  const [userReferredBy, setUserReferredBy] = useState<UserClass | null>(null);
  const dispatch = useDispatch();

  // Success callbacks
  const getUsersSuccessCallback = (response: ApiResponse<User[]>) => {
    const users = response.data;
    const userObjArr = users.map((user) => new UserClass(user));
    dispatch(setUsers(userObjArr));
    setLoading(false);
  };

  const getUserByIdSuccessCallback = () => {
    setLoading(false);
  };

  const getUserHandoutsSuccessCallback = (response: ApiResponse<Handout[]>) => {
    const handouts = response.data;
    const handoutObjArr = handouts.map((handout) => new HandoutClass(handout));
    setUserHandouts(handoutObjArr);
    setLoading(false);
  };

  const createUserSuccessCallback = (response: ApiResponse<User>) => {
    setLoading(false);
    dispatch(storeRefreshUser(true));
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
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
  };

  const deleteUserSuccessCallback = (response: ApiResponse<ApiResponse>) => {
    setLoading(false);
    dispatch(storeRefreshUser(true));
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
  };

  const linkReferralSuccessCallback = () => {
    setLoading(false);
    dispatch(storeRefreshUser(true));
  };

  const getUserReferredBySuccessCallback = (response: ApiResponse<User>) => {
    const user = response.data;
    setUserReferredBy(new UserClass(user));
    setLoading(false);
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
    setLoading(false);
  };

  const getUserByIdErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const getUserHandoutsErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setUserHandouts([]);
    setLoading(false);
  };

  const createUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const updateUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const deleteUserErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const linkReferralErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const getUserReferredByErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setUserReferredBy(null);
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
      linkReferralSuccessCallback,
      linkReferralErrorCallback
    );
  };

  const getUserReferredBy = (id: number) => {
    setLoading(true);
    services.GetRequest(
      `/users/${id}/referred-by`,
      getUserReferredBySuccessCallback,
      getUserReferredByErrorCallback
    );
  };

  return {
    loading,
    userHandouts,
    userReferredBy,

    // Actions
    getUsers,
    getUserById,
    getUserHandouts,
    getUserReferredBy,
    createUser,
    updateUser,
    deleteUser,
    linkUserReferral,
  };
};

export default useUserApi;
