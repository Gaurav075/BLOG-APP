import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: false,
  userData: null,
  mode: "dark",
  userMetaData: null,
  allPosts:null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state,action)=>{
        state.status=true;
        state.userData=action.payload;
      },
      logout: (state)=>{
        state.status=false;
        state.userData=null;
        state.userMetaData=null;
      },
      setMode: (state,action)=>{
        state.mode=action.payload;
      },
      setMetaData: (state,action)=>{
        state.userMetaData=action.payload;
        state.status=true;
      },
      setAllPosts: (state,action)=>{
        state.allPosts=action.payload;
      }
    },
  })

  export const {login ,logout, setMode, setMetaData, setAllPosts} = authSlice.actions;

  export default authSlice.reducer