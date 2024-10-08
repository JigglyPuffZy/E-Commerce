import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, Modal, RefreshControl, Animated, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const initialOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    date: '2024-10-01',
    total: '₱150.00',
    status: 'Pending',
    items: 3,
    image: 'https://example.com/product1.jpg',
    key: '1',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    date: '2024-10-02',
    total: '₱200.00',
    status: 'Shipped',
    items: 5,
    image: 'https://example.com/product2.jpg',
    key: '2',
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    date: '2024-10-03',
    total: '₱300.00',
    status: 'Delivered',
    items: 2,
    image: 'https://example.com/product3.jpg',
    key: '3',
  },
  {
    id: '4',
    customerName: 'Emily Brown',
    date: '2024-10-04',
    total: '₱250.00',
    status: 'Pending',
    items: 4,
    image: 'https://example.com/product4.jpg',
    key: '4',
  },
  {
    id: '5',
    customerName: 'Alex Wilson',
    date: '2024-10-05',
    total: '₱180.00',
    status: 'Shipped',
    items: 2,
    image: 'https://example.com/product5.jpg',
    key: '5',
  },
];

const SellerOrders = () => {
  const colorScheme = useColorScheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState(initialOrders);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

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
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderOrderItem = ({ item }) => {
    const scaleValue = new Animated.Value(1);
    
    const onPressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
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
          activeOpacity={1}
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
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#069906" style={styles.icon} />
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

  const renderFilterButton = (label) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.filterButton,
        activeFilter === label && styles.activeFilterButton
      ]}
      onPress={() => handleFilterPress(label)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === label && styles.activeFilterButtonText
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient
        colors={colorScheme === 'dark' ? ['#1E1E1E', '#2A2A2A'] : ['#069906', '#3DBA4C']}
        style={styles.header}
      >
        <Text style={styles.title}>Seller Orders</Text>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color={colorScheme === 'dark' ? '#FFFFFF' : '#069906'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setActiveFilter('All');
            }}
          />
        </View>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Orders</Text>
          <Text style={styles.summaryValue}>{summaryData.totalOrders}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
          <Text style={styles.summaryValue}>₱{summaryData.totalRevenue}</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Pending', 'Shipped', 'Delivered', 'Cancel/Refund'].map(renderFilterButton)}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.orderList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={100} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedOrder && (
              <>
                <Text style={styles.modalText}>Order #{selectedOrder.id}</Text>
                <Text style={styles.modalText}>Customer: {selectedOrder.customerName}</Text>
                <Text style={styles.modalText}>Total: {selectedOrder.total}</Text>
                <Text style={styles.modalText}>Status: {selectedOrder.status}</Text>
              </>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
              {selectedOrder && selectedOrder.status === 'Pending' && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => moveOrder(selectedOrder.id, 'Shipped')}
                >
                  <Text style={styles.modalButtonText}>Mark as Shipped</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#333333',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#069906',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#F0F4F8',
  },
  activeFilterButton: {
    backgroundColor: '#069906',
  },
  filterButtonText: {
    color: '#069906',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  orderList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#069906',
  },
  orderStatusContainer: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pending: {
    backgroundColor: '#FFA500',
  },
  shipped: {
    backgroundColor: '#4169E1',
  },
  delivered: {
    backgroundColor: '#32CD32',
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#069906',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#F0F4F8',
  },
  confirmButton: {
    backgroundColor: '#069906',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SellerOrders;
