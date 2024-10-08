import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const items = [
    { id: 1, name: "Premium Dog Bowl", price: 67.00, originalPrice: 77.00, image: 'https://example.com/dog-bowl.jpg' },
    { id: 2, name: "Luxury Cat Feeder", price: 46.00, originalPrice: 65.00, image: 'https://example.com/cat-feeder.jpg' },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shippingFee = 50.00;
  const total = subtotal + shippingFee;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome5 name="chevron-left" size={24} color="#4a90e2" />
      </TouchableOpacity>
      <Text style={styles.header}>Checkout</Text>
    </View>
  );

  const renderAddress = () => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>Delivery Address</Text>
      <View style={styles.addressContainer}>
        <FontAwesome5 name="map-marker-alt" size={20} color="#4a90e2" style={styles.icon} />
        <View style={styles.addressDetails}>
          <Text style={styles.boldText}>Sally Gatan</Text>
          <Text style={styles.addressText}>Purok 6, Mozzozzin sur, Santa Maria Isabela</Text>
          <Text style={styles.addressText}>Mobile: +96-012 3445 44</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('auth/addressselection')} style={styles.editButton}>
          <FontAwesome5 name="edit" size={16} color="#4a90e2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItems = () => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>Order Summary</Text>
      {items.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.mutedText}>Variation: {item.name.includes('Dog') ? 'For Dogs' : 'For Cats'}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>₱{item.price.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>₱{item.originalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      ))}
      <Text style={styles.totalOrderText}>Total Items: {items.length}</Text>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>Payment Method</Text>
      <View style={styles.paymentMethodsContainer}>
        {['COD', 'GCash'].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentMethodButton,
              selectedPaymentMethod === method && styles.paymentMethodButtonSelected
            ]}
            onPress={() => setSelectedPaymentMethod(method)}
          >
            <FontAwesome5 
              name={method === 'COD' ? 'money-bill-wave' : 'mobile-alt'} 
              size={20} 
              color={selectedPaymentMethod === method ? '#fff' : '#4a90e2'} 
            />
            <Text style={[
              styles.paymentMethodText,
              selectedPaymentMethod === method && styles.paymentMethodTextSelected
            ]}>{method === 'COD' ? 'Cash on Delivery' : 'GCash'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summarySection}>
      {[
        { label: 'Subtotal', value: subtotal },
        { label: 'Shipping Fee', value: shippingFee },
        { label: 'Total', value: total, isBold: true }
      ].map((item, index) => (
        <View key={index} style={styles.summaryItem}>
          <Text style={item.isBold ? styles.boldText : styles.mutedText}>{item.label}</Text>
          <Text style={item.isBold ? [styles.boldText, styles.totalAmount] : styles.mutedText}>₱{item.value.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#f0f8ff', '#e6f3ff']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          {renderHeader()}
          {renderAddress()}
          {renderItems()}
          {renderPaymentMethods()}
          {renderSummary()}
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.checkoutButtonText}>Place Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <BlurView intensity={100} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FontAwesome5 name="shopping-cart" size={50} color="#4a90e2" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalMessage}>Are you ready to complete your purchase?</Text>
            <View style={styles.modalButtonContainer}>
              {['Confirm', 'Cancel'].map((option) => (
                <TouchableOpacity 
                  key={option}
                  style={[styles.modalButton, option === 'Cancel' && styles.modalButtonSecondary]}
                  onPress={() => {
                    setModalVisible(false);
                    if (option === 'Confirm') router.push('auth/pay');
                  }}
                >
                  <Text style={[styles.modalButtonText, option === 'Cancel' && styles.modalButtonTextSecondary]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  section: {
    marginBottom: 25,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  addressContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
    alignSelf: 'center',
  },
  addressDetails: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
    marginBottom: 5,
  },
  addressText: {
    color: '#666',
    marginBottom: 2,
  },
  editButton: {
    padding: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  mutedText: {
    color: '#888',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  totalOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a90e2',
    marginTop: 10,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodButtonSelected: {
    backgroundColor: '#4a90e2',
  },
  paymentMethodText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  paymentMethodTextSelected: {
    color: '#fff',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalAmount: {
    color: '#4a90e2',
    fontSize: 18,
  },
  checkoutButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextSecondary: {
    color: '#4a90e2',
  },
});
