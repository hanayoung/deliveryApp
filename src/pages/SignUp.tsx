import React, { useCallback, useRef, useState } from "react";
import {View,Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import DismissKeyboardView from "../components/DissmissKeyBoardView";
import axios, { AxiosError } from "axios";
import Config from 'react-native-config';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}:SignUpScreenProps){
    const [loading,setLoading]=useState(false);
    const [email,setEmail]=useState('');
    const [pwd,setPwd]=useState('');
    const [name,setName]=useState('');
    const emailRef=useRef<TextInput|null>(null);
    const pwdRef=useRef<TextInput|null>(null);
    const nameRef=useRef<TextInput|null>(null);
    const canGoNext=email&&pwd&&name;
    const onSubmit=useCallback(async ()=>{
      if(loading){
        //loading 중인데 요청이 왔을 때 return처리
        return;
      }
      if(!email||!email.trim()){
        return Alert.alert('알림','이메일을 입력해주세요')
      }
      if(!pwd||!pwd.trim()){
        return Alert.alert('알림','비밀번호를 입력해주세요')
      }
      if(!name||!name.trim()){
        return Alert.alert('알림','이름을 입력해주세요')
      }
      if (
        !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
          email,
        )
      ) {
        return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
      }
      if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(pwd)) {
        return Alert.alert(
          '알림',
          '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
        );
      }
      try{
        setLoading(true);
        console.log("config",Config.API_URL);
        const res=await axios.post(`${Config.API_URL}/user`,{email,name,pwd}); // pwd는 해시화, 일방향 함호화
        console.log("data",res.data)
      }catch(err:unknown){
        const errorResponse=(err as AxiosError).response
        if(errorResponse){
          Alert.alert('알림',errorResponse.data.message)
        }
      }finally{
        setLoading(false)
      }
        Alert.alert("알림",'회원가입이 완료되었습니다');
        navigation.navigate('SignIn')
    },[email,pwd,name,navigation]);


    const onChangeEmail=useCallback((text)=>{
        setEmail(text.trim())
    },[email]);
    const onChangePwd=useCallback((text)=>{
        setPwd(text.trim());
    },[pwd])
    const onChangeName=useCallback((text)=>{
        setName(text.trim());
    },[name])

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
              nameRef.current?.focus();
            }}
            blurOnSubmit={false}
            />
        </View>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>이름</Text>
            <TextInput 
            style={styles.textInput}
            placeholder="이름을 입력해주세요"
            onChangeText={onChangeName}
            value={name}
            importantForAutofill="yes"
            autoComplete="name"
            textContentType="name"
            ref={nameRef}
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
                disabled={!canGoNext||loading} 
                // 회원가입이 여러 번 눌리면 동시에 여러 번 가입될 수 있기때문에 loading처리 필요
                >
                {loading?
                <ActivityIndicator color="white"/>:
                <Text style={styles.loginButtonText}>회원가입</Text>
                }
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
export default SignUp;