import React, { useCallback, useRef, useState } from "react";
import {View,Text, TextInput, Pressable, StyleSheet, Alert} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import DismissKeyboardView from "../components/DissmissKeyBoardView";
import Config from 'react-native-config';
import axios, { AxiosError } from "axios";
import userSlice from "../slices/user";
import { useAppDispatch } from "../store";
import EncryptedStorage from "react-native-encrypted-storage";

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}:SignInScreenProps){
    const [loading,setLoading]=useState(false);
    const [email,setEmail]=useState('');
    const [pwd,setPwd]=useState('');
    const emailRef=useRef<TextInput|null>(null);
    const pwdRef=useRef<TextInput|null>(null);
    const canGoNext=email&&pwd;
    const dispatch = useAppDispatch();

    const onSubmit=useCallback(async ()=>{
      if(!email||!email.trim()){
        return Alert.alert('알림','이메일을 입력해주세요')
      }
      else if(!pwd||!pwd.trim()){
        return Alert.alert('알림','비밀번호를 입력해주세요')
      }
      try{
        setLoading(true);
        console.log("config",Config.API_URL);
        const res=await axios.post(`${Config.API_URL}/login`,{email,pwd}); // pwd는 해시화, 일방향 암호화
        console.log("data",res.data)
        Alert.alert("알림",'로그인되었습니다');
        dispatch(
          userSlice.actions.setUser({
            name:res.data.data.name,
            email:res.data.data.email,
            accessToken:res.data.data.accessToken,
          }),
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          res.data.data.refreshToken,
        );
      }catch(err:unknown){
        const errorResponse=(err as AxiosError).response
        if(errorResponse){
          Alert.alert('알림',errorResponse.data.message)
        }
      }finally{
        setLoading(false)
      }
       
    },[email,pwd]);
    const onChangeEmail=useCallback((text)=>{
        setEmail(text.trim())
    },[]);
    const onChangePwd=useCallback((text)=>{
        setPwd(text.trim());
    },[])
    
    const toSignUp=useCallback(()=>{
      navigation.navigate('SignUp')
    },[navigation])
    return (
    <DismissKeyboardView>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>이메일</Text>
            <TextInput 
            style={styles.textInput}
            placeholder="이메일을 입력해주세요"
            onChangeText={onChangeEmail}
            value={email}
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            ref={emailRef}
            onSubmitEditing={()=>{
              pwdRef.current?.focus();
            }}
            blurOnSubmit={false}
            />
        </View>
        <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput 
        style={styles.textInput}
        value={pwd}
        placeholder="비밀번호를 입력해주세요"
        onChangeText={onChangePwd}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        ref={pwdRef}
        onSubmitEditing={onSubmit}
        />  
        </View>
        <View style={styles.buttonZone}>
            <Pressable 
                onPress={onSubmit} 
                style={!email|| !pwd ? styles.loginButton : StyleSheet.compose(styles.loginButton, styles.loginButtonActive)}
                disabled={!canGoNext}
                >
                <Text style={styles.loginButtonText}>로그인</Text>
            </Pressable>
            <Pressable onPress={toSignUp}>
              <Text>회원가입</Text>
            </Pressable>
        </View>
    </DismissKeyboardView>
    )
}
const styles = StyleSheet.create({
    textInput: {
      padding: 5,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputWrapper: {
      padding: 20,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 20,
    },
    buttonZone: {
      alignItems: 'center',
    },
    loginButton: {
      backgroundColor: 'gray',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    loginButtonActive: {
      backgroundColor: 'blue',
    },
    loginButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
export default SignIn;