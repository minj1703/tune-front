import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InquiryList = ({ navigation }) => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch('http://43.200.207.101:8080/admin/inquiry/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken  
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setInquiries(data.map((inquiry, index) => ({
          id: inquiry.id ? inquiry.id.toString() : `temp-id-${index}`,
          title: inquiry.title || '제목 없음',
          status: inquiry.reply ? '답변 완료' : '대기 중',
          contents: inquiry.contents || '내용 없음',
          addTime: inquiry.addTime ? formatDateTime(inquiry.addTime) : '시간 정보 없음'
        })));
      } catch (error) {
        Alert.alert('데이터를 불러오는 데 실패하였습니다.');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    const formattedTime = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const renderHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={[styles.headerText, { flex: 1 }]}>제목</Text>
      <Text style={[styles.headerText, { flex: 1 }]}>답변 상황</Text>
      <Text style={[styles.headerText, { flex: 2 }]}>답변 내용</Text>
      <Text style={[styles.headerText, { flex: 1 }]}>작성 날짜</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inquiryButton} onPress={() => navigation.push('Inquiry_form')}>
        <Text style={styles.buttonText}>문의글 작성</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>문의 현황</Text>
        <FlatList
          data={inquiries}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={[styles.tableRow, styles.tableData]}>
              <Text style={[styles.rowText, styles.cellPadding, { flex: 1 }]}>{item.title}</Text>
              <Text style={[styles.rowText, styles.cellPadding, { flex: 1 }, item.status === '답변 완료' ? styles.answered : styles.pending]}>
                {item.status}
              </Text>
              <Text style={[styles.rowText, styles.cellPadding, { flex: 2 }]}>{item.contents}</Text>
              <Text style={[styles.rowText, styles.cellPadding, { flex: 1 }]}>{item.addTime}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.fixedMenu}>
      
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center'
  },
  inquiryButton: {
    backgroundColor: '#a855f7',
    borderRadius: 8,
    paddingVertical: 14,
    width: '45%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30  
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  flatListContent: {
    width: '100%'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  tableHeader: {
    backgroundColor: '#ede9fe',
  },
  tableData: {
    backgroundColor: '#ffffff'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10
  },
  rowText: {
    fontSize: 14,
    paddingHorizontal: 10
  },
  cellPadding: {
    paddingHorizontal: 10
  },
  answered: {
    color: 'green'
  },
  pending: {
    color: 'orange'
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
    padding: 16,
  },
  menuItemText: {
    textAlign: 'center',
  },
});

export default InquiryList;
