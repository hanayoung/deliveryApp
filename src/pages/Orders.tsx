import React, { useCallback } from "react";
import {View,Text, ScrollView, Pressable, FlatList} from 'react-native';
import { useSelector } from "react-redux";
import EachOrder from "../components/EachOrder";
import order, { Order } from "../slices/order";
import { RootState } from "../store/reducer";
function Orders(){
    const orders=useSelector((state:RootState)=>state.order.orders);
    const renderItem=useCallback(({item}:{item:Order})=>{
        return <EachOrder item={item}/>
},[]); //반복되는 컴포넌트는 최적화를 위해 따로 빼는 게 좋음 
    return (
        <FlatList 
        data={orders}
        keyExtractor={item=>item.orderId}
        renderItem={renderItem}
        />
    );
}
export default Orders;