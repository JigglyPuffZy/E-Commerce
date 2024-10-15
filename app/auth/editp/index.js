import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Alert, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfile() {
  const [profilePicture, setProfilePicture] = useState('https://images4.alphacoders.com/125/thumb-1920-1258018.png');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('Male');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [genderOptions] = useState(['Male', 'Female', 'Other']);
  const genderModalAnimation = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const handleSave = () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    setSubmitModalVisible(true);
  };

  const handleEditProfilePicture = () => {
    setModalVisible(true);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
      setModalVisible(false);
    }
  };

  const handleCameraAction = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setGenderModalVisible(false);
  };

  const handleModalOkay = () => {
    setSubmitModalVisible(false);
    navigation.goBack();
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    handleGenderModalClose();
  };

  const handleGenderModalOpen = () => {
    setGenderModalVisible(true);
    Animated.spring(genderModalAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleGenderModalClose = () => {
    Animated.spring(genderModalAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setGenderModalVisible(false));
  };

  const formatDate = (text) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const formatPhone = (text) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  };

  const renderInput = ({ label, value, onChangeText, placeholder, icon, multiline = false, editable = true, onPress = () => {}, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome5 name={icon} size={20} color="#069906" style={styles.inputIcon} />
        {editable ? (
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            multiline={multiline}
            keyboardType={keyboardType}
            editable={editable}
          />
        ) : (
          <TouchableOpacity onPress={onPress} style={styles.input}>
            <Text style={styles.inputText}>{value || placeholder}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#069906', '#34D399']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profilePictureContainer}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          <TouchableOpacity style={styles.editIconContainer} onPress={handleEditProfilePicture}>
            <FontAwesome5 name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {renderInput({ label: 'Name', value: name, onChangeText: setName, placeholder: 'Enter your name', icon: 'user' })}
        {renderInput({ label: 'Bio', value: bio, onChangeText: setBio, placeholder: 'Enter your bio', icon: 'info-circle', multiline: true })}
        {renderInput({ label: 'Gender', value: gender, onPress: handleGenderModalOpen, placeholder: 'Select your gender', icon: 'venus-mars', editable: false })}
        {renderInput({ label: 'Birthday', value: birthday, onChangeText: (text) => setBirthday(formatDate(text)), placeholder: 'MM/DD/YYYY', icon: 'birthday-cake', keyboardType: 'numeric' })}
        {renderInput({ label: 'Phone', value: phone, onChangeText: (text) => setPhone(formatPhone(text)), placeholder: 'Enter your phone', icon: 'phone', keyboardType: 'numeric' })}
        {renderInput({ label: 'Email', value: email, onChangeText: setEmail, placeholder: 'Enter your email', icon: 'envelope' })}
        {renderInput({ label: 'Address', value: address, onChangeText: setAddress, placeholder: 'Enter your address', icon: 'map-marker-alt' })}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={handleCancel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={pickImageFromGallery} style={styles.modalButton}>
              <FontAwesome5 name="images" size={20} color="#fff" style={styles.modalButtonIcon} />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCameraAction} style={styles.modalButton}>
              <FontAwesome5 name="camera" size={20} color="#fff" style={styles.modalButtonIcon} />
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={[styles.modalButton, styles.cancelButton]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={genderModalVisible} animationType="none" onRequestClose={handleGenderModalClose}>
        <Animated.View style={[styles.modalContainer, { opacity: genderModalAnimation }]}>
          <Animated.View style={[styles.genderModalContent, { transform: [{ scale: genderModalAnimation }] }]}>
            <Text style={styles.genderModalTitle}>Select Gender</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity key={option} onPress={() => handleGenderSelect(option)} style={styles.genderOption}>
                <Text style={styles.genderOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handleGenderModalClose} style={[styles.modalButton, styles.cancelButton]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

      <Modal transparent visible={submitModalVisible} animationType="fade" onRequestClose={() => setSubmitModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome5 name="check-circle" size={50} color="#069906" style={styles.successIcon} />
            <Text style={styles.modalMessage}>Profile updated successfully!</Text>
            <TouchableOpacity onPress={handleModalOkay} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    padding: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#069906',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#069906',
    padding: 8,
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#069906',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
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
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#069906',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
  },
  modalButtonIcon: {
    marginRight: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  genderModalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
  },
  genderModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  genderOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333',
  },
  successIcon: {
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
});
