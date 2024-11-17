import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, Modal, RefreshControl, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const initialOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    date: '2024-10-01',
    total: '₱150.00',
    status: 'Pending',
    items: 3,
    image: 'https://via.placeholder.com/70',
    proof: null,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    date: '2024-10-02',
    total: '₱200.00',
    status: 'Shipped',
    items: 5,
    image: 'https://via.placeholder.com/70',
    proof: null,
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    date: '2024-10-03',
    total: '₱300.00',
    status: 'Delivered',
    items: 2,
    image: 'https://via.placeholder.com/70',
    proof: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    customerName: 'Emily Brown',
    date: '2024-10-04',
    total: '₱250.00',
    status: 'Pending',
    items: 4,
    image: 'https://via.placeholder.com/70',
    proof: null,
  },
  {
    id: '5',
    customerName: 'Alex Wilson',
    date: '2024-10-05',
    total: '₱180.00',
    status: 'Shipped',
    items: 2,
    image: 'https://via.placeholder.com/70',
    proof: null,
  },
];

const SellerOrders = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState(initialOrders);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [uploadingProof, setUploadingProof] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredOrders = orders.filter(order =>
    (activeFilter === 'All' || order.status === activeFilter)
  );

  useEffect(() => {
    calculateSummary();
  }, [orders]);

  const calculateSummary = () => {
    const total = orders.length;
    const revenue = orders.reduce((sum, order) => sum + parseFloat(order.total.replace('₱', '')), 0);
    setSummaryData({ totalOrders: total, totalRevenue: revenue.toFixed(2) });
  };

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
  };

  const moveOrder = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setModalVisible(false);
    setShowConfirmationModal(false);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    if (order.status === 'Pending') {
      setShowConfirmationModal(true);
    } else if (order.status === 'Shipped') {
      setModalVisible(true);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedOrders = orders.map(order =>
        order.id === selectedOrder.id ? { ...order, proof: result.assets[0].uri } : order
      );
      setOrders(updatedOrders);
      setImageSelected(true);
      setErrorMessage('');
    } else {
      setImageSelected(false);
    }
  };

  const handleSendClick = () => {
    if (!imageSelected) {
      setErrorMessage('Please upload an image before sending.');
    } else {
      moveOrder(selectedOrder.id, 'Delivered');
      setModalVisible(false);
    }
  };

  const renderOrderItem = ({ item }) => {
    const scaleValue = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={[styles.orderCard, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity
          onPress={() => openModal(item)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.orderCardContent}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.orderInfo}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
              </View>
              <Text style={styles.customerName}>{item.customerName}</Text>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTotal}>{item.total}</Text>
                <View style={[styles.orderStatusContainer, getStatusStyle(item.status)]}>
                  <Text style={styles.orderStatus}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.orderItems}>{item.items} items</Text>
              {item.status === 'Delivered' && item.proof && (
                <View style={styles.proofContainer}>
                  <Text style={styles.proofText}>Proof of Delivery:</Text>
                  <Image source={{ uri: item.proof }} style={styles.proofImage} />
                </View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return styles.delivered;
      case 'Shipped':
        return styles.shipped;
      default:
        return styles.pending;
    }
  };

  return (
    <SafeAreaView style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.summaryGradient}
        >
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Orders</Text>
            <Text style={styles.summaryValue}>{summaryData.totalOrders}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
            <Text style={styles.summaryValue}>₱{summaryData.totalRevenue}</Text>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {selectedOrder && (
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Upload Proof of Delivery</Text>
            <Text style={styles.modalMessage}>Please upload the proof of delivery image.</Text>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleSendClick}
                disabled={!imageSelected}
                style={[
                  styles.sendButton,
                  { backgroundColor: imageSelected ? '#069906' : '#cccccc' },
                ]}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showConfirmationModal && selectedOrder && (
        <Modal visible={showConfirmationModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Order Status</Text>
            <Text style={styles.modalMessage}>Are you sure you want to mark this order as Shipped?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => moveOrder(selectedOrder.id, 'Shipped')}
                style={styles.sendButton}
              >
                <Text style={styles.sendButtonText}>Yes, Mark as Shipped</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowConfirmationModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>No, Keep Pending</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#222',
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#333',
    elevation: 3,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 5,
  },
  summaryContainer: {
    marginHorizontal: 15,
    paddingVertical: 20,
  },
  summaryGradient: {
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Inter',
  },
  summaryValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
    opacity: 0.7,
  },
  orderCard: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  orderCardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
  },
  orderDate: {
    color: '#777',
    fontSize: 14,
  },
  customerName: {
    fontWeight: '600',
    fontSize: 20,
    marginVertical: 5,
    color: '#333',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  orderTotal: {
    fontSize: 18,
    color: '#069906',
    fontWeight: '600',
  },
  orderStatusContainer: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    backgroundColor: '#2196F3',
  },
  orderStatus: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  orderItems: {
    fontSize: 16,
    color: '#555',
  },
  proofContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  proofText: {
    fontSize: 15,
    color: '#777',
  },
  proofImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 15,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  delivered: {
    backgroundColor: '#4CAF50',
  },
  shipped: {
    backgroundColor: '#FF9800',
  },
  pending: {
    backgroundColor: '#2196F3',
  },

  // Updated modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', // Subtle transparent overlay
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  // Add slight shadow to elevate the modal
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#069906',
    paddingVertical: 14,
    borderRadius: 50,
    marginVertical: 25,
    alignItems: 'center',
    elevation: 4,
    width: '100%',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sendButton: {
    backgroundColor: '#069906',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SellerOrders;
