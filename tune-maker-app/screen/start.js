import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const App = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const checkAndRemoveToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
         
          await AsyncStorage.removeItem('userToken'); 
       
        }
      };

      checkAndRemoveToken();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={require('./image/logo2.png')}
          resizeMode="cover"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Howto1')}>
            <Text style={styles.buttonText}>사용법 확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: Dimensions.get('window').width * 0.85,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: 400,
    marginVertical: 16,
  },
  buttonContainer: {
    width: '80%',
    paddingBottom: 16,
  },
  button: {
    backgroundColor: '#9575CD',
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
