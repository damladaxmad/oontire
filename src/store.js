// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './SignupAndLogin/loginSlice';
import customerSlice from './containers/customer/customerSlice';
import transactionSlice from './containers/transaction/transactionSlice';
import userSlice from './containers/user/userSlice';
import areaSlice from "./containers/area/areaSlice"
import zoneSlice from './containers/zone/zoneSlice';

const store = configureStore({
  reducer: {
    login: loginSlice,
    customers: customerSlice,
    users: userSlice,
    transactions: transactionSlice,
    areas: areaSlice,
    zones: zoneSlice
  },
});

export default store;
