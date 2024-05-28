import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';

const faqData = [
  {
    question: "인생에서 가장 어려운 과목은",
    answer: "사이버 보안 캡스톤디자인..",
  },
  {
    question: "Tunemaker 은 어떤 어플인가요?",
    answer: "Tunemaker 은 측정한 음역대 기반으로 노래를 추천하는 앱입니다",
  },
  {
    question: "Tunemaker의 기능을 알려주세요",
    answer: "음역대 테스트기능, 유튜브 기반 음역대 판단 기능, 플레이 리스트 기능, 각각의 노래를 감상 할 수 있는 감상 페이지 기능 등등이 있습니다.",
  },
];

const FAQPage = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderFAQItem = ({ item, index }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleExpanded(index)} style={styles.questionContainer}>
        <Text style={styles.questionText}>{item.question}</Text>
      </TouchableOpacity>
      {expandedIndex === index && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>FAQ</Text>
      <FlatList
        data={faqData}
        renderItem={renderFAQItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

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
    backgroundColor: '#f4e4fc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8c6fc3',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  faqItem: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  questionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dab6f8',
    paddingBottom: 10,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8c6fc3',
  },
  answerContainer: {
    marginTop: 10,
  },
  answerText: {
    fontSize: 16,
    color: '#6e529c',
  },
  fixedMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FAQPage;
