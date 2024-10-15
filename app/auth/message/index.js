import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function ConversationScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', content: '1500 lang boss!', sender: 'user', type: 'text' },
    { id: '2', content: 'Magkano yung banga boss?', sender: 'other', type: 'text' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = (content, type = 'text') => {
    if (content) {
      setMessages([{ id: Date.now().toString(), content, sender: 'user', type }, ...messages]);
      setNewMessage('');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      sendMessage(result.assets[0].uri, 'image');
    }
  };

  const renderMessage = ({ item }) => (
    <Animated.View 
      style={[
        styles.messageContainer, 
        item.sender === 'user' ? styles.userMessage : styles.otherMessage,
        { opacity: fadeAnim }
      ]}
    >
      {item.type === 'text' ? (
        <Text style={styles.messageText}>{item.content}</Text>
      ) : (
        <Image source={{ uri: item.content }} style={styles.messageImage} />
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/449981890_1575169576393143_1393559107253070735_n.jpg' }} 
            style={styles.profilePicture}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Ronnie Bulauan</Text>
            <Text style={styles.activeStatus}>Active Now</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#069906" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(newMessage)}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#069906',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  activeStatus: {
    fontSize: 14,
    color: '#d0d0d0',
  },
  arrowButton: {
    marginRight: 15,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#069906',
    borderBottomLeftRadius: 20,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#808080',
    borderBottomRightRadius: 20,
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 20,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  attachButton: {
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
