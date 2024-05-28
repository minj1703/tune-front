import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://43.200.207.101:8080/admin/getplaylists', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('플레이리스트를 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      Alert.alert('오류', '플레이리스트를 가져오는 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  const handleAddPlaylist = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://43.200.207.101:8080/admin/playlist/create', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playlistTitle: newPlaylistTitle })
      });
      if (!response.ok) {
        throw new Error('플레이리스트 생성 실패');
      }
      setModalVisible(false);
      fetchPlaylists();
    } catch (error) {
      Alert.alert('오류', '플레이리스트 생성 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://43.200.207.101:8080/admin/playlist/delete', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playlistId })
      });
      if (!response.ok) {
        throw new Error('플레이리스트 삭제 실패');
      }
      Alert.alert('성공', '플레이리스트가 성공적으로 삭제되었습니다.');
      fetchPlaylists(); 
    } catch (error) {
      Alert.alert('오류', '플레이리스트 삭제 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  const toggleDeleteVisibility = () => {
    setShowDelete(!showDelete);
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.headerTitle}>플레이리스트</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {playlists.map((playlist, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('Song_list', { playlistId: playlist.playlistId, playlistTitle: playlist.playlistTitle })}>
            <View style={styles.playlistItem}>
              <Image source={{ uri: playlist.imageUri }} style={styles.playlistImage} />
              <Text style={styles.playlistTitle}>{playlist.playlistTitle}</Text>
              {showDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePlaylist(playlist.playlistId)}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={[styles.imageButton, {right: 15}]} onPress={toggleDeleteVisibility}>
        <Image source={require('./image/delete.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.imageButton, {left: 300, right: null}]} onPress={() => setModalVisible(true)}>
        <Image source={require('./image/playlistadd.png')} style={styles.icon} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="플레이리스트 제목 입력"
              value={newPlaylistTitle}
              onChangeText={setNewPlaylistTitle}
              style={styles.textInput}
            />
            <View style={styles.buttonRow}>
              <Button title="추가" onPress={handleAddPlaylist} color="#dab6f8" />
              <View style={styles.buttonSpacer}></View>
              <Button title="취소" onPress={() => setModalVisible(false)} color="#dab6f8" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f4e4fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '100%',
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 70,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  playlistImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#dab6f8',
    padding: 10,
    borderRadius: 25,
    width: '90%',
  },
  addButtonText: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    width: 250,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  buttonSpacer: {
    width: 20,
  },
  icon: {
    width: 30,
    height: 50,
    resizeMode: 'contain'
  },
  imageButton: {
    position: 'absolute',
    top: 65,
    right: 20,
  }
});

export default App;
