import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSignIn = () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (selectedRole === 'buyer') {
      router.push('auth/home');
    } else if (selectedRole === 'seller') {
      router.push('auth/seller');
    } else {
      setErrorMessage('Please select a role.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <LinearGradient
            colors={['#069906', '#34D399']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Feather
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.label}>Select your role:</Text>
              <View style={styles.roleSelectionRow}>
                <TouchableOpacity
                  style={[styles.roleButton, selectedRole === 'buyer' && styles.selectedRole]}
                  onPress={() => setSelectedRole('buyer')}
                >
                  <Feather name="user" size={20} color={selectedRole === 'buyer' ? '#069906' : '#6B7280'} />
                  <Text style={[styles.roleLabel, selectedRole === 'buyer' && styles.selectedRoleText]}>Buyer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, selectedRole === 'seller' && styles.selectedRole]}
                  onPress={() => setSelectedRole('seller')}
                >
                  <Feather name="shopping-bag" size={20} color={selectedRole === 'seller' ? '#069906' : '#6B7280'} />
                  <Text style={[styles.roleLabel, selectedRole === 'seller' && styles.selectedRoleText]}>Seller</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
              <LinearGradient
                colors={['#069906', '#34D399']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInButtonGradient}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('auth/sign-up')}
              style={styles.createAccountButton}
            >
              <Text style={styles.createAccountButtonText}>Create an Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
  },
  errorMessage: {
    color: '#E11D48',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  roleContainer: {
    width: '100%',
    marginBottom: 30,
  },
  roleSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedRole: {
    backgroundColor: '#DCFCE7',
    borderColor: '#069906',
    borderWidth: 1,
  },
  roleLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  selectedRoleText: {
    color: '#069906',
  },
  signInButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  signInButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  createAccountButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createAccountButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#069906',
  },
});
