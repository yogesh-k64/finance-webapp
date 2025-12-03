import { useState } from "react";
import { useDispatch } from "react-redux";
import services, { type ApiResponse, type ApiError } from "../api/apiServices";
import { showSnackBar } from "../store/AppConfigReducer";
import { storeRefreshCollections } from "../store/RefreshReducer";
import { CollectionClass } from "../responseClass/CollectionClass";
import { setCollections } from "../store/collectionSlice";

export interface CreateCollectionRequest {
  amount: number;
  date: string;
  handoutId: number;
}

const useCollectionApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Success callbacks
  const getCollectionsSuccessCallback = (
    response: ApiResponse<CollectionClass[]>
  ) => {
    setLoading(false);
    const collectionsResp = response.data.map(
      (item) => new CollectionClass(item)
    );
    dispatch(setCollections(collectionsResp));
  };

  const createCollectionSuccessCallback = (
    response: ApiResponse<CollectionClass>
  ) => {
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
    setLoading(false);
    dispatch(storeRefreshCollections(true));
  };

  const updateCollectionSuccessCallback = (
    response: ApiResponse<CollectionClass>
  ) => {
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
    setLoading(false);
    dispatch(storeRefreshCollections(true));
  };

  const deleteCollectionSuccessCallback = (response: ApiResponse<any>) => {
    setLoading(false);
    dispatch(storeRefreshCollections(true));
    dispatch(
      showSnackBar({
        message: response.message,
        status: "success",
      })
    );
  };

  // Error callbacks
  const getCollectionsErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const createCollectionErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const updateCollectionErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  const deleteCollectionErrorCallback = (error: ApiError) => {
    dispatch(
      showSnackBar({
        message: error.message,
        status: "error",
      })
    );
    setLoading(false);
  };

  // API functions
  const getCollections = () => {
    setLoading(true);
    services.GetRequest(
      "/collections",
      getCollectionsSuccessCallback,
      getCollectionsErrorCallback
    );
  };

  const createCollection = (collectionData: CreateCollectionRequest) => {
    setLoading(true);
    services.PostRequest(
      "/collections",
      collectionData,
      createCollectionSuccessCallback,
      createCollectionErrorCallback
    );
  };

  const updateCollection = (
    id: number,
    collectionData: CreateCollectionRequest
  ) => {
    setLoading(true);
    services.PutRequest(
      `/collections/${id}`,
      collectionData,
      updateCollectionSuccessCallback,
      updateCollectionErrorCallback
    );
  };

  const deleteCollection = (id: number) => {
    setLoading(true);
    services.DeleteRequest(
      `/collections/${id}`,
      deleteCollectionSuccessCallback,
      deleteCollectionErrorCallback
    );
  };

  return {
    loading,

    // Actions
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
  };
};

export default useCollectionApi;
