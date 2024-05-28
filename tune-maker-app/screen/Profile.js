import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function App({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    email: '',
    gender: '',
    highPitch: '0'
  });
  function frequencyToNote(frequency) {
    const A4 = 440;
    const SEMITONES = 12;
    const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const semitonesFromA4 = Math.round(SEMITONES * Math.log2(frequency / A4));
    const noteIndex = (9 + semitonesFromA4 + NOTES.length * 2) % NOTES.length;
    const octave = Math.floor((semitonesFromA4 + 9) / NOTES.length) + 4;
    return NOTES[noteIndex] + octave;
}
const note2 = frequencyToNote(userInfo.highPitch);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAdminData = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken'); 
          const adminResponse = await fetch('http://43.200.207.101:8080/admin/mypage', {
            method: 'GET',
            headers: {
              'Authorization': userToken 
            },
          });

          if (adminResponse.ok) {
            const adminData = await adminResponse.json(); 
            setUserInfo({
              nickname: adminData.nickname, 
              username: adminData.username, 
              gender: adminData.gender === 'MALE' ? '남성' : adminData.gender === 'FEMALE' ? '여성' : '기타', 
              highPitch: adminData.highPitch 
            });
           
            await AsyncStorage.setItem('userInfo', JSON.stringify(adminData));
          } else {
            console.log('Failed to fetch admin data'); 
        } catch (error) {
          console.error('Error fetching admin data:', error);
          Alert.alert('Error', 'Unable to fetch data');
        }
      };

      fetchAdminData(); 
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>내 정보</Text>
      <Text style={styles.label}>닉네임:</Text>
      <Text style={styles.info}>{userInfo.nickname}</Text>
      <Text style={styles.label}>이메일 주소:</Text>
      <Text style={styles.info}>{userInfo.username}</Text>
      <Text style={styles.label}>성별:</Text>
      <Text style={styles.info}>{userInfo.gender}</Text>
      <Text style={styles.label}>최고 음계:</Text>
      <Text style={styles.info}>{note2}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile_change')}>
          <Text style={styles.buttonText}>개인정보 수정하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e4fc',  
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8c6fc3',  
    textAlign: 'center'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#8c6fc3'  
  },
  info: {
    fontSize: 16,
    color: '#000',  
    marginBottom: 10
  },
  buttonContainer: {
    marginTop: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#dab6f8',
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
