import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SongDetail({ route, navigation }) {
    function frequencyToNote(frequency) {
        const A4 = 440;
        const SEMITONES = 12;
        const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const semitonesFromA4 = Math.round(SEMITONES * Math.log2(frequency / A4));
        const noteIndex = (9 + semitonesFromA4 + NOTES.length * 2) % NOTES.length;
        const octave = Math.floor((semitonesFromA4 + 9) / NOTES.length) + 4;
        return NOTES[noteIndex] + octave;
    }

    const [videoInfo, setVideoInfo] = useState({
        id: '',
        title: '',
        youtubeUrl: '',
        highPitch: 0,
        duration: '',
        playlistTitle: '',
        uploader: '',
        youtubeUrlId: route.params.youtubeUrlId,
    });
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                const response = await fetch('http://43.200.207.101:8080/admin/music/details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userToken
                    },
                    body: JSON.stringify({ youtubeUrlId: route.params.youtubeUrlId })
                });
                if (!response.ok) {
                    throw new Error('네트워크 오류가 발생했습니다.');
                }
                const data = await response.json();
                setVideoInfo(prevState => ({ ...prevState, ...data }));

                const playlistResponse = await fetch('http://43.200.207.101:8080/admin/getplaylists', {
                    method: 'GET',
                    headers: {
                        'Authorization': userToken,
                        'Content-Type': 'application/json'
                    }
                });
                if (!playlistResponse.ok) {
                    throw new Error('Failed to fetch playlists');
                }
                const playlistData = await playlistResponse.json();
                setPlaylists(playlistData);
                if (playlistData.length > 0) {
                    setSelectedPlaylistId(playlistData[0].playlistId);
                }
            } catch (error) {
                Alert.alert('Failed to fetch data', error.message);
            }
        };
        fetchData();
    }, []);

    const addToPlaylist = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://43.200.207.101:8080/admin/playlist/music/add', {
                method: 'POST',
                headers: {
                    'Authorization': userToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId: selectedPlaylistId, musicId: videoInfo.id })
            });
            if (!response.ok) {
                throw new Error('노래를 플레이리스트에 추가하지 못했습니다.');
            }
            Alert.alert('완료', '노래를 플레이리스트에 성공적으로 추가하였습니다.');
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    if (!videoInfo) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const note = frequencyToNote(videoInfo.highPitch);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.videoContainer}>
                <YoutubePlayer height={250} play={false} videoId={videoInfo.youtubeUrlId} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>곡 제목: {videoInfo.title}</Text>
                <Text style={styles.title}>최고 음계: {note}</Text>
                <Text style={styles.title}>곡 길이: {videoInfo.duration}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>플레이리스트에 담기</Text>
                </TouchableOpacity>
            </View>
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
                        <Text style={styles.modalText}>플레이리스트를 선택해주세요.</Text>
                        <Picker
                            selectedValue={selectedPlaylistId}
                            style={{ height: 50, width: 250 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedPlaylistId(itemValue)}
                        >
                            {playlists.map((playlist) => (
                                <Picker.Item key={playlist.playlistId} label={playlist.playlistTitle} value={playlist.playlistId} />
                            ))}
                        </Picker>
                        <TouchableOpacity style={styles.button} onPress={addToPlaylist}>
                            <Text style={styles.buttonText}>추가</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4fc',
    },
    videoContainer: {
        width: '100%',
        marginBottom: 20,
        paddingTop: 50,
    },
    textContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#8c6fc3',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#8c6fc3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    titleContainer: {
        marginBottom: 20,
    },
    title2: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#8c6fc3',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    }
});