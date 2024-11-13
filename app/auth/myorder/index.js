import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, Modal, RefreshControl, Animated, TextInput, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
    proof: null,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [uploadingProof, setUploadingProof] = useState(false);

  const filteredOrders = orders.filter(order =>
    (activeFilter === 'All' || order.status === activeFilter) &&
    (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery) ||
      order.total.includes(searchQuery) ||
      order.date.includes(searchQuery))
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
    setSearchQuery('');
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
    } else {
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
      setUploadingProof(false);
    } else {
      setUploadingProof(false);
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
      <Animated.View style={[styles.orderCard, { transform: [{ scale: scaleValue }] }]} >
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
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Upload Proof of Delivery</Text>
            <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
              <Text style={styles.modalButtonText}>
                {uploadingProof ? 'Uploading...' : 'Select Image'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#FF5733' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showConfirmationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you sure you want to mark this order as delivered?</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => moveOrder(selectedOrder.id, 'Delivered')}
            >
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#FF5733' }]}
              onPress={() => setShowConfirmationModal(false)}
            >
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    height: 150,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 10,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    left:40,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  summaryContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  summaryGradient: {
    padding: 16,
    borderRadius: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  orderCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#fff',
  },
  pending: {
    backgroundColor: '#f39c12',
  },
  shipped: {
    backgroundColor: '#3498db',
  },
  delivered: {
    backgroundColor: '#2ecc71',
  },
  orderItems: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  proofContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  proofText: {
    fontSize: 14,
    color: '#555',
  },
  proofImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width - 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default SellerOrders;
