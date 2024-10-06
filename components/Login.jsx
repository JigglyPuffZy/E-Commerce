import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';


const Colors = {
  background: '#f8f8f8',
  text: '#333',
  buttonBackground: '#069305',
  buttonText: '#ffffff',
};

export default function Login() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [animationCompleted, setAnimationCompleted] = useState(false);

  
  const handleGetStarted = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationCompleted(true);
      router.push('auth/sign-in');
    });
  };

  if (animationCompleted) {
    return null; // You can replace this with your splash screen or a loading screen.
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./../assets/images/login.png')}
          style={styles.image}
        />
      </View>
      <View>
        <Text style={styles.title}>
        Empowering our community, one banga at a time. Together, let us discover, connect and thrive in the world of unique bangas.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Let's Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 220,
    height: 500,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
    marginTop: 60,
  },
  title: {
    fontSize: 15,
    fontFamily: 'serif',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    color: Colors.text,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 5,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 18,
    fontWeight: 'Poppins-medium',
    textAlign: 'center',
  },
});
