import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function OrderHistory() {
  const navigation = useNavigation();
  const router = useRouter(); 

  const orders = [
    {
      id: '1',
      image: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg', 
      name: 'Banga ng Aso',
      description: '2pcs',
      quantity: 'x1',
      price: '₱70',
      total: '₱140',
      status: 'Completed',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Order History</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={[styles.statusBadge, { backgroundColor: order.status === 'Completed' ? '#4CAF50' : '#FF5722' }]}>{order.status}</Text>
              </View>
              <View style={styles.orderContent}>
                <Image source={{ uri: order.image }} style={styles.productImage} />
                <View style={styles.orderDetails}>
                  <Text style={styles.productName}>{order.name}</Text>
                  <Text style={styles.productDescription}>{order.description}</Text>
                  <Text style={styles.productQuantity}>{order.quantity}</Text>
                  <Text style={styles.productPrice}>{order.price}</Text>
                  <Text style={styles.totalPrice}>Total 1 item: {order.total}</Text>
                </View>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  onPress={() => router.push('auth/products')} 
                  style={styles.buyAgainButton}
                >
                  <Text style={styles.buttonText}>Buy Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#069906',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 14,
  },
  backButton: {
    paddingRight: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderContent: {
    flexDirection: 'row',
    marginTop: 10,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    resizeMode: 'cover',
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 14,
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  buyAgainButton: {
    backgroundColor: '#069906',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});