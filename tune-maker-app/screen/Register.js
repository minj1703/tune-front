import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SignUpScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [username, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailDomain, setEmailDomain] = useState('@gmail.com');

  const validatePassword = () => {
    if (password !== password2) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const submitSignUp = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      const response = await fetch('http://43.200.207.101:8080/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          username: username + emailDomain,
          password1: password,
          password2,
          gender
        }),
      });
      
      if (response.ok) {       
        Alert.alert('회원 가입 성공', '로그인해주세요');
        navigation.navigate('Login');
        
      } else {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        setErrorMessage( jsonResponse.nickname || jsonResponse.password1 || '회원 가입에 실패하였습니다.');
      }
    } catch (error) {
      //console.log('SignUp Error:', error.message);
      setErrorMessage('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>TuneMaker 회원 가입</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNickname}
            value={nickname}
            placeholder="닉네임"
            placeholderTextColor="#A3A3A3"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              onChangeText={setAccountId}
              value={username}
              placeholder="이메일"
              autoCapitalize="none"
              placeholderTextColor="#A3A3A3"
            />
            <Picker
              selectedValue={emailDomain}
              style={{ flex: 1.5, height: 20 }}
              onValueChange={(itemValue, itemIndex) => setEmailDomain(itemValue)}
            >
              <Picker.Item label="@gmail.com" value="@gmail.com" />
              <Picker.Item label="@naver.com" value="@naver.com" />
              <Picker.Item label="@ajou.ac.kr" value="@ajou.ac.kr" />
              <Picker.Item label="직접 입력" value="" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="비밀번호"
            secureTextEntry={true}
            placeholderTextColor="#A3A3A3"
          />
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={password2}
            placeholder="비밀번호 확인"
            secureTextEntry={true}
            placeholderTextColor="#A3A3A3"
          />
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <View style={styles.genderButtonsContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'MALE' && styles.genderButtonSelected]}
              onPress={() => setGender('MALE')}>
              <Text style={styles.genderButtonText}>남성</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'FEMALE' && styles.genderButtonSelected]}
              onPress={() => setGender('FEMALE')}>
              <Text style={styles.genderButtonText}>여성</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={submitSignUp}>
            <Text style={styles.submitButtonText}>가입</Text>
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
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#8c6fc3',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dab6f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#000'
  },
  errorMessage: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 10,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#dab6f8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: '#8c6fc3',
  },
  genderButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#8c6fc3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;