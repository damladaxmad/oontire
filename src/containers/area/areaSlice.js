import { createSlice } from '@reduxjs/toolkit';

export const areaSlice = createSlice({
  name: 'areas',
  initialState: {
    areas: [],
    isAreasDataFetched: false
  },
  reducers: {
    setAreas: (state, action) => {
      state.areas = action.payload;
    },
    addArea: (state, action) => {
      state.areas.push(action.payload);
    },
    deleteArea: (state, action) => {
      state.areas = state.areas.filter(area => area._id !== action.payload._id);
    },
    updateArea: (state, action) => {
      const { _id, updatedArea } = action.payload;
      const index = state.areas.findIndex(area => area._id === _id);
      if (index !== -1) {
        state.areas[index] = { ...state.areas[index], ...updatedArea };
      }
    },
    setAreaDataFetched: (state, action) => {
      state.isAreasDataFetched = action.payload;
    },
    logoutAreas: state => {
      state.areas = [];
      state.isAreasDataFetched = false;
    },
  },
});

export const { setAreas, addArea, deleteArea, updateArea, setAreaDataFetched, logoutAreas } = areaSlice.actions;

export default areaSlice.reducer;
