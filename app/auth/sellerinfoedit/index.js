import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SellerInfo() {
  const initialSellerInfo = {
    shopName: 'Viah Store',
    lastName: 'Saquing',
    firstName: 'Viah',
    midName: 'L.',
    email: 'viahsaquing@gmail.com',
    phone: '0917-123-4567',
    address: 'Santa Maria, Isabela'
  };

  const [sellerInfo, setSellerInfo] = useState(initialSellerInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleBackButtonPress = () => {
    router.back();
  };

  const handleSaveButtonPress = () => {
    console.log(sellerInfo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const updateField = (field, value) => {
    setSellerInfo(prev => ({ ...prev, [field]: value }));
  };

  const infoFields = [
    { icon: 'store', label: 'Shop Name', field: 'shopName' },
    { icon: 'user', label: 'Last Name', field: 'lastName' },
    { icon: 'user', label: 'First Name', field: 'firstName' },
    { icon: 'user', label: 'Middle Name', field: 'midName' },
    { icon: 'envelope', label: 'Email', field: 'email', keyboardType: 'email-address' },
    { icon: 'phone', label: 'Phone Number', field: 'phone', keyboardType: 'phone-pad' },
    { icon: 'map-marker-alt', label: 'Address', field: 'address' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#069906', '#34D399']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
          <FontAwesome5 name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Seller Profile</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            {infoFields.map((item, index) => (
              <View key={index} style={styles.infoGroup}>
                <FontAwesome5 name={item.icon} size={20} color="#069906" />
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={sellerInfo[item.field]}
                    onChangeText={(value) => updateField(item.field, value)}
                    placeholder={`Enter ${item.label}`}
                    placeholderTextColor="#999"
                    keyboardType={item.keyboardType || 'default'}
                  />
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveButtonPress}>
            <LinearGradient
              colors={['#069906', '#34D399']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Info</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome5 name="check-circle" size={50} color="#069906" />
            <Text style={styles.modalText}>Saved successfully!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#069906',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
