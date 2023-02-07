import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import {RootState} from './src/store/reducer';

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
    console.log(isLoggedIn);
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