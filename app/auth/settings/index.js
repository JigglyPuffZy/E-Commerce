import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings() {
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const router = useRouter();
  const [opacity] = useState(new Animated.Value(0));

  const handleLogout = () => setLogoutConfirmVisible(true);
  const handleConfirmLogout = () => {
    setLogoutConfirmVisible(false);
    setModalVisible(true);
  };
  const handleCancelLogout = () => setLogoutConfirmVisible(false);
  const handleCloseModal = () => {
    setModalVisible(false);
    router.push('auth/sign-in');
  };
  const handleBackButtonPress = () => router.back();

  const animateModal = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (modalVisible || logoutConfirmVisible) animateModal();
  }, [modalVisible, logoutConfirmVisible]);

  const SettingItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.listItemContent}>
        <FontAwesome5 name={icon} size={20} color="#069906" />
        <Text style={styles.listItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#069906" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#069906', '#05700500']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={styles.listContainer}>
          <SettingItem icon="key" title="Change Password" onPress={() => router.push('auth/changepass')} />
          <SettingItem icon="envelope" title="Contact Us" onPress={() => router.push('auth/contactus')} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent={true} animationType="fade" visible={logoutConfirmVisible} onRequestClose={handleCancelLogout}>
        <SafeAreaView style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity }]}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Modal>

      <Modal transparent={true} animationType="fade" visible={modalVisible} onRequestClose={handleCloseModal}>
        <SafeAreaView style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity }]}>
            <FontAwesome5 name="check-circle" size={50} color="#069906" style={styles.modalIcon} />
            <Text style={styles.modalText}>Successfully logged out</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D95D5D',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 6,
  },
  modalIcon: {
    marginBottom: 20,
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
  confirmButton: {
    backgroundColor: '#069906',
  },
  cancelButton: {
    backgroundColor: '#D95D5D',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
