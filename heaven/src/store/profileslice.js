import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  userProfile: null, // Assuming userProfile is an object containing user profile data
};

// Actions
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Action to set the user profile
    setProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    // Action to update the user profile
    updateProfile: (state, action) => {
      // Assuming action.payload contains the updated profile data
      Object.assign(state.userProfile, action.payload);
    },

    // Optional: Action to reset the user profile state
    resetProfile: () => initialState,
  },
});

// Exports
export const { setProfile, updateProfile, resetProfile } = profileSlice.actions;

// Reducer
export default profileSlice.reducer;