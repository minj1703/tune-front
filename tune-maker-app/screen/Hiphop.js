import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App({ navigation }) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                const response = await fetch('http://43.200.207.101:8080/admin/home/genre', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userToken
                    },
                    body: JSON.stringify({ genre: 'HIPHOP' })
                });

                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }

                const data = await response.json();
                setSongs(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch data: ' + error.message);
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
                    <Text style={styles.genreTitle}>힙합</Text>
                    {songs.map((song, index) => (
                       <TouchableOpacity key={index} onPress={() => navigation.push('Song_detail', { youtubeUrlId: song.youtubeUrlId })}>
                       <View style={styles.songContainer}>
                           <Image
                               style={styles.image}
                               source={{ uri: `https://img.youtube.com/vi/${song.youtubeUrlId}/0.jpg` }}
                           />
                           <View style={styles.songInfo}>
                               <Text style={styles.title}>{song.title}</Text>
                               <Text style={styles.details}>{'0'+song.duration}</Text>
                           </View>
                       </View>
                   </TouchableOpacity>
                    ))}
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
}
const styles = StyleSheet.create({
    icon: {
        width: 28,  
        height: 28, 
        resizeMode: 'contain'
    },
    outerContainer: {
        flex: 1,
        backgroundColor: '#EDE9FE',
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
        backgroundColor: '#FFFFFF',
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#202020',
    },
    details: {
        fontSize: 14,
        color: 'darkgrey',
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

