import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface INotification {
  id: string;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationsState {
  queue: INotification[];
}

const initialState: NotificationsState = {
  queue: []
};

const notificationsSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotification>) => {
      const notification = {
        ...action.payload,
        id: action.payload.id
      };
      state.queue.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((n) => n.id !== action.payload);
    }
  }
});

export const { addNotification, removeNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
