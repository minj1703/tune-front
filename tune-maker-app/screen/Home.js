import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          console.log('User token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://43.200.207.101:8080/admin/home', {
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
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            style={styles.logoImage}
            source={require('./image/logo.png')}
          />
          <Text style={styles.headerText}>TUNEMAKER</Text>
          <TouchableOpacity onPress={() => navigation.push('Setting')}>
            <Image style={styles.profileImage} source={require('./image/17.jpg')} />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
       <View style={styles.titleWithButtonContainer}>
           <Text style={styles.title}>음역대 기반 추천 노래</Text>
            <TouchableOpacity style={styles.moreButton} onPress={() => navigation.push('osusume')}>
             <Text style={styles.moreButtonText}>더보기</Text>
            </TouchableOpacity>
           </View>

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            data && data.slice(0, 3).map((item, index) => (
              <TouchableOpacity key={index} onPress={() => navigation.push('Song_detail', { youtubeUrlId: item.youtubeUrlId})}>
                <View style={styles.songItem}>
                  <Image style={styles.thumbnail} source={{ uri: `https://img.youtube.com/vi/${item.youtubeUrlId}/0.jpg` }} />
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{item.title}</Text>
                    <Text style={styles.songDuration}>{item.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          
          <Text style={styles.title}>장르별 추천 노래</Text>
          <View style={styles.genreGrid}>
            <View style={styles.genreItem}>
              <TouchableOpacity onPress={() => navigation.push('Jazz')}>
                <Image style={styles.thumbnail2} source={require('./image/jazz.png')} />
                <Text style={styles.genreName}>재즈</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.genreItem}>
              <TouchableOpacity onPress={() => navigation.push('Hiphop')}>
                <Image style={styles.thumbnail2} source={require('./image/rap.png')} />
                <Text style={styles.genreName}>랩&힙합</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.genreItem}>
              <TouchableOpacity onPress={() => navigation.push('Ballad')}>
                <Image style={styles.thumbnail2} source={require('./image/ballad.png')} />
                <Text style={styles.genreName}>발라드</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.genreItem}>
              <TouchableOpacity onPress={() => navigation.push('Trot')}>
                <Image style={styles.thumbnail2} source={require('./image/trote.png')} />
                <Text style={styles.genreName}>트로트</Text>
              </TouchableOpacity>
            </View>
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

  titleWithButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,  
    marginRight: 10,  
  },
  moreButton: {
    backgroundColor: '#EDE9FE',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7C4EB',
  },
  moreButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5C26A9',
  },
icon: {
  width: 28,  
  height: 28, 
  resizeMode: 'contain'
   },
outerContainer: {
    flex: 1,
    backgroundColor: '#f4e4fc',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: '#EDE9FE',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#F1EAFA',
    width: '100%',
    paddingTop: 30,
    paddingBottom: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
headerText: {
    color: '#5C26A9',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: -110,
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
  card: {
    backgroundColor: '#ffffff',
    flex: 1,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    marginBottom: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  genreTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#202020',
      marginBottom: 20,
      alignSelf: 'flex-start',
  },
  songContainer: {
      flexDirection: 'row',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 10,
      alignItems: 'center',
  },
  image: {
      width: 100,
      height: 100,
      marginRight: 20,
  },
  songInfo: {
      flex: 1,
      justifyContent: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#202020',
    marginBottom: 15,
  },
  songList: {
    marginBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnail: {
    width: 85,
    height: 75,
    marginRight: 10,
  },
  thumbnail2: {
    width: 120,
    height: 120,
  },
  songTitle: {
    fontSize: 16,
  },
  songDuration: {
    fontSize: 14,
    color: '#666',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreItem: {
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  genreName: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  fixedMenu: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  menuItemText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#202020',
  },
});
export default App;
