import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ChangePasswordScreen({ navigation }) {
  const [passwords, setPasswords] = useState({
    originPassword: '',
    newPassword1: '',
    newPassword2: ''
  });
  const [visible, setVisible] = useState({
    originPassword: false,
    newPassword1: false,
    newPassword2: false
  });

  useFocusEffect(
    React.useCallback(() => {
     
      setPasswords({
        originPassword: '',
        newPassword1: '',
        newPassword2: ''
      });
      setVisible({
        originPassword: false,
        newPassword1: false,
        newPassword2: false
      });
    }, [])
  );

  const toggleVisibility = (field) => {
    setVisible({ ...visible, [field]: !visible[field] });
  };

  const handleChangePassword = async () => {
    const { originPassword, newPassword1, newPassword2 } = passwords;
  
 
    if (!originPassword || !newPassword1 || !newPassword2) {
      Alert.alert('', '모든 필드를 채워주세요.');
      return;
    }
  
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      Alert.alert('Error', '인증 토큰을 불러오는 데 실패했습니다.');
      return;
    }
  
    try {
      const response = await fetch('http://43.200.207.101:8080/admin/mypage/updatepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify({
          originPassword,
          newPassword1,
          newPassword2
        })
      });
  
  
  
      if (!response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        throw new Error(responseData.message || responseData.newPassword1);
      }
  
      Alert.alert('성공', '비밀번호가 성공적으로 변경되었습니다.');
      navigation.push('Setting');
  
    } catch (error) {
      console.error('Password Change Error:', error);
      Alert.alert('오류', error.message || error.newPassword1);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.header}>비밀번호 변경</Text>

        {['originPassword', 'newPassword1', 'newPassword2'].map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!visible[field]}
              placeholder={field === 'originPassword' ? '기존 비밀번호 입력' : '새 비밀번호 입력'}
              value={passwords[field]}  // 입력된 값을 상태와 동기화
              onChangeText={text => setPasswords({ ...passwords, [field]: text })}
            />
            <TouchableOpacity
              onPress={() => toggleVisibility(field)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleButtonText}>{visible[field] ? '숨기기' : '보기'}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>비밀번호 변경</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e4fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8c6fc3',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dab6f8',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  toggleButton: {
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dab6f8',
    backgroundColor: '#f4e4fc',
    borderRadius: 5
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#8c6fc3'
  },
  button: {
    backgroundColor: '#dab6f8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});