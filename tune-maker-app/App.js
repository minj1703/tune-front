import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './screen/AuthContext'; 


import Start from './screen/start';
import Login from './screen/Login';
import Howto1 from './screen/How_to_use_app1';
import Home from './screen/Home';
import My_playlist from './screen/My_playlist';
import Register from './screen/Register';
import Setting from './screen/Setting';
import Password_Change from './screen/Password_Change';
import Voice_range_check from './screen/Voice_range_check';
import Voice_range_test from './screen/Voice_range_test';
import Inquiry_form from './screen/Inquiry_form';
import Inquiry_list from './screen/Inquiry_list';
import Song_detail from './screen/Song_detail';
import Song_search from './screen/Song_search';
import FAQ from './screen/FAQ';
import Song_list from './screen/Song_list';
import Profile_change from './screen/Profile_change';
import Profile from './screen/Profile';
import Constants from 'expo-constants';
import Howto2 from './screen/Howto2';
import Howto3 from './screen/Howto3';
import Howto4 from './screen/Howto4';
import Howto5 from './screen/Howto5';
import Hiphop from './screen/Hiphop';
import Jazz from './screen/Jazz';
import Trot from './screen/Trot';
import Ballad from './screen/Ballad';
import osusume from './screen/osusume.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} options={{ title: '시작하기' , headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ title: '로그인', headerShown: false }} />
          <Stack.Screen name="Howto1" component={Howto1} options={{ title: '앱 사용법 1' , headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ title: '홈', headerShown: false }} />
          <Stack.Screen name="My_playlist" component={My_playlist} options={{ title: '내 플레이리스트', headerShown: false }} />
          <Stack.Screen name="Setting" component={Setting} options={{ title: '내 설정', headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ title: '회원가입', headerShown: false }} />
          <Stack.Screen name="Password_Change" component={Password_Change} options={{ title: '비밀번호변경' , headerShown: false  }} />
          <Stack.Screen name="Voice_range_check" component={Voice_range_check} options={{ title: '음역대 적합 여부 판단', headerShown: false }} />
          <Stack.Screen name="Voice_range_test" component={Voice_range_test} options={{ title: '음역대 테스트', headerShown: false }} />
          <Stack.Screen name="Inquiry_form" component={Inquiry_form} options={{ title: '문의 글쓰기', headerShown: false }} />
          <Stack.Screen name="Inquiry_list" component={Inquiry_list} options={{ title: '문의글 리스트', headerShown: false }} />
          <Stack.Screen name="Song_detail" component={Song_detail} options={{ title: '곡 정보', headerShown: false  }} />
          <Stack.Screen name="Song_search" component={Song_search} options={{ title: '곡 검색', headerShown: false }} />
          <Stack.Screen name="FAQ" component={FAQ} options={{ title: 'FAQ', headerShown: false }} />
          <Stack.Screen name="Song_list" component={Song_list} options={{ title: '곡 목록', headerShown: false }} />
          <Stack.Screen name="Profile_change" component={Profile_change} options={{ title: '프로필 변경' ,headerShown: false  }} />
          <Stack.Screen name="Profile" component={Profile} options={{ title: '프로필 정보', headerShown: false  }} />
          <Stack.Screen name="Howto2" component={Howto2} options={{ title: '앱 사용법 2', headerShown: false }} />
          <Stack.Screen name="Howto3" component={Howto3} options={{ title: '앱 사용법 3', headerShown: false }} />
          <Stack.Screen name="Howto4" component={Howto4} options={{ title: '앱 사용법 4', headerShown: false }} />
          <Stack.Screen name="Howto5" component={Howto5} options={{ title: '앱 사용법 5', headerShown: false }} />
          <Stack.Screen name="Jazz" component={Jazz} options={{ title: '재즈', headerShown: false}} />
          <Stack.Screen name="Ballad" component={Ballad} options={{ title: '발라드', headerShown: false}} />
          <Stack.Screen name="Hiphop" component={Hiphop} options={{ title: '힙합', headerShown: false}} />
          <Stack.Screen name="Trot" component={Trot} options={{ title: '트로트', headerShown: false}} />
          <Stack.Screen name="osusume" component={osusume} options={{ title: '추천' , headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
