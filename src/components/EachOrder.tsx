import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios, { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Config from "react-native-config";
import NaverMapView, { Marker, Path } from "react-native-nmap";
import { useSelector } from "react-redux";
import { LoggedInParamList } from "../../AppInner";
import order, { Order } from "../slices/order";
import { useAppDispatch } from "../store";
import { RootState } from "../store/reducer";
import getDistanceFromLatLonInKm from '../util';

interface Props {
    item: Order;
  }

function EachOrder({item}:Props){
    const dispatch=useAppDispatch();
    const navigation=useNavigation<NavigationProp<LoggedInParamList>>(); //hook을 사용하면 props drilling을 하지 않아도 되지만 타입 추론이 어려워서 다음과 같이 타입을 알려줘야함
    const [detail,setDetail]=useState(false);
    const [loading,setLoading]=useState(false);
    const accessToken=useSelector((state:RootState)=>state.user.accessToken);
    const toggleDetail=useCallback(()=>{
        setDetail(prev=>!prev)
    },[]);
    
    const onAccept=useCallback(async ()=>{
        setLoading(false);
        try{
            setLoading(true);
            await axios.post(
                `${Config.API_URL}/accept`,
                {orderId:item.orderId},
                {headers:{
                    Authorization: `Bearer ${accessToken}`
                },
                }
            )
            dispatch(order.actions.acceptOrder(item.orderId))
            setLoading(false);
            navigation.navigate('Delivery');
        }
        catch(err:unknown){
            let errorResponse=(err as AxiosError).response;
            if(errorResponse?.status===400){
                Alert.alert('알림',errorResponse.data.message);
                dispatch(order.actions.rejectOrder(item.orderId));
                setLoading(false);
            }
        }
       
    },[dispatch,item.orderId,accessToken,navigation]);

    const onReject=useCallback(()=>{
        dispatch(order.actions.rejectOrder(item.orderId))
    },[dispatch,item.orderId]);

    const {start, end} = item;

    return(
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text style={styles.eachInfo}>
          {getDistanceFromLatLonInKm(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude,
          ).toFixed(1)}
          km
        </Text>
      </Pressable>
      {detail && (
        <View>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 200,
              marginTop: 10,
            }}>
            <NaverMapView
              style={{width: '100%', height: '100%'}}
              zoomControl={false}
              center={{
                zoom: 10,
                tilt: 50,
                latitude: (start.latitude + end.latitude) / 2,
                longitude: (start.longitude + end.longitude) / 2,
              }}>
              <Marker
                coordinate={{
                  latitude: start.latitude,
                  longitude: start.longitude,
                }}
                pinColor="blue"
              />
              <Path
                coordinates={[
                  {
                    latitude: start.latitude,
                    longitude: start.longitude,
                  },
                  {latitude: end.latitude, longitude: end.longitude},
                ]}
              />
              <Marker
                coordinate={{latitude: end.latitude, longitude: end.longitude}}
              />
            </NaverMapView>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
        )
}

const styles = StyleSheet.create({
    orderContainer: {
      borderRadius: 5,
      margin: 5,
      padding: 10,
      backgroundColor: 'lightgray',
    },
    info: {
      flexDirection: 'row',
    },
    eachInfo: {
      flex: 1,
    },
    buttonWrapper: {
      flexDirection: 'row',
    },
    acceptButton: {
      backgroundColor: 'blue',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      flex: 1,
    },
    rejectButton: {
      backgroundColor: 'red',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      flex: 1,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
export default EachOrder;