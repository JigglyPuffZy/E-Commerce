import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

export default function SellerDashboard() {
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [ordersFadeAnim] = useState(new Animated.Value(0));

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [5000, 8000, 6000, 7000, 9000, 10000] }],
  };

  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [20, 35, 28, 40, 55, 60] }],
  };

  const toggleModal = () => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    } else {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleOrdersModal = () => {
    if (ordersModalVisible) {
      Animated.timing(ordersFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setOrdersModalVisible(false));
    } else {
      setOrdersModalVisible(true);
      Animated.timing(ordersFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/auth/sellersettings')} style={styles.settingsButton}>
          <FontAwesome name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Sales Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>
          <BarChart
            data={salesData}
            width={screenWidth * 0.85}
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={styles.chart}
          />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Total Sales: ₱ 10,000</Text>
            <Text style={styles.summaryText}>Orders: 120</Text>
            <Text style={styles.summaryText}>Revenue: ₱ 8,000</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Show Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for Sales Detailed Information */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sales Details</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <FontAwesome name="times" size={24} color="#069906" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>Here are the details of your sales:</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>- January: ₱ 5000 (20 Orders)</Text>
                <Text style={styles.detailText}>- February: ₱ 8000 (35 Orders)</Text>
                <Text style={styles.detailText}>- March: ₱ 6000 (28 Orders)</Text>
                <Text style={styles.detailText}>- April: ₱ 7000 (40 Orders)</Text>
                <Text style={styles.detailText}>- May: ₱ 9000 (55 Orders)</Text>
                <Text style={styles.detailText}>- June: ₱ 10000 (60 Orders)</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <BarChart
            data={ordersData}
            width={screenWidth * 0.85}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={styles.chart}
          />
          <View style={styles.orderBox}>
            <Text style={styles.orderText}>Pending Orders: 5</Text>
            <Text style={styles.orderText}>Shipped Orders: 100</Text>
            <Text style={styles.orderText}>Delivered Orders: 15</Text>
            <TouchableOpacity onPress={toggleOrdersModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Show Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for Orders Detailed Information */}
        <Modal
          animationType="none"
          transparent={true}
          visible={ordersModalVisible}
          onRequestClose={toggleOrdersModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: ordersFadeAnim }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Orders Details</Text>
                <TouchableOpacity onPress={toggleOrdersModal}>
                  <FontAwesome name="times" size={24} color="#069906" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>Here are the details of your orders:</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>- Pending Orders: 5</Text>
                <Text style={styles.detailText}>- Shipped Orders: 100</Text>
                <Text style={styles.detailText}>- Delivered Orders: 15</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={toggleOrdersModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => router.push('auth/viewproducts')}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="eye" size={18} color="#fff" />
              <Text style={styles.actionButtonText}> View Product</Text>
            </TouchableOpacity>
            {/* New My Orders Button */}
            <TouchableOpacity
              onPress={() => router.push('auth/myorder')}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="list" size={18} color="#fff" />
              <Text style={styles.actionButtonText}> My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barRadius: 8,
  barPercentage: 0.6,
  style: {
    borderRadius: 16,
    paddingVertical: 5,
    marginVertical: 10,
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: '#e3e3e3',
  },
  fillShadowGradientFrom: '#069906',
  fillShadowGradientFromOpacity: 0.5,
  fillShadowGradientTo: '#069906',
  fillShadowGradientToOpacity: 0.5,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#069906',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 10,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '90%',
    elevation: 2,
    top:20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryBox: {
    marginTop: 10,
    alignItems: 'center',
    
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#069906',
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#069906',
  },
  modalText: {
    marginVertical: 10,
  },
  detailsContainer: {
    marginVertical: 10,
  },
  detailText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#069906',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  orderBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  orderText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
