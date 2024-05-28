import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation }) {
  const handleNextPress = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        
        navigation.navigate('Setting');
      } else {
        navigation.navigate('Start');
      }
    } catch (error) {
      console.error('Failed to fetch user token:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tunemaker 앱 사용법(5/5)</Text>
      <Image
        source={require('./image/how5.png')}
        style={styles.image}
      />
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          5. 마지막으로 설정에서, 비밀번호 변경, 문의등 다양한 기능을 사용하실 수 있습니다.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNextPress}>
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
   
    padding: 20,
    backgroundColor: '#f4e4fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 550,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  instructionContainer: {
    backgroundColor: '#45b50e', 
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2', 
    padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
