import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AddressSelection() {
  const [selectedValue, setSelectedValue] = useState('jigglypuff');
  const router = useRouter();

  const handleAddAddress = () => {
    router.push('/auth/editaddress');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={24} color="#069906" />
        </TouchableOpacity>
        <Text style={styles.header}>Select Delivery Address</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {['jigglypuff', 'jiggly'].map((value, index) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.addressContainer,
              selectedValue === value && styles.selectedAddressContainer,
            ]}
            onPress={() => setSelectedValue(value)}
          >
            <RadioButton
              value={value}
              status={selectedValue === value ? 'checked' : 'unchecked'}
              color="#069906"
              onPress={() => setSelectedValue(value)}
            />
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>
                {index === 0 ? 'Viah Daquioag' : 'Rosalie Gatan'}
              </Text>
              <Text style={styles.addressPhone}>
                {index === 0 ? '(+63) 906 692 7818' : '(+63) 910 463 3369'}
              </Text>
              <Text style={styles.addressDetail}>
                {index === 0
                  ? 'Purok 6, Mozzozzin North, Santa Maria, Isabela, North Luzon, 3330'
                  : 'Purok 6, Buenavista, Santa Maria, Isabela, North Luzon, 3330'}
              </Text>
              {index === 0 && <Text style={styles.defaultTag}>Default</Text>}
            </View>
            <TouchableOpacity
              onPress={() => router.push('/auth/editaddress')}
              style={styles.editButton}
            >
              <FontAwesome5 name="edit" size={18} color="#069906" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <FontAwesome5 name="plus" size={18} color="#FFFFFF" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedAddressContainer: {
    borderColor: '#069906',
    borderWidth: 2,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  addressPhone: {
    color: '#6B6B6B',
    fontSize: 14,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  defaultTag: {
    fontSize: 12,
    color: '#069906',
    fontWeight: '600',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#069906',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
