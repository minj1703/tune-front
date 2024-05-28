import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // AsyncStorage import

const App = ({ navigation }) => {
  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); 
      await AsyncStorage.removeItem('memberId');
      navigation.reset({routes: [{name: 'Start'}]});   
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.sidebar}>
          <View style={styles.profileSection}>
            <Image style={styles.profileImage}  source={require('./image/17.jpg')}  />
            <Text style={styles.profileTitle}>설정</Text>
          </View>
          <View style={styles.menuSection}>
            <TouchableOpacity onPress={() => navigation.navigate('Password_Change')}>
              <Text style={styles.menuText}>비밀번호 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.menuText}>프로필 정보 확인 및 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Howto1')}>
              <Text style={styles.menuText}>앱 사용법</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Inquiry_list')}>
              <Text style={styles.menuText}>내 문의</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('FAQ')}>
              <Text style={styles.menuText}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Voice_range_test')}>
              <Text style={styles.menuText}>음역대 테스트</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.adSection}>
            <Text style={styles.adText}></Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.fixedMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.push('Home')}>
          <Image style={styles.icon} source={require('./image/home.png')} />
          <Text style={styles.menuItemText}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.push('My_playlist')}>
        <Image style={styles.icon} source={require('./image/bogwan.png')} />
          <Text style={styles.menuItemText}>보관함</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.push('Song_search')}>
        <Image style={styles.icon} source={require('./image/tamsek.png')} />
          <Text style={styles.menuItemText}>탐색</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.push('Voice_range_check')}>
        <Image style={styles.icon} source={require('./image/pandan.png')} />
          <Text style={styles.menuItemText}>판단</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 28,  
    height: 28, 
    resizeMode: 'contain'
     },
  container: {
    flex: 1,
    backgroundColor: '#F4E4FC',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  sidebar: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
    borderRadius: 10,
  },
  profileSection: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5E35B1',
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5E35B1',
    marginVertical: 15,
  },
  adSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: {
    color: '#4B5563',
  },
  fixedMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fixedMenuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  menuItemText: {
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default App;
