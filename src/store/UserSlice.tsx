import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '@/type';

type UserState = {
    user: UserType | null;
}
const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            const {user} = action.payload;
            state.user = user;
        },
        logout: (state) => {
            state.user = null;
        },
    },
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;