import { useState } from "react";
import { useDispatch } from "react-redux";
import services, { type ApiResponse, type ApiError } from "../api/apiServices";
import { showSnackBar } from '../store/AppConfigReducer';
import type { CreateHandoutRequest, Handout, HandoutResp, UpdateHandoutRequest } from "../utils/interface";




const useHandoutApi = () => {
  const [handoutList, setHandoutList] = useState<Handout[]>([]);
  const [selectedHandout, setSelectedHandout] = useState<HandoutResp | null>(
    null
  );
  const [handoutCollections, setHandoutCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const clearSelectedHandout = () => {
    setSelectedHandout(null);
  };

  // Success callbacks
  const getHandoutsSuccessCallback = (response: ApiResponse<Handout[]>) => {
    setHandoutList(response.data);
    setLoading(false);
    console.log(
      "Handouts fetched successfully:",
      response.message || "Success"
    );
  };

  const getHandoutByIdSuccessCallback = (
    response: ApiResponse<HandoutResp>
  ) => {
    setSelectedHandout(response.data);
    setLoading(false);
    console.log(
      "Handout fetched successfully:",
      response.message || "Handout retrieved"
    );
  };

  const getHandoutCollectionsSuccessCallback = (
    response: ApiResponse<any[]>
  ) => {
    setHandoutCollections(response.data);
    setLoading(false);
    console.log(
      "Handout collections fetched successfully:",
      response.message || "Collections retrieved"
    );
  };

  const createHandoutSuccessCallback = (response: ApiResponse<Handout>) => {
    if (response.data) {
      setHandoutList((prev) => [...prev, response.data]);
    }
    setLoading(false);
    console.log(
      "Handout created successfully:",
      response.message || "Handout created"
    );
  };

  const updateHandoutSuccessCallback = (response: ApiResponse<Handout>) => {
    setHandoutList((prev) =>
      prev.map((handout) =>
        handout.id === response.data.id ? { ...handout, ...response.data } : handout
      )
    );

    setLoading(false);
    console.log(
      "Handout updated successfully:",
      response.message || "Handout updated"
    );
  };

  const deleteHandoutSuccessCallback = (response: ApiResponse<any>, handoutId: number) => {
    setHandoutList((prev) => prev.filter((handout) => handout.id !== handoutId));

    if (selectedHandout && selectedHandout.handout.id === handoutId) {
      setSelectedHandout(null);
    }

    setLoading(false);
    console.log(
      "Handout deleted successfully:",
      response.message || "Handout deleted"
    );
  };

  // Error callbacks
  const getHandoutsErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error("API Error:", error);
    setLoading(false);
  };

  const getHandoutByIdErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error("API Error:", error);
    setLoading(false);
  };

  const getHandoutCollectionsErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error("API Error:", error);
    setLoading(false);
  };

  const createHandoutErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error("API Error:", error);
    setLoading(false);
  };

  const updateHandoutErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error("API Error:", error);
    setLoading(false);
  };

  const deleteHandoutErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error("API Error:", error);
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

  const createHandout = (handoutData: CreateHandoutRequest) => {
    setLoading(true);
    services.PostRequest(
      "/handouts",
      handoutData,
      createHandoutSuccessCallback,
      createHandoutErrorCallback
    );
  };

  const updateHandout = (id: number, handoutData: UpdateHandoutRequest) => {
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
      (response) => deleteHandoutSuccessCallback(response, id),
      deleteHandoutErrorCallback
    );
  };

  return {
    // State
    handoutList,
    selectedHandout,
    handoutCollections,
    loading,

    // Actions
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
