import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogin: false,
    activeUser: "",
    business: "",
    token: "",
    mySocketId: ""
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
    setBusiness: (state, action) => {
      console.log(action.payload)
      state.business = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSocketId: (state, action) => {
      state.mySocketId = action.payload;
    },
    logout: (state, action) => {
      return {
        isLogin: false,
        activeUser: "",
        token: "",
        mySocketId: ""
      }; 
    },
  },
});

export const { setIsLogin, setActiveUser, setBusiness, setToken, setSocketId, logout } = loginSlice.actions;

export default loginSlice.reducer;
