import { TUSER } from "@/repositories";
import { store } from "@/store";
import { updateUserProperty as UpdateUserProperty } from "@/store/auth-slice";

export const showAlertBox = (title: string, message: string) => {
    store.dispatch({
        type: "alert/showAlert",
        payload: { title, message },
    });
};

export const showErrorAlert = (message: string) => {
    showAlertBox("Error", message);
};

export const showSuccessAlert = (message: string) => {
    showAlertBox("Success", message);
};

export const updateUserProperty = (property: keyof TUSER, value: any) => {
    store.dispatch(UpdateUserProperty({ property, value }))
}
