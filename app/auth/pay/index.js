import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const initialPaymentData = [
  { id: '1', name: 'Item 1', price: '₱239.00', image: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg', description: 'Banga ng Aso', quantity: 4 },
  { id: '2', name: 'Item 2', price: '₱200.00', discountedPrice: '₱180.00', image: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg', description: 'Banga ng Pusa', quantity: 1 },
];

export default function ToProcessScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const reasons = ["Wrong shipping address", "Changed my mind", "Ordered by mistake", "Found a better price"];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>To Process</Text>
      </View>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        </View>
      </View>
      <Text style={styles.originalPrice}>{item.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton}>
          <FontAwesome name="envelope" size={16} color="#fff" />
          <Text style={styles.buttonText}> Contact Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => {
            setItemToRemove(item.id);
            setModalVisible(true);
          }}
        >
          <FontAwesome name="times" size={16} color="#fff" />
          <Text style={styles.buttonText}> Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleRemoveItem = () => {
    if (itemToRemove && selectedReason) {
      setPaymentData(paymentData.filter(item => item.id !== itemToRemove));
      setItemToRemove(null);
      setSelectedReason('');
      setModalVisible(false);
    }
  };

  const totalAmount = paymentData.reduce((total, item) => total + (parseFloat(item.price.replace('₱', '').replace(/,/g, '')) * item.quantity), 0);
  const itemCount = paymentData.reduce((count, item) => count + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>To Process</Text>
      </View>
      <FlatList
        data={paymentData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Item Count:</Text>
          <Text style={styles.summaryValueText}>{itemCount}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Subtotal:</Text>
          <Text style={styles.summaryValueText}>₱{totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Total:</Text>
          <Text style={styles.totalText}>₱{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Enhanced Modal for Cancel Confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Why are you cancelling?</Text>
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonOption}
                onPress={() => setSelectedReason(reason)}
              >
                <FontAwesome 
                  name={selectedReason === reason ? "dot-circle-o" : "circle-o"} 
                  size={20} 
                  color="#069906" 
                />
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButtonYes} onPress={handleRemoveItem}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Pressable>
              <Pressable style={styles.modalButtonNo} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#069906',
    elevation: 4,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#069906',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#888',
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33A853',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#069906',
    borderRadius: 8,
    justifyContent: 'center',
    elevation: 2,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  summaryContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
  },
  summaryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabelText: {
    fontSize: 16,
    color: '#555',
  },
  summaryValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#33A853',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reasonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonYes: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#069906',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonNo: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
