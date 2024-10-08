import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ContactUs() {
  const router = useRouter();

  const handlePhonePress = () => {
    Linking.openURL('tel:+639175556789');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:viahdaquioag@gmail.com');
  };

  const handleFacebookPress = () => {
    Linking.openURL('https://www.facebook.com/your-facebook-username');
  };

  const handleInstagramPress = () => {
    Linking.openURL('https://www.instagram.com/your-instagram-username');
  };

  return (
    <LinearGradient colors={['#e8f5e9', '#c8e6c9']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#069906" />
          </TouchableOpacity>
          
          <Animated.View style={styles.card} entering={FadeInDown.duration(500).springify()}>
            <Text style={styles.header}>Contact Us</Text>
            
            <View style={styles.section}>
              <Text style={styles.subHeader}>Get in Touch</Text>
              <Text style={styles.description}>If you have any inquiries, get in touch with us. We'll be happy to help you.</Text>
              
              <View style={styles.contactInfo}>
                <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
                  <View style={styles.contactIconContainer}>
                    <FontAwesome name="phone" size={20} color="#069906" style={styles.contactIcon} />
                  </View>
                  <Text style={styles.contactText}>+63 (917) 555-6789</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                  <View style={styles.contactIconContainer}>
                    <FontAwesome name="envelope" size={20} color="#069906" style={styles.contactIcon} />
                  </View>
                  <Text style={styles.contactText}>viahdaquioag@gmail.com</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.subHeader}>Social Media</Text>
              <View style={styles.socialMediaList}>
                <TouchableOpacity style={styles.socialMediaItem} onPress={handleFacebookPress}>
                  <View style={[styles.socialMediaIconContainer, { backgroundColor: '#1877f2' }]}>
                    <FontAwesome name="facebook" size={20} color="#ffffff" style={styles.socialMediaIcon} />
                  </View>
                  <Text style={styles.socialMediaText}>
                    <Text style={styles.socialMediaTitle}>Facebook:</Text> Viah Saquing Daquioag
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialMediaItem} onPress={handleInstagramPress}>
                  <View style={[styles.socialMediaIconContainer, { backgroundColor: '#e1306c' }]}>
                    <FontAwesome name="instagram" size={20} color="#ffffff" style={styles.socialMediaIcon} />
                  </View>
                  <Text style={styles.socialMediaText}>
                    <Text style={styles.socialMediaTitle}>Instagram:</Text> Viah Saquing Daquioag
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  section: {
    marginTop: 20,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIconContainer: {
    marginRight: 16,
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 50,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  socialMediaList: {
    marginTop: 16,
  },
  socialMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  socialMediaIconContainer: {
    marginRight: 16,
    padding: 8,
    borderRadius: 50,
  },
  socialMediaText: {
    fontSize: 16,
    color: '#555',
  },
  socialMediaTitle: {
    fontWeight: '600',
    color: '#333',
  },
});
