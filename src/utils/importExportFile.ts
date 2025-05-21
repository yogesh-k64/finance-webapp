import type { AppDispatch, RootState } from "../store/store";
import { loadHandouts, type HandoutsState } from "../store/handoutsSlice";
import { loadCollection, type collectionState } from "../store/collectionSlice";

export const exportToJson = (state: RootState) => {
    const reduxData = {
        data: state,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reduxData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fund_details_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const importFromJson = (file: File, dispatch: AppDispatch): Promise<void> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const jsonData = JSON.parse(result);

                if (!jsonData.data) {
                    throw new Error('Invalid file format');
                }

                const handsOutsData = jsonData?.data?.handouts as HandoutsState
                if (handsOutsData) {
                    dispatch(loadHandouts(handsOutsData));
                }
                const collectionData = jsonData?.data?.collection as collectionState
                if (collectionData) {
                    dispatch(loadCollection(collectionData));
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};