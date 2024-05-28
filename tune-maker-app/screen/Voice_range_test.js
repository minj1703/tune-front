import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import AWS from 'aws-sdk';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Asset } from 'expo-asset';
import { Secret_key, keyis } from './data.js'; 



AWS.config.update({
  accessKeyId: keyis,
  secretAccessKey:Secret_key,
  region: 'ap-northeast-2'  
});

const s3 = new AWS.S3();

const App = ({ navigation }) => {
  const [noteIndex, setNoteIndex] = useState(0);
  const notes = ['C3', 'CSharp3', 'D3', 'DSharp3', 'E3', 'F3', 'FSharp3', 'G3','GSharp3','A3','ASharp3','B3',
  'C4', 'CSharp4', 'D4', 'DSharp4', 'E4', 'F4', 'FSharp4', 'G4','GSharp4','A4','ASharp4','B4',
  'C5', 'CSharp5', 'D5', 'DSharp5', 'E5', 'F5', 'FSharp5', 'G5','GSharp5','A5'
  ];
  const [accuracy, setAccuracy] = useState('0%');
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [data, setData] = useState({accuracy:'',pass:''});
 const soundFiles = {
  C3: require('./sound/C3.wav'),
  CSharp3: require('./sound/Csharp3.wav'),
  D3: require('./sound/D3.wav'),
  DSharp3: require('./sound/Dsharp3.wav'),
  E3: require('./sound/E3.wav'),
  F3: require('./sound/F3.wav'),
  FSharp3: require('./sound/Fsharp3.wav'),
  G3: require('./sound/G3.wav'),
  GSharp3: require('./sound/Gsharp3.wav'),
  A3: require('./sound/A3.wav'),
  ASharp3: require('./sound/Asharp3.wav'),
  B3: require('./sound/B3.wav'),
  C4: require('./sound/C4.wav'),
  CSharp4: require('./sound/Csharp4.wav'),
  D4: require('./sound/D4.wav'),
  DSharp4: require('./sound/Dsharp4.wav'),
  E4: require('./sound/E4.wav'),
  F4: require('./sound/F4.wav'),
  FSharp4: require('./sound/Fsharp4.wav'),
  G4: require('./sound/G4.wav'),
  GSharp4: require('./sound/Gsharp4.wav'),
  A4: require('./sound/A4.wav'),
  ASharp4: require('./sound/Asharp4.wav'),
  B4: require('./sound/B4.wav'),
  C5: require('./sound/C5.wav'),
  CSharp5: require('./sound/Csharp5.wav'),
  D5: require('./sound/D5.wav'),
  DSharp5: require('./sound/Dsharp5.wav'),
  E5: require('./sound/E5.wav'),
  F5: require('./sound/F5.wav'),
  FSharp5: require('./sound/Fsharp5.wav'),
  G5: require('./sound/G5.wav'),
  GSharp5: require('./sound/Gsharp5.wav'),
  A5: require('./sound/A5.wav'),
};
  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
    })();
  }, []);

 
  

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


    const enddata = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        
        const response = await fetch('http://43.200.207.101:8080/admin/vocal/end', {
          method: 'GET',
          headers: {
            'Authorization': userToken
          }
        });

        if (!response.ok) {
          throw new Error('Server responded with an error: ' + response.status);
        }
        const json = await response.json();
        console.log(json);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      
      }
    
    };

  const playMachineSound = async (음표) => {
    if (sound) {
        await sound.unloadAsync(); 
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFiles[note]);
    setSound(newSound); 
    await newSound.playAsync(); 
};

  const sendNoteToServer = async () => {
    try {
      
      const memberId2 = await AsyncStorage.getItem('memberId')
      const target = `${notes[noteIndex]}`;
      const s3Link = `user_voice/${memberId2}/${notes[noteIndex]}.mp3`;
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://43.200.207.101:8080/admin/vocal/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
        body: JSON.stringify({target,
          s3Link })
      });
      const data = await response.json();
      
      console.log(target, s3Link);
      console.log(data);
      setData(data);
      Alert.alert('서버 응답', `응답: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('서버로 데이터 전송 실패', error);
      Alert.alert('전송 실패', '서버로 데이터 전송에 실패하였습니다.');
    }
  };

  const changeNote = (delta) => {
    if(data.pass === true){
    setNoteIndex((noteIndex + delta + notes.length) % notes.length);
    data.pass='';
    data.accuracy='';
  }
  else{
    Alert.alert('정확도를 확인해주세요.','수치가 80미만일 시 이전 음, 다음 음으로 이동하실 수 없습니다.');
  }
   
  };



  const startRecording = async () => {
   
    if (recording) {
      await stopRecording(recording);
    } else {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('이 앱은 마이크 사용 권한이 필요합니다.');
        return;
      }

      Alert.alert(
        '녹음 시작',
        '3초간 마이크가 활성화됩니다. 녹음을 시작하시겠습니까?',
        [
          { text: 'Cancel', onPress: () => console.log('취소버튼 눌러짐'), style: 'cancel' },
          { text: 'OK', onPress: () => beginRecording() },
        ],
        { cancelable: false }
      );
    }
  };


  const beginRecording = async () => {
    setRecording(true);
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setTimeout(() => stopRecording(recording), 3000);
    } catch (error) {
      console.error('녹음에 실패하였습니다.', error);
    }
  };
  

  function passcheck(pasi){
  if (pasi === true) {
    return '통과';
  } else if (pasi === false) {
    return '실패';
  } else if(!pasi){
    return  '';
  }
  }
  let passdata=passcheck(data.pass);

  const stopRecording = async (recordingObject) => {
    setRecording(false);
    try {
      await recordingObject.stopAndUnloadAsync();
      const uri = recordingObject.getURI();
      uploadRecording(uri);
    } catch (error) {
      console.error('녹음을 멈추는데 실패하였습니다.', error);
    }
  };

  const uploadRecording = async (uri) => {
    const memberId = await AsyncStorage.getItem('memberId')
    const response = await fetch(uri);
    const blob = await response.blob();
    const key = `user_voice/${memberId}/${notes[noteIndex]}.mp3`;

    const params = {
      Bucket: 'musicvocal', 
      Key: key,
      Body: blob,
      ContentType: 'audio/mp3'
    };

    try {
      const userToken2 = await AsyncStorage.getAllKeys();
      const memberId = await AsyncStorage.getItem('Authorization');
      const memberId2 = await AsyncStorage.getItem('memberId');
      const memberId3 = await AsyncStorage.getItem('userInfo');
      const memberId4 = await AsyncStorage.getItem('userToken');
      console.log(userToken2,memberId,memberId2,memberId3,memberId4);
      const data = await s3.upload(params).promise();
      Alert.alert('업로드 성공', `업로드에 성공하였습니다.: ${data.Location}`);
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('업로드 실패', '파일 업로드에 실패하였습니다.');
    }
    sendNoteToServer();
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={enddata}>
        <Text onPress={() => navigation.push('Home')} style={styles.closeButtonText}>종료</Text>
         </TouchableOpacity>
          <View style={styles.noteDisplay}>
           <Text style={styles.noteText}>현재 음: {notes[noteIndex]}</Text>
            </View>
             <View style={styles.controls}>
             <View style={styles.iconContainer}>
  <TouchableOpacity
    style={[styles.iconButton]}
    onPress={() => playMachineSound(notes[noteIndex])}>
    <Image source={require('./image/speaker.png')} style={styles.icon} />
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.iconButton, recording ? styles.activeIconButton : null]}
    onPress={startRecording}>
    <Image source={require('./image/microphone.png')} style={styles.icon} />
    </TouchableOpacity>
     </View>
        </View>
        <View style={styles.accuracyContainer}>
        <Text style={styles.accuracyDisplay}>정확도: {data.accuracy} {'\n'}통과여부: {passdata}</Text>
        </View>
        <Text style={styles.description}>
        헤드셋 버튼을 눌러 음을 듣고{"\n"}마이크를 터치 후 해당하는 음을 내주세요
        </Text>
        <View style={styles.buttons}>
  <TouchableOpacity style={styles.button} onPress={() => changeNote(-1)}>
    <Text style={styles.buttonText}>이전</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={() => changeNote(1)}>
    <Text style={styles.buttonText}>다음</Text>
  </TouchableOpacity>
   </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f4e4fc', 
    
  },
  buttonText: {
    fontSize: 16, 
    color: 'white', 
    textAlign: 'center' 
  },
  container: {
    width: '90%', 
    maxWidth: 360, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
    minHeight: '90%', 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  noteDisplay: {
    marginBottom: 25,
  },
  noteText: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#9c88d9', 
    paddingBottom: 100,
  },
  controls: {
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 20, 
  },
  iconButton: {
    backgroundColor: '#f4e4fc', 
    borderRadius: 20, 
    margin: 10,
    marginHorizontal: 20, 
    marginRight:5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    shadowOffset: { width: 0, height: 2 }, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  activeIconButton: {
    borderWidth: 10, 
    borderColor: '#dab6f8', 
  },
  icon: {
    width: 150, 
    height: 150, 
  },
  accuracyContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 50, 
  },
  accuracyDisplay: {
    fontSize: 18, 
    color: '#9c88d9', 
  },
  description: {
    marginTop: 60, 
    fontSize: 16, 
    color: '#000', 
    textAlign: 'center', 
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly', 
    marginBottom: 20,
    width: '100%', 
  },
  
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#f4e4fc',
    padding: 10,
    borderRadius: 20,
    zIndex: 10, 
  },
  closeButtonText: {
    fontSize: 16,
    color: '#9c88d9',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  button: {
    backgroundColor: '#9c88d9',
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 10,
    width: 100, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  
});
export default App;




