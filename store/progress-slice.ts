import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProgressSlice = {
    shown: boolean
    title: string,
    progress: number,
    description?: string,
}

const initialState: ProgressSlice = {
    shown: false,
    title: "",
    progress: 100,
};

export const progressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        showProgress(state, action: PayloadAction<{
            title: string,
            progress: number,
            description?: string,
        }>) {
            state.shown = true;
            state.title = action.payload.title;
            state.progress = action.payload.progress;
            state.description = action.payload.description;
        },
        hideProgress(state) {
            state.shown = false;
            state.title = "";
            state.progress = 100;
            state.description = "";
        }
    },
});

export const { hideProgress, showProgress } = progressSlice.actions;

