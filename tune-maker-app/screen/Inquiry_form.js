import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from './AuthContext';  
import AsyncStorage from '@react-native-async-storage/async-storage';


const InquiryForm = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useAuth(); 

  const handleSubmission = async () => {
    if (!title || !message) {
      Alert.alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://43.200.207.101:8080/admin/inquiry/add', {
        title,
        content: message
      }, {
        headers: {
          'Authorization': userToken  
        }
      });

      if (response.status === 200) {
        Alert.alert('문의가 정상 등록되었습니다. 감사합니다.');
        setTitle('');
        setMessage('');
        navigation.push('Inquiry_list');
      } else {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Alert.alert('문의 등록에 실패했습니다.', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>문의하기</Text>
      <View style={styles.formCard}>
        <Text style={styles.label}>제목:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>문의 내용:</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />
        <Button
          title="제출하기"
          onPress={handleSubmission}
          color="#a855f7"
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    height: 80
  }
});

export default InquiryForm;
