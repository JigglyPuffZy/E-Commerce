import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure you have expo-linear-gradient installed

const orders = [
  {
    id: '1',
    date: '2024-10-01',
    total: '₱150.00',
    status: 'Pending',
    items: 3,
  },
  {
    id: '2',
    date: '2024-10-02',
    total: '₱200.00',
    status: 'Shipped',
    items: 5,
  },
  {
    id: '3',
    date: '2024-10-03',
    total: '₱300.00',
    status: 'Delivered',
    items: 2,
  },
];

const MyOrders = () => {
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => console.log(`Order ID: ${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>Total: {item.total}</Text>
        <View style={[styles.orderStatusContainer, item.status === 'Delivered' ? styles.delivered : styles.pending]}>
          <Ionicons name={item.status === 'Delivered' ? 'checkmark-circle-outline' : 'time-outline'} size={16} color="#FFFFFF" />
          <Text style={styles.orderStatus}>{item.status}</Text>
        </View>
        <Text style={styles.orderItems}>Items: {item.items}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={28} color="#FFFFFF" style={styles.icon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <View style={styles.buttonBar}>
        {['Shipped', 'Cancelled', 'Return/Refund'].map((label) => (
          <TouchableOpacity key={label} style={styles.button}>
            <LinearGradient
              colors={['#3DBA4C', '#069906']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>{label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.orderList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#069906',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    borderRadius: 25,
    elevation: 4,
    overflow: 'hidden',
    width: '30%',
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  orderList: {
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#069906',
  },
  orderDate: {
    fontSize: 14,
    color: '#777',
  },
  orderDetails: {
    marginTop: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#069906',
  },
  orderStatusContainer: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginVertical: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.9,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  pending: {
    backgroundColor: '#FF6347', // Red for Pending
  },
  delivered: {
    backgroundColor: '#4CAF50', // Green for Delivered
  },
  orderItems: {
    fontSize: 16,
    color: '#777',
  },
  icon: {
    marginLeft: 10,
    backgroundColor: '#069906',
    borderRadius: 50,
    padding: 8,
    elevation: 3,
    position: 'absolute',
    right: 10,
    top: 20,
  },
});

export default MyOrders;
