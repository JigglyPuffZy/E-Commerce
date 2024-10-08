import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

export default function SellerDashboard() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const ordersFadeAnim = useRef(new Animated.Value(0)).current;

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [5000, 8000, 6000, 7000, 9000, 10000] }],
  };

  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [20, 35, 28, 40, 55, 60] }],
  };

  const toggleModal = (anim, setVisible) => {
    if (modalVisible) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#069906', '#045d04']} style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/auth/sellersettings')} style={styles.settingsButton}>
          <FontAwesome5 name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sales Summary</Text>
          <LineChart
            data={salesData}
            width={screenWidth * 0.85}
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.summaryBox}>
            <SummaryItem icon="chart-line" text="Total Sales: ₱ 10,000" />
            <SummaryItem icon="shopping-cart" text="Orders: 120" />
            <SummaryItem icon="money-bill-wave" text="Revenue: ₱ 8,000" />
          </View>
          <TouchableOpacity onPress={() => toggleModal(fadeAnim, setModalVisible)} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Show Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orders</Text>
          <LineChart
            data={ordersData}
            width={screenWidth * 0.85}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.summaryBox}>
            <SummaryItem icon="clock" text="Pending Orders: 5" />
            <SummaryItem icon="shipping-fast" text="Shipped Orders: 100" />
            <SummaryItem icon="check-circle" text="Delivered Orders: 15" />
          </View>
          <TouchableOpacity onPress={() => toggleModal(ordersFadeAnim, setOrdersModalVisible)} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Show Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <ActionButton icon="eye" text="View Products" onPress={() => router.push('auth/viewproducts')} />
            <ActionButton icon="list" text="My Orders" onPress={() => router.push('auth/myorder')} />
          </View>
        </View>
      </ScrollView>

      <DetailModal
        visible={modalVisible}
        onClose={() => toggleModal(fadeAnim, setModalVisible)}
        fadeAnim={fadeAnim}
        title="Sales Details"
        details={[
          'January: ₱ 5000 (20 Orders)',
          'February: ₱ 8000 (35 Orders)',
          'March: ₱ 6000 (28 Orders)',
          'April: ₱ 7000 (40 Orders)',
          'May: ₱ 9000 (55 Orders)',
          'June: ₱ 10000 (60 Orders)',
        ]}
      />

      <DetailModal
        visible={ordersModalVisible}
        onClose={() => toggleModal(ordersFadeAnim, setOrdersModalVisible)}
        fadeAnim={ordersFadeAnim}
        title="Orders Details"
        details={[
          'Pending Orders: 5',
          'Shipped Orders: 100',
          'Delivered Orders: 15',
        ]}
      />
    </SafeAreaView>
  );
}

const SummaryItem = ({ icon, text }) => (
  <View style={styles.summaryItem}>
    <FontAwesome5 name={icon} size={24} color="#069906" />
    <Text style={styles.summaryText}>{text}</Text>
  </View>
);

const ActionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionButton}>
    <FontAwesome5 name={icon} size={18} color="#fff" />
    <Text style={styles.actionButtonText}>{text}</Text>
  </TouchableOpacity>
);

const DetailModal = ({ visible, onClose, fadeAnim, title, details }) => (
  <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome5 name="times" size={24} color="#069906" />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalText}>Here are the details:</Text>
        <View style={styles.detailsContainer}>
          {details.map((detail, index) => (
            <Text key={index} style={styles.detailText}>- {detail}</Text>
          ))}
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Modal>
);

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(6, 153, 6, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
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
    padding: 10,
    borderRadius: 10,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '90%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#069906',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryBox: {
    marginTop: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    marginLeft: 10,
  },
  modalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#069906',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#069906',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
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
    borderRadius: 16,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#069906',
  },
  modalText: {
    marginVertical: 10,
    fontSize: 16,
  },
  detailsContainer: {
    marginVertical: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#069906',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
