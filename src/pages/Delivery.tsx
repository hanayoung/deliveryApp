import React from "react";
import {View,Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Complete from './Complete';
import Ing from './Ing';

const Stack = createNativeStackNavigator();

function Delivery(){
    return (
        <Stack.Navigator>
        <Stack.Screen name="Ing" component={Ing} options={{title: '내 오더'}} />
        <Stack.Screen
          name="Complete"
          component={Complete}
          options={{title: '완료하기'}}
        />
      </Stack.Navigator>
      // 중첩된 navigator, 초반에 설정해두는 것이 필요
    )
}
export default Delivery;