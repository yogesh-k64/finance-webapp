import { useState } from "react";
import { useDispatch } from "react-redux";
import services, { type ApiResponse, type ApiError } from "../api/apiServices";
import { showSnackBar } from "../store/AppConfigReducer";
import type {
  CreateHandoutReq,
  Handout,
  HandoutResp,
} from "../utils/interface";
import { clearHandouts, setHandouts } from "../store/handoutsSlice";
import { storeRefreshHandouts } from "../store/RefreshReducer";
import { HandoutRespClass } from "../responseClass/HandoutResp";
import { CollectionClass } from "../responseClass/CollectionClass";

const useHandoutApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [handoutCollectionList, setHandoutCollectionList] = useState<CollectionClass[]>([]);
  const dispatch = useDispatch();

  const clearSelectedHandout = () => {
    dispatch(clearHandouts());
  };

  // Success callbacks
  const getHandoutsSuccessCallback = (
    response: ApiResponse<HandoutRespClass[]>
  ) => {
    const handoutsResp = response.data.map(
      (item) => new HandoutRespClass(item)
    );
    dispatch(setHandouts(handoutsResp));
    setLoading(false);
  };

  const getHandoutByIdSuccessCallback = (
    response: ApiResponse<HandoutResp>
  ) => {
    setLoading(false);
    console.log(
      "Handout fetched successfully:",
      response.message || "Handout retrieved"
    );
  };

  const getHandoutCollectionsSuccessCallback = (
    response: ApiResponse<CollectionClass[]>
  ) => {
    setLoading(false);
    if (response.data){
      const collectionData = response.data.map(item=>new CollectionClass(item))
      setHandoutCollectionList(collectionData)
    }
  };

  const createHandoutSuccessCallback = (response: ApiResponse<Handout>) => {
    setLoading(false);
    dispatch(storeRefreshHandouts(true));
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
  };

  const updateHandoutSuccessCallback = (response: ApiResponse<ApiResponse>) => {
    setLoading(false);
    dispatch(storeRefreshHandouts(true));
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
  };

  const deleteHandoutSuccessCallback = (response: ApiResponse<ApiResponse>) => {
    dispatch(storeRefreshHandouts(true));
    setLoading(false);
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
  };

  // Error callbacks
  const getHandoutsErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const getHandoutByIdErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const getHandoutCollectionsErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const createHandoutErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const updateHandoutErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const deleteHandoutErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  // API functions
  const getHandouts = () => {
    setLoading(true);
    services.GetRequest(
      "/handouts",
      getHandoutsSuccessCallback,
      getHandoutsErrorCallback
    );
  };

  const getHandoutById = (id: number) => {
    setLoading(true);
    services.GetRequest(
      `/handouts/${id}`,
      getHandoutByIdSuccessCallback,
      getHandoutByIdErrorCallback
    );
  };

  const getHandoutCollections = (id: number) => {
    setLoading(true);
    services.GetRequest(
      `/handouts/${id}/collections`,
      getHandoutCollectionsSuccessCallback,
      getHandoutCollectionsErrorCallback
    );
  };

  const createHandout = (handoutData: CreateHandoutReq) => {
    setLoading(true);
    services.PostRequest(
      "/handouts",
      handoutData,
      createHandoutSuccessCallback,
      createHandoutErrorCallback
    );
  };

  const updateHandout = (id: number, handoutData: CreateHandoutReq) => {
    setLoading(true);
    services.PutRequest(
      `/handouts/${id}`,
      handoutData,
      updateHandoutSuccessCallback,
      updateHandoutErrorCallback
    );
  };

  const deleteHandout = (id: number) => {
    setLoading(true);
    services.DeleteRequest(
      `/handouts/${id}`,
      deleteHandoutSuccessCallback,
      deleteHandoutErrorCallback
    );
  };

  return {
    loading,
    handoutCollectionList,

    getHandouts,
    getHandoutById,
    getHandoutCollections,
    createHandout,
    updateHandout,
    deleteHandout,
    clearSelectedHandout,
  };
};

export default useHandoutApi;
