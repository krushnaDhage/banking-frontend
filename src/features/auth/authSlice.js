import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            const { token, userId, email, role } = action.payload;

            state.token = token;
            state.userId = userId;
            state.email = email;
            state.role = role;

            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);
        },

        logout: (state) => {
            state.token = null;
            state.userId = null;
            state.email = null;
            state.role = null;

            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;