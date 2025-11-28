import { useState } from 'react';
import { useDispatch } from 'react-redux';
import services, { type ApiResponse, type ApiError } from '../api/apiServices';
import { showSnackBar } from '../store/AppConfigReducer';

// Define Collection interface (matching Go backend)
interface Collection {
  id: number;
  amount: number;
  date: string;
  handoutId?: number;
  created_at: string;
  updated_at: string;
}

interface CreateCollectionRequest {
  amount: number;
  date: string;
  handoutId?: number;
}

interface UpdateCollectionRequest {
  amount?: number;
  date?: string;
  handoutId?: number;
}

interface UseCollectionApiReturn {
  // State
  collectionList: Collection[];
  loading: boolean;
  
  // Actions
  getCollections: () => void;
  createCollection: (collectionData: CreateCollectionRequest) => void;
  updateCollection: (id: number, collectionData: UpdateCollectionRequest) => void;
  deleteCollection: (id: number) => void;
}

const useCollectionApi = (): UseCollectionApiReturn => {
  const [collectionList, setCollectionList] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Success callbacks
  const getCollectionsSuccessCallback = (response: ApiResponse<Collection[]>) => {
    setCollectionList(response.data);
    setLoading(false);
    console.log('Collections fetched successfully:', response.message || 'Success');
  };

  const createCollectionSuccessCallback = (response: ApiResponse<Collection>) => {
    if (response.data) {
      setCollectionList(prev => [...prev, response.data]);
    }
    setLoading(false);
    console.log('Collection created successfully:', response.message || 'Collection created');
  };

  const updateCollectionSuccessCallback = (response: ApiResponse<Collection>) => {
    setCollectionList(prev => 
      prev.map(collection => 
        collection.id === response.data.id ? { ...collection, ...response.data } : collection
      )
    );
    
    setLoading(false);
    console.log('Collection updated successfully:', response.message || 'Collection updated');
  };

  const deleteCollectionSuccessCallback = (response: ApiResponse<any>, collectionId: number) => {
    setCollectionList(prev => prev.filter(collection => collection.id !== collectionId));
    
    setLoading(false);
    console.log('Collection deleted successfully:', response.message || 'Collection deleted');
  };

  // Error callbacks
  const getCollectionsErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error('API Error:', error);
    setLoading(false);
  };

  const createCollectionErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error('API Error:', error);
    setLoading(false);
  };

  const updateCollectionErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error('API Error:', error);
    setLoading(false);
  };

  const deleteCollectionErrorCallback = (error: ApiError) => {
    dispatch(showSnackBar({
      message: error.message,
      status: "error"
    }));
    console.error('API Error:', error);
    setLoading(false);
  };

  // API functions
  const getCollections = () => {
    setLoading(true);
    services.GetRequest('/collections', getCollectionsSuccessCallback, getCollectionsErrorCallback);
  };

  const createCollection = (collectionData: CreateCollectionRequest) => {
    setLoading(true);
    services.PostRequest('/collections', collectionData, createCollectionSuccessCallback, createCollectionErrorCallback);
  };

  const updateCollection = (id: number, collectionData: UpdateCollectionRequest) => {
    setLoading(true);
    services.PutRequest(`/collections/${id}`, collectionData, updateCollectionSuccessCallback, updateCollectionErrorCallback);
  };

  const deleteCollection = (id: number) => {
    setLoading(true);
    services.DeleteRequest(`/collections/${id}`, (response) => deleteCollectionSuccessCallback(response, id), deleteCollectionErrorCallback);
  };

  return {
    // State
    collectionList,
    loading,
    
    // Actions
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
  };
};

export default useCollectionApi;
export type { Collection, CreateCollectionRequest, UpdateCollectionRequest, UseCollectionApiReturn };