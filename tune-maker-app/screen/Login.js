import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useAuth } from './AuthContext'; 

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const navigateToLogin = async () => {
    try {
      const response = await fetch('http://43.200.207.101:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        if (data.memberId && data.Authorization) {
          AsyncStorage.setItem('memberId', String(data.memberId));
          AsyncStorage.setItem('userToken', data.Authorization);
          login(data.Authorization); 
          navigation.push('Home');
        } else {
          Alert.alert('오류', '로그인에 실패하였습니다.');
        }
      } else {
        const errorData = await response.text();
        Alert.alert('오류', errorData || '아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '네트워크 오류가 발생하였습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>TuneMaker</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="이메일"
              placeholderTextColor="#A3A3A3"
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="비밀번호"
              secureTextEntry
              placeholderTextColor="#A3A3A3"
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e4fc', 
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 30, 
    width: 340, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#8c6fc3', 
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff', 
    borderColor: '#000', 
    borderWidth: 1, 
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#8c6fc3', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 10,
    color: '#8c6fc3', 
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default LoginScreen;
