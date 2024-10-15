import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const EditAddress = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [address, setAddress] = useState({
    streetName: '',
    name: '',
    phone: '',
    houseNumber: '',
    floor: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (key, value) => {
    setAddress(prevState => ({ ...prevState, [key]: value }));
  };

  const handleSaveAddress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const renderInput = (key, icon) => (
    <View key={key} style={styles.inputContainer}>
      <MaterialIcons name={icon} size={24} color="#069906" style={styles.inputIcon} />
      <TextInput
        placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
        style={styles.input}
        value={address[key]}
        onChangeText={(text) => handleInputChange(key, text)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#069906" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Edit Address</Text>
          <Text style={styles.subtitle}>Customize your delivery location</Text>

          {renderInput('streetName', 'location-on')}
          {renderInput('name', 'person')}
          {renderInput('phone', 'phone')}
          {renderInput('houseNumber', 'home')}
          {renderInput('floor', 'layers')}
          {renderInput('city', 'location-city')}
          {renderInput('postalCode', 'markunread-mailbox')}

          <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButtonContainer}>
            <LinearGradient
              colors={['#069906', '#047104']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save Address</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#069906" />
            <Text style={styles.modalText}>Address Saved Successfully!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Great</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    padding: 15,
    borderRadius: 12,
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
    width: 300,
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#069906',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditAddress;
