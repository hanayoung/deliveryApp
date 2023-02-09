import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money:0,

};
const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken; // 실제로 서버에 보내는 토큰(유효기간을 두고 씀)
      // 토큰 연장 하려고 할 때, 서버에 refreshToken을 보냄, 대개 유효기간이 더 김
      //action.payload.email 이므로 사용할 때는 객체이므로 email:res.data.data.email이지만, 
      //action.payload인 경우는 값(res.data.data.email)만 보내주면 됨
    },
    setEmail(state,action){
      state.email=action.payload;
    },
    setName(state,action){
      state.name=action.payload;
    },
    setMoney(state,action){
      state.money=action.payload;
    },
    setAccessToken(state,action){
      state.accessToken=action.payload;
    }
  },
  extraReducers: builder => {},
});

export default user;