import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Alert, View } from 'react-native';
import { useSelector } from 'react-redux';
import {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import { useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import { useAppDispatch } from './src/store';
import order from './src/slices/order';
import user from './src/slices/user';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};


export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
}; // 다른 페이지에서도 계속해서 가져다 쓸 거기 때문에 export


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
    const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
    const [socket,disconnect]=useSocket();
    const dispatch=useAppDispatch();
    
    useEffect(()=>{
      axios.interceptors.response.use(
        response=>response,
        async error=>{
          const {
            config,
            response:{status}
          }=error; //error.config 가 원래 요청
          if(status===419){
            if(error.response.data.code=="expired"){
              const originalRequest=config;
              const refreshToken=await EncryptedStorage.getItem('refreshToken');
              const {data}=await axios.post(
                `${Config.API_URL}/refreshToken`,
                         {},
                         {
                           headers: {
                             Authorization: `Bearer ${refreshToken}`,
                           },
                         },
              )
              dispatch(user.actions.setAccessToken(data.data.accessToken));
              originalRequest.headers.authorization=`Bearer ${data.data.accessToken}`;
              return axios(originalRequest);
            }
          }
          return Promise.reject(error);
        }
      ) //axios.interceptors.request.use() 를 활용하여 axios에서 accessToken 넣어주는 것도 가능함
    },[])
    // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (err:unknown) {
        console.error(err);
        const errorResponse=(err as AxiosError).response
        if (errorResponse?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      }
      finally{
        //TODO :스플래쉬스크린
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  //dispatch는 불변적인 값으로 넣으나 안 넣으나 똑같은 결과로 빈 배열과 동일한 효과이나, eslint때문에 넣음

    //웹소켓은 아닌데 socket.io는 키, 값 꼴로 옴
    //'userInfo',{name:"ayoung",birth:"2000"}
    
    useEffect(() => {
      const callback = (data: any) => {
        dispatch(order.actions.addOrder(data))
      };
      if (socket && isLoggedIn) {
        // console.log(socket);
        socket.emit('acceptOrder', 'hello'); //보내는거
        socket.on('order', callback); //받는거 'hello'는 서버와 미리 약속해둔 값
      }
      return () => {
        if (socket) {
          socket.off('order', callback);
        }
      };
    }, [isLoggedIn, socket]);
  
    useEffect(() => {
      if (!isLoggedIn) {
        console.log('!isLoggedIn', !isLoggedIn);
        disconnect();
      }
    }, [isLoggedIn, disconnect]);
  return (
      isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )
  );
}

export default AppInner;

 {/* Stack.Screen의 options는 어떤 것이 기본일지?라고 함 */}
              {/* <Stack.Screen name="Details">
                {props => <DetailsScreen {...props} />}  
                {/* 추가적인 props를 넘길 때 사용 */}
              {/* </Stack.Screen> */}
              // 리액트 네비게이션에서 자체적으로 safe area view를 적용해주고 있기 때문에 굳이 해주지 않아도 됨