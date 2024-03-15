import { createSlice } from '@reduxjs/toolkit';

export const zoneSlice = createSlice({
  name: 'zones',
  initialState: {
    zones: [],
    isZonesDataFetched: false
  },
  reducers: {
    setZones: (state, action) => {
      state.zones = action.payload;
    },
    addZone: (state, action) => {
      state.zones.push(action.payload);
    },
    deleteZone: (state, action) => {
      state.zones = state.zones.filter(zone => zone._id !== action.payload._id);
    },
    updateZone: (state, action) => {
      const { _id, updatedZone } = action.payload;
      const index = state.zones.findIndex(zone => zone._id === _id);
      if (index !== -1) {
        state.zones[index] = { ...state.zones[index], ...updatedZone };
      }
    },
    setZoneDataFetched: (state, action) => {
      state.isZonesDataFetched = action.payload;
    },
    logoutZones: state => {
      state.zones = [];
      state.isZonesDataFetched = false;
    },
  },
});

export const { setZones, addZone, deleteZone, updateZone, setZoneDataFetched, logoutZones } = zoneSlice.actions;

export default zoneSlice.reducer;
