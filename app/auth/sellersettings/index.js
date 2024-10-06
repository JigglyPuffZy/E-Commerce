import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Settings() {
  const [modalVisible, setModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false); // New state for logout confirmation
  const router = useRouter();
  const [opacity] = useState(new Animated.Value(0));

  const handleLogout = () => {
    setLogoutConfirmVisible(true); // Show confirmation modal instead
  };

  const handleConfirmLogout = () => {
    setLogoutConfirmVisible(false);
    setModalVisible(true); // Show the logout success modal
  };

  const handleCancelLogout = () => {
    setLogoutConfirmVisible(false); // Close confirmation modal
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    router.push('auth/sign-in');
  };

  const handleBackButtonPress = () => {
    router.back();
  };

  const animateModal = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (modalVisible || saveModalVisible || logoutConfirmVisible) {
      animateModal();
    }
  }, [modalVisible, saveModalVisible, logoutConfirmVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.listContainer}>
          <TouchableOpacity onPress={() => router.push('auth/changepass')} style={styles.listItem}>
            <Text style={styles.listItemText}>Change Password</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('auth/contactus')} style={styles.listItem}>
            <Text style={styles.listItemText}>Contact Us</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>

          {/* Seller Info Button */}
          <TouchableOpacity onPress={() => router.push('auth/sellerinfo')} style={styles.listItem}>
            <Text style={styles.listItemText}>Seller Info</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Logout Confirmation Modal */}
        <Modal transparent={true} animationType="fade" visible={logoutConfirmVisible} onRequestClose={handleCancelLogout}>
          <SafeAreaView style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity }]}>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleConfirmLogout}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleCancelLogout}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </SafeAreaView>
        </Modal>

        {/* Logout Modal */}
        <Modal transparent={true} animationType="fade" visible={modalVisible} onRequestClose={handleCloseModal}>
          <SafeAreaView style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity }]}>
              <Text style={styles.modalText}>Successfully logged out</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        </Modal>

        {/* Save Changes Modal */}
        <Modal transparent={true} animationType="fade" visible={saveModalVisible} onRequestClose={() => setSaveModalVisible(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity }]}>
              <Text style={styles.modalText}>Successfully saved changes</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setSaveModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#069906', // Background color for the back button
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#069906',
    marginLeft: 12,
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemText: {
    fontSize: 18,
    color: '#3D3D3D',
  },
  arrow: {
    fontSize: 18,
    color: '#069906',
  },
  logoutText: {
    color: '#D95D5D',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 6,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#069906',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
