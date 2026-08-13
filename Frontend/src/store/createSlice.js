import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
   
  },
})

export const { setUser } = AuthSlice.actions
export default AuthSlice.reducer
