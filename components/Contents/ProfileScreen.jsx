import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome } from '@expo/vector-icons'; // For chevron-right icon
import { useRouter } from 'expo-router'; // Import the useRouter hook

export default function UserProfile() {
  const router = useRouter(); 
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [fullImageUri, setFullImageUri] = useState(''); // State for full-screen image URI

  const options = [
    { id: '1', title: 'Process', icon: 'wallet', description: 'Processing', count: 3, IconComponent: Entypo },
    { id: '2', title: 'Ship', icon: 'truck', description: 'Track Shipments', count: 5, IconComponent: FontAwesome5 },
    { id: '3', title: 'Receive', icon: 'box', description: 'Manage Receipts', count: 7, IconComponent: Feather },
    { id: '4', title: 'Rate', icon: 'star', description: 'Leave Feedback', count: 12, IconComponent: FontAwesome },
  ];

  const handleNavigation = (id) => {
    console.log('Navigating with ID:', id); // Debugging step
    const routes = {
      '1': 'auth/pay',
      '2': 'auth/ship',
      '3': 'auth/receive',
      '4': 'auth/rate',
    };

    const route = routes[id];
    console.log('Navigating to route:', route); // Debugging step
    if (route) {
      router.push(route);
    } else {
      console.warn(`No route defined for ID: ${id}`);
    }
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity 
      style={styles.optionCard} 
      onPress={() => handleNavigation(item.id)} // Add onPress handler
    >
      <item.IconComponent name={item.icon} size={24} color="#069906" style={styles.optionIcon} />
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{item.title}</Text>
        <Text style={styles.optionDescription}>{item.description}</Text>
      </View>
      <View style={styles.optionCountContainer}>
        <Text style={styles.optionCount}>{item.count}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => {
              setFullImageUri('https://images4.alphacoders.com/125/thumb-1920-1258018.png'); // Set the image URI
              setModalVisible(true); // Show the modal
            }}>
              <Image
                source={{ uri: 'https://images4.alphacoders.com/125/thumb-1920-1258018.png' }} // Replace with a valid image URL
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            <Text style={styles.userName}>Ralph Matthew Punzalan</Text>
            <Text style={styles.userEmail}>ralphmatthewpunzalan1231313@gmail.com</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              onPress={() => router.push('auth/editp')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('auth/order')} 
              style={styles.button}
            >
              <Text style={styles.buttonText}>Order History</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}  // This will hide the scrollbar
      />

      {/* Modal for full screen image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: fullImageUri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 70,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#888',
  },
  optionCountContainer: {
    backgroundColor: '#069906',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  optionCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#069906',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Optional: Semi-transparent background
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});
