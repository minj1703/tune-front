import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';

export default function App({ navigation }) {
  const handleNextPress = () => {
    Alert.alert("Button Pressed", "다음 화면으로 넘어갑니다.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tunemaker 앱 사용법(1/5)</Text>
      <Image
      source={require('./image/how1.png')} 
        style={styles.image}
      />
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          1. 로그인을 합니다. 계정이 없는 경우 회원가입을 진행해주세요.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.push('Howto2')}>
        <Text style={styles.buttonText}>다음으로</Text>
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
