import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateAccount = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      setErrorModalVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setErrorModalVisible(true);
      return;
    }
    setModalVisible(true);
  };

  const handleChange = (text, index) => {
    const newCode = [...verificationCode];
    if (text) {
      newCode[index] = text;
      setVerificationCode(newCode);
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      newCode[index] = '';
      setVerificationCode(newCode);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = () => {
    setLoading(true);
    const enteredCode = verificationCode.join('');
    setTimeout(() => {
      if (enteredCode === '123456') {
        setModalVisible(false);
        router.push('auth/sign-in');
      } else {
        setErrorMessage('Invalid code. Please try again.');
        setErrorModalVisible(true);
      }
      setLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    setResendModalVisible(false);
    Alert.alert('Verification Code', 'A new verification code has been sent to your email.');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#2ecc71', '#27ae60']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Animated.View style={styles.logoContainer}>
            <Ionicons name="leaf-outline" size={80} color="#ffffff" />
            <Text style={styles.logoText}>Banga Shop</Text>
          </Animated.View>

          <Text style={styles.title}>Create Account</Text>

          <BlurView intensity={20} tint="light" style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#ffffff" style={styles.icon} />
              <TextInput
                placeholder="Name"
                style={styles.input}
                placeholderTextColor="#e0e0e0"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#ffffff" style={styles.icon} />
              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#e0e0e0"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#ffffff" style={styles.icon} />
              <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#e0e0e0"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#ffffff" style={styles.icon} />
              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#e0e0e0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity onPress={handleCreateAccount} style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('auth/sign-in')} style={styles.signInLink}>
              <Text style={styles.signInLinkText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </LinearGradient>

      {/* Modal for verification code */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <View style={styles.verificationCodeContainer}>
              {verificationCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => inputRefs.current[index] = ref}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  placeholder="-"
                  placeholderTextColor="#888"
                />
              ))}
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity onPress={handleVerify} style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setResendModalVisible(true)} style={styles.resendButton}>
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={errorModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => setErrorModalVisible(false)} style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Resend Code Modal */}
      <Modal
        visible={resendModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setResendModalVisible(false)}
      >
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resend Verification Code</Text>
            <Text style={styles.modalMessage}>Are you sure you want to resend the verification code?</Text>
            <TouchableOpacity onPress={handleResendCode} style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Yes, Resend</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setResendModalVisible(false)} style={[styles.verifyButton, styles.cancelButton]}>
              <Text style={styles.verifyButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    color: '#ffffff',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  signUpButtonText: {
    color: '#27ae60',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInLinkText: {
    color: '#ffffff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#27ae60',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 15,
  },
  resendButtonText: {
    color: '#27ae60',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  errorModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
});
