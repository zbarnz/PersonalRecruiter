import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../entity";

interface UserState {
  user: User | null;
  loading: boolean;
  loggedIn: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: true,
  loggedIn: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError, setLoggedIn } = userSlice.actions;
export default userSlice.reducer;
