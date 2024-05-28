import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SongList = ({ route, navigation }) => {
    const [songs, setSongs] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const { playlistId, playlistTitle } = route.params; 

<Text>{playlistTitle}</Text> 


    useEffect(() => {
        fetchSongs();
    }, [playlistId]);

    const fetchSongs = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://43.200.207.101:8080/admin/playlist/${playlistId}`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('실패했습니다.');
            }
            const data = await response.json();
            
            setSongs(data);
        } catch (error) {
            Alert.alert('오류', '오류가 발생했습니다.');
            console.error(error);
        }
    };

    const handleDeleteSong = async (musicId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://43.200.207.101:8080/admin/playlist/music/remove', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId, musicId })
            });

            if (!response.ok) {
                throw new Error('삭제하지 못했습니다.');
            }
            Alert.alert('삭제', '곡이 플레이리스트에서 삭제되었습니다.');
            fetchSongs(); 
        } catch (error) {
            Alert.alert('오류', '오류가 발생했습니다.');
            console.error(error);
        }
    };

    const toggleDeleteVisibility = () => {
        setShowDelete(!showDelete);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}><Text>{playlistTitle}</Text></Text>
            <TouchableOpacity style={styles.deleteIcon} onPress={toggleDeleteVisibility}>
                <Image source={require('./image/delete.png')} style={styles.icon} />
            </TouchableOpacity>
            <ScrollView style={styles.scrollView}>
                {songs.map((song, index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.push('Song_detail', { youtubeUrlId: song.youtubeUrlId })}>
                        <View style={styles.songItem}>
                            <Image source={{ uri: `https://img.youtube.com/vi/${song.youtubeUrlId}/default.jpg` }} style={styles.thumbnail} />
                            <View style={styles.songDetails}>
                                <Text style={styles.songTitle}>{song.title}</Text>
                                <Text style={styles.songDuration}>{song.duration}</Text>
                            </View>
                            {showDelete && (
                                <TouchableOpacity onPress={() => handleDeleteSong(song.id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>삭제</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4e4fc'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
        marginTop: 40,
        
    },
    scrollView: {
        width: '100%',
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    thumbnail: {
        width: 50,
        height: 50,
        marginRight: 20
    },
    songDetails: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    songDuration: {
        fontSize: 14,
        color: 'gray'
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#ff6347',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteIcon: {
        position: 'absolute',
        right: 20,
        top: 60,
    },
    icon: {
        width: 30,
        height: 30,
    }
});

export default SongList;
