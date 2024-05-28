import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminEditScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    email: '',
    newNickname: '',
    newEmail: '',
    gender: '',
    highPitch: ''  
  });

  useFocusEffect(
    useCallback(() => {
     
      loadUserInfo();
    }, [])
  );

  const loadUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo !== null) {
        const data = JSON.parse(storedUserInfo);
        setUserInfo({
          nickname: data.nickname,
          email: data.username,  
          gender: data.gender,
          highPitch: data.highPitch.toString(),  
          newNickname: '',
          newEmail: ''
        });
      }
    } catch (error) {
      Alert.alert('Error', '사용자 데이터를 불러오는 데 실패했습니다');
    }
  };

  const handleGenderChange = (genderLabel) => {
    setUserInfo({ ...userInfo, gender: genderLabel });
  };

  const handleUpdate = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://43.200.207.101:8080/admin/mypage/updatebasic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify({
          nickname: userInfo.newNickname,
          username: userInfo.newEmail,  
          gender: userInfo.gender
        })
      });
  
      if (!response.ok) {
        const errorJson = await response.json();
        console.log(errorJson);
        if (response.status === 400 || response.status === 500) {
          Alert.alert(errorJson.nickname || errorJson.username);       
        } else {
          throw new Error(errorJson.nickname || errorJson.username || '업데이트 실패');
        }
        return;  // 오류 발생 시 여기에서 처리 종료
      }
      
      Alert.alert('변경완료', '정보가 성공적으로 업데이트되었습니다');
      navigation.push('Setting');
  
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('오류', error.message);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.header}>내 정보 수정하기</Text>

        <Text style={styles.infoLabel}>닉네임</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setUserInfo({ ...userInfo, newNickname: text })}
          placeholder={userInfo.nickname || "닉네임 변경"}
          value={userInfo.newNickname}
        />

        <Text style={styles.infoLabel}>이메일</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setUserInfo({ ...userInfo, newEmail: text })}
          placeholder={userInfo.email || "이메일 변경"}
          value={userInfo.newEmail}
        />

        <Text style={styles.infoLabel}>성별</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, userInfo.gender === 'MALE' ? styles.selectedButton : {}]}
            onPress={() => handleGenderChange('MALE')}
          >
            <Text style={styles.buttonText}>남성</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, userInfo.gender === 'FEMALE' ? styles.selectedButton : {}]}
            onPress={() => handleGenderChange('FEMALE')}
          >
            <Text style={styles.buttonText}>여성</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoLabel}>최고 음계</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          editable={false}
          value={userInfo.highPitch || '정보 없음'}  
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>수정하기</Text>
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
  infoLabel: {
    fontSize: 16,
    color: '#6d3d6d',
    marginBottom: 10
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dab6f8',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  disabledInput: {
    backgroundColor: '#E0E0E0'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  button: {
    flex: 1,
    backgroundColor: '#dab6f8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  selectedButton: {
    backgroundColor: '#8c6fc3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
