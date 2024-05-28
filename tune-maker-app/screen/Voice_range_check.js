import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


let temp = 'p2vpqKBPj4U';

function frequencyToNote(frequency) {
  if(frequency==0){
    return '';
  }
  const A4 = 440;
  const SEMITONES = 12;
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const semitonesFromA4 = Math.round(SEMITONES * Math.log2(frequency / A4));
  const noteIndex = (9 + semitonesFromA4 + NOTES.length * 2) % NOTES.length;
  const octave = Math.floor((semitonesFromA4 + 9) / NOTES.length) + 4;
  return NOTES[noteIndex] + octave;
}
const App = ({ navigation }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoData, setVideoData] = useState({
    title: '',
    highPitch: 0,
    keyDiff: '',
    pass: '',
    up: '',
  }); 

  useEffect(() => {
  
    const keyDiffNumeric = parseInt(videoData.keyDiff);
    const isNumeric = !isNaN(keyDiffNumeric);
    let newUp = '';
    let newPass = '';
  
    if (keyDiffNumeric === 0) {
      newUp = '이 곡은 당신의 음역대에 적합합니다.';
      newPass = '적합';
    } else if (keyDiffNumeric > 0) {
      newUp = `이 곡을 ${keyDiffNumeric}키 만큼 높여서 부르세요.`;
      newPass = '부적합';
    } else if(keyDiffNumeric<0 ){
      
      const positiveKeyDiff = -keyDiffNumeric;
      newUp = `이 곡을 ${positiveKeyDiff}키 만큼 낮춰서 부르세요.`;
      newPass = '부적합';
    }
    
    setVideoData(prevState => ({
      ...prevState,
      pass: newPass,
      up: newUp
    }));

  }, [videoData.keyDiff]); 

  const handleCheck = async () => {
    try {
      console.log('URL 처리:', youtubeUrl); 
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://43.200.207.101:8080/admin/youtube', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
        body: JSON.stringify({ youtubeUrl })
      });
  
      if (!response.ok) {
        throw new Error('서버가 에러를 반환했습니다!');
      }
      
      const data = await response.json();
      console.log('서버 응답:', data);
      videoData.keyDiff= 2;
      setVideoData(data);
    
      
      temp = data.youtubeUrlId;
  
    } catch (error) {
      console.error('URL 제출 중 오류 발생:', error);
    }
  };

  const note2 = frequencyToNote(videoData.highPitch);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>음역대 적합 여부 판단</Text>
          <Text style={styles.description}>확인을 원하는 노래의 유튜브 URL을 입력해주세요.{'\n'}처리 시간 약 60초 소요</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setYoutubeUrl}
              value={youtubeUrl}
              placeholder="링크를 입력해주세요."
              placeholderTextColor="#A3A3A3"
            />
            <Image 
              style={styles.icons}
              source={{ uri: 'https://img.icons8.com/color/48/000000/youtube-play.png'}}
            />
          </View>
          <View style={styles.videoPlaceholder}>
            <Image
              style={styles.imageStyle}
              source={{ uri: `https://img.youtube.com/vi/${temp}/0.jpg` }}
            />
          </View>
          <View style={styles.videoDataContainer}>
          <View style={styles.colord}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>제목:{"\n"}{videoData.title}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>최고 음역대:{"\n"}{note2}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>적합 여부: {videoData.pass}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{videoData.up}</Text>
                </View>
                </View>
          </View>
          <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
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
  colord:{
    backgroundColor: '#d8d2f2',
    paddingTop: 10,
  },
  videoDataContainer: {
    padding: 10,
    borderRadius: 8,
    borderColor: '#DAB6F8', 
    borderWidth: 1, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    
    
  },
  
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
    paddingHorizontal: 10,
  },
  dataLabel: {
    fontSize: 16,
    color: '#000000',
  },
  dataValue: {
    fontSize: 16, 
    color: '#666', 
  },
  icon: {
    width: 28,  
    height: 28, 
    resizeMode: 'contain'
},
  imageStyle: {
    width: 300, // 너비 100
    height: 225, // 높이 100
    resizeMode: 'contain' 
  },
  container: {
    flex: 1,
    backgroundColor: '#f4e4fc', 
   
  
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    boxShadow: '0px 2px 2.62px rgba(0, 0, 0, 0.23)', 
    width: '100%',
    maxWidth: 540,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#8c6fc3',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#8c6fc3',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dab6f8',
    padding: 16,
    borderRadius: 8,
    paddingRight: 48, 
    backgroundColor: '#fff',
  },
  icons: {
    position: 'absolute',
    right: 8,
    top: 15,
    width: 32,
    height: 32,
  },
  videoPlaceholder: {
    height: 240,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  placeholderText: {
    color: '#fff',
  },
  checkButton: {
    backgroundColor: '#8c6fc3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fixedMenu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    height: 50, 
  },
  menuItemText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#202020',
  },
  videoDataContainer: { 
    padding: 10,
    
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default App;

