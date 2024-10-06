import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SellerInfo() {
  const initialSellerInfo = {
    shopName: "Viah's Shop",
    firstName: 'Viah',
    lastName: 'Saquing',
    midName: 'Cruz',
    email: 'viahsaquing@gmail.com',
    contactNo: '0917-123-4567',
    address: 'Santa Maria, Isabela',
  };

  const [shopName, setShopName] = useState(initialSellerInfo.shopName);
  const [firstName, setFirstName] = useState(initialSellerInfo.firstName);
  const [lastName, setLastName] = useState(initialSellerInfo.lastName);
  const [midName, setMidName] = useState(initialSellerInfo.midName);
  const [email, setEmail] = useState(initialSellerInfo.email);
  const [contactNo, setContactNo] = useState(initialSellerInfo.contactNo);
  const [address, setAddress] = useState(initialSellerInfo.address);

  const router = useRouter();

  const handleBackButtonPress = () => {
    router.back();
  };

  const handleEditButtonPress = () => {
    router.push('/auth/sellerinfoedit', {
      params: { shopName, firstName, lastName, midName, contactNo, email, address },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Seller Info</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoGroup}>
              <FontAwesome5 name="store" size={24} color="#069906" />
              <Text style={styles.label}>Shop Name: </Text>
              <Text style={styles.infoText}>{shopName}</Text>
            </View>

            <View style={styles.infoGroup}>
              <FontAwesome name="user" size={24} color="#069906" />
              <Text style={styles.label}>First Name: </Text>
              <Text style={styles.infoText}>{firstName}</Text>
            </View>

            <View style={styles.infoGroup}>
              <FontAwesome name="user" size={24} color="#069906" />
              <Text style={styles.label}>Last Name: </Text>
              <Text style={styles.infoText}>{lastName}</Text>
            </View>

            <View style={styles.infoGroup}>
              <FontAwesome name="user" size={24} color="#069906" />
              <Text style={styles.label}>Middle Name: </Text>
              <Text style={styles.infoText}>{midName}</Text>
            </View>

            <View style={styles.infoGroup}>
              <FontAwesome name="phone" size={24} color="#069906" />
              <Text style={styles.label}>Contact Number: </Text>
              <Text style={styles.infoText}>{contactNo}</Text>
            </View>

            <View style={styles.infoGroup}>
              <FontAwesome name="envelope" size={24} color="#069906" />
              <Text style={styles.label}>Email: </Text>
              <Text style={styles.infoText}>{email}</Text>
            </View>

            <View style={styles.infoGroup}>
              <FontAwesome name="map-marker" size={24} color="#069906" />
              <Text style={styles.label}>Address: </Text>
              <Text style={styles.infoText}>{address}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditButtonPress}>
            <Text style={styles.editButtonText}>Edit Info</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#069906',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#069906',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  infoGroup: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#069906',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
