import { createSlice } from "@reduxjs/toolkit";

interface State {
	isOpen: boolean;
}

const initialState: State = {
	isOpen: false,
};

const slice = createSlice({
	name: "category",
	initialState,
	reducers: {
		openedModal: (state) => {
			state.isOpen = true;
		},
		closedModal: (state) => {
			state.isOpen = false;
		},
	},
});

export default slice.reducer;
export const { openedModal, closedModal } = slice.actions;
