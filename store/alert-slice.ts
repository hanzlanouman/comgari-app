import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AlertSlice = {
    shown: boolean
    title: string,
    message: string,
}

const initialState: AlertSlice = {
    shown: false,
    title: "",
    message: "",
};

export const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        showAlert(state, action: PayloadAction<{
            title: string,
            message: string,
        }>) {
            state.shown = true;
            state.title = action.payload.title;
            state.message = action.payload.message;
        },
        hideAlert(state) {
            state.shown = false;
            state.title = "";
            state.message = "";
        }
    },
});

export const { hideAlert, showAlert } = alertSlice.actions;

