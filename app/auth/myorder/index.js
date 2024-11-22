import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, Modal, RefreshControl, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const initialOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    date: '2024-11-15',
    total: '₱1,250.00',
    status: 'Pending',
    items: 3,
    image: 'https://via.placeholder.com/70',
    proof: null,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    date: '2024-11-14',
    total: '₱800.00',
    status: 'Shipped',
    items: 2,
    image: 'https://via.placeholder.com/70',
    proof: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    customerName: 'Mark Johnson',
    date: '2024-11-13',
    total: '₱1,500.00',
    status: 'Delivered',
    items: 5,
    image: 'https://via.placeholder.com/70',
    proof: 'https://via.placeholder.com/150',
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
      <Animated.View style={[styles.orderCard, { transform: [{ scale: scaleValue }] }]} key={item.id}>
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
      case 'Pending':
        return styles.pending;
      default:
        return {};
    }
  };

  return (
    <SafeAreaView style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <LinearGradient
        colors={['#069906', '#0b7a0e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
      </LinearGradient>

      <View style={styles.tabBar}>
        {['All', 'Pending', 'Shipped', 'Delivered'].map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => handleFilterPress(status)}
            style={[styles.tab, activeFilter === status && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeFilter === status && styles.activeTabText]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

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

      {modalVisible && (
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          transparent
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Upload Proof of Delivery</Text>
              <Text style={styles.modalDescription}>Please upload an image of the proof of delivery</Text>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Select Image</Text>
              </TouchableOpacity>
              {imageSelected && (
                <Image source={{ uri: orders.find(order => order.id === selectedOrder.id)?.proof }} style={styles.previewImage} />
              )}
              <TouchableOpacity onPress={handleSendClick} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send Proof</Text>
              </TouchableOpacity>
              {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            </View>
          </View>
        </Modal>
      )}

      {showConfirmationModal && (
        <Modal
          visible={showConfirmationModal}
          onRequestClose={() => setShowConfirmationModal(false)}
          transparent
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to mark this order as shipped?</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => moveOrder(selectedOrder.id, 'Shipped')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowConfirmationModal(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },
  activeTab: {
    backgroundColor: '#069906',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  summaryContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  summaryGradient: {
    borderRadius: 10,
    padding: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryValue: {
    fontSize: 16,
    color: '#000',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  orderCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  orderCardContent: {
    flexDirection: 'row',
    padding: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderId: {
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#777',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTotal: {
    fontWeight: 'bold',
  },
  orderStatusContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  orderStatus: {
    color: '#fff',
  },
  delivered: {
    backgroundColor: '#28a745',
  },
  shipped: {
    backgroundColor: '#ffc107',
  },
  pending: {
    backgroundColor: '#dc3545',
  },
  orderItems: {
    fontSize: 14,
    color: '#777',
  },
  proofContainer: {
    marginTop: 10,
  },
  proofText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  proofImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Dark overlay with a more subtle effect
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,  // Rounded corners for a soft look
    padding: 25,
    width: width - 50,  // Ensure it doesn't touch the screen edges
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',  // Darker color for the title
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',  // Slightly lighter color for description
  },
  uploadButton: {
    backgroundColor: '#069906',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',  // Full-width button for better interaction
    alignItems: 'center',
    elevation: 3,  // Shadow effect for the button
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#069906',
    padding: 14,
    borderRadius: 10,
    width: '48%',  // Slightly smaller width for button balance
    alignItems: 'center',
    elevation: 3,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 10,  // Rounded corners for the image
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#069906',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 3,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SellerOrders;
