import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient colors={['#069906', '#056705']} style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.header}>Checkout</Text>
    </LinearGradient>
  );

  const renderAddress = () => (
    <TouchableOpacity onPress={() => router.push('auth/addressselection')} style={styles.addressContainer}>
      <LinearGradient colors={['#069906', '#056705']} style={styles.addressIconContainer}>
        <FontAwesome5 name="map-marker-alt" size={20} color="#fff" />
      </LinearGradient>
      <View style={styles.addressDetails}>
        <Text style={styles.addressName}>Sally Gatan</Text>
        <Text style={styles.addressText}>Purok 6, Mozzozzin sur, Santa Maria Isabela</Text>
        <Text style={styles.addressText}>+96-012 3445 44</Text>
      </View>
      <FontAwesome5 name="chevron-right" size={20} color="#069906" />
    </TouchableOpacity>
  );

  const renderItems = () => (
    <View style={styles.itemsContainer}>
      {items.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemVariation}>Variation: {item.name.includes('Dog') ? 'For Dogs' : 'For Cats'}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>₱{item.price.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>₱{item.originalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPaymentMethods = () => (
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
          <LinearGradient
            colors={selectedPaymentMethod === method ? ['#069906', '#056705'] : ['#fff', '#fff']}
            style={styles.paymentMethodGradient}
          >
            <FontAwesome5 
              name={method === 'COD' ? 'money-bill-wave' : 'mobile-alt'} 
              size={24} 
              color={selectedPaymentMethod === method ? '#fff' : '#069906'} 
            />
            <Text style={[
              styles.paymentMethodText,
              selectedPaymentMethod === method && styles.paymentMethodTextSelected
            ]}>{method === 'COD' ? 'Cash on Delivery' : 'GCash'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
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
          <Text style={item.isBold ? styles.summaryLabelBold : styles.summaryLabel}>{item.label}</Text>
          <Text style={item.isBold ? styles.summaryValueBold : styles.summaryValue}>₱{item.value.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.container}>
        {renderAddress()}
        {renderItems()}
        {renderPaymentMethods()}
        {renderSummary()}
      </ScrollView>
      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient colors={['#069906', '#056705']} style={styles.checkoutButtonGradient}>
          <Text style={styles.checkoutButtonText}>Place Order - ₱{total.toFixed(2)}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient colors={['#069906', '#056705']} style={styles.modalIconContainer}>
              <FontAwesome5 name="shopping-cart" size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalMessage}>Ready to complete your purchase?</Text>
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
                  <LinearGradient
                    colors={option === 'Confirm' ? ['#069906', '#056705'] : ['#fff', '#fff']}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={[styles.modalButtonText, option === 'Cancel' && styles.modalButtonTextSecondary]}>{option}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fff0',
  },
  container: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
    color: '#045904',
  },
  addressText: {
    color: '#4b5563',
    fontSize: 14,
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#045904',
  },
  itemVariation: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#069906',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethodButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentMethodGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  paymentMethodText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#069906',
  },
  paymentMethodTextSelected: {
    color: '#fff',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 80,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  summaryValue: {
    fontSize: 16,
    color: '#4b5563',
  },
  summaryLabelBold: {
    fontSize: 18,
    fontWeight: '700',
    color: '#045904',
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: '700',
    color: '#069906',
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#045904',
  },
  modalMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#4b5563',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#069906',
  },
  modalButtonTextSecondary: {
    color: '#069906',
  },
});
