import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
// Import other reducers...

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
