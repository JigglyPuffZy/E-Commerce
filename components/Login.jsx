import React, { useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#2ecc71',
  secondary: '#27ae60',
  background: '#1e272e',
  text: '#ecf0f1',
};

export default function Login() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('auth/sign-in');
    });
  };

  return (
    <ImageBackground
      source={require('./../assets/images/login.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(30, 39, 46, 0.8)', 'rgba(30, 39, 46, 0.95)']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Feather name="shopping-bag" size={80} color={Colors.primary} />
            <Text style={styles.logoText}>BangaMarket</Text>
          </View>
          <Text style={styles.title}>Discover Extraordinary Bangas</Text>
          <Text style={styles.subtitle}>
            Explore a vibrant marketplace of unique finds, connect with passionate sellers, and elevate your shopping experience.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Begin Your Journey</Text>
            <Feather name="arrow-right" size={24} color={Colors.text} />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
    fontFamily: 'Poppins-Bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    opacity: 0.9,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Poppins-Medium',
  },
});
