import React, { useState } from 'react';
import {
  View, TextInput, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('검색 결과가 없습니다.'); 

  const searchSongs = async () => {
    setLoading(true); 
    try {
      const userToken = await AsyncStorage.getItem('userToken'); 
      const response = await fetch('http://43.200.207.101:8080/admin/music/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken, 
        },
        body: JSON.stringify({ keyword }) 
      });
      const data = await response.json();

      if (!response.ok) {
     
        throw new Error(data.message);
      }

      setSongs(Array.isArray(data) ? data.slice(0, 200) : []); 
    } catch (error) {
      setMessage(error.message || 'Failed to fetch songs'); 
      setSongs([]);
    }
    setLoading(false); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logoImage} source={require('./image/logo.png')} />
        <Text style={styles.headerText}>TUNEMAKER</Text>
        <TouchableOpacity onPress={() => navigation.push('Setting')}>
          <Image style={styles.profileImage} source={require('./image/17.jpg')} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="노래 제목을 입력하세요"
        value={keyword}
        onChangeText={setKeyword}
      />
      <TouchableOpacity style={styles.button} onPress={searchSongs}>
        <Text style={styles.buttonText}>노래 검색</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : songs.length === 0 ? (
        <Text style={styles.noResultsText}>{message}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {songs.map((song) => (
            <TouchableOpacity key={song.Id} onPress={() => navigation.push('Song_detail', { youtubeUrlId: song.youtubeUrlId})}>
              <View style={styles.songItem}>
                <Image
                  source={{ uri: `https://img.youtube.com/vi/${song.youtubeUrlId}/0.jpg` }}
                  style={styles.thumbnail}
                />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songLength}>{song.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  noResultsText: {
    fontSize: 16,
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#F1EAFA',
    paddingTop: 30,
    paddingBottom: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
  },
  headerText: {
    color: '#5C26A9',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  profileImage: {
    height: 55,
    width: 55,
    borderRadius: 28,
  },
  loadingText: {
    fontSize: 16,
    color: 'blue',
    marginVertical: 10,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  songItem: {
    flexDirection: 'row',
    marginVertical: 10,
    marginLeft: 14,
    marginRight: 14,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#F1EAFA',
  },
  thumbnail: {
    width: 100,
    height: 70,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  songTitle: {
    fontSize: 18,
  },
  songLength: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    backgroundColor: '#c69dfa',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
