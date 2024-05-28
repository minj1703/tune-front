import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';

export default function App({ navigation }) {
  const handleNextPress = () => {
    Alert.alert("Button Pressed", "다음 화면으로 넘어갑니다.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tunemaker 앱 사용법(3/5)</Text>
      <Image
      source={require('./image/how3.png')} 
        style={styles.image}
      />
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
         3.홈화면에서 음역대 기반 추천 노래와, 장르별 추천 노래를 확인 할 수 있습니다.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.push('Howto4')}>
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
