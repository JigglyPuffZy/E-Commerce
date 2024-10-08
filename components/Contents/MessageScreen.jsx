import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const messages = [
  { 
    id: '1', 
    name: 'Ronnie Bulauan', 
    lastMessage: 'Ano size netong Banga boss?', 
    timestamp: '10:30 AM', 
    profilePic: 'https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/449981890_1575169576393143_1393559107253070735_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGJlmm0bjKEsd1NVOugEkCeDRfONeGNz3QNF8414Y3PdAqjwVNsVSqMEMVEy6KAXNlsYshNVpf65e1qNgPOFdnx&_nc_ohc=dAxytuuaW0cQ7kNvgHVj9Js&_nc_ht=scontent.fmnl17-2.fna&oh=00_AYBB5FhtNQOPxpwu_TQuDSyA_NDCqujHFKDOOyLAyGgbcA&oe=66CA4CE2' 
  },
  // Add more sample messages here if needed
];

const MessageItem = ({ name, lastMessage, timestamp, profilePic, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.messageItem}>
    <Image source={{ uri: profilePic }} style={styles.profilePic} />
    <View style={styles.messageContent}>
      <Text style={styles.messageName}>{name}</Text>
      <Text style={styles.messageText} numberOfLines={1}>{lastMessage}</Text>
    </View>
    <Text style={styles.messageTimestamp}>{timestamp}</Text>
  </TouchableOpacity>
);

export default function MessageScreen() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <MessageItem
      name={item.name}
      lastMessage={item.lastMessage}
      timestamp={item.timestamp}
      profilePic={item.profilePic}
      onPress={() => router.push('auth/message')}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#069906', '#05770c']}
        style={styles.header}
      >
        <FontAwesome5 name="envelope" size={24} color="#ffffff" />
        <Text style={styles.headerText}>Messages</Text>
      </LinearGradient>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 20,
  },
  headerText: {
    marginLeft: 15,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
});
