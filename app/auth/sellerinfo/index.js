import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, StatusBar, RefreshControl } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SellerInfo() {
  const [sellerInfo, setSellerInfo] = useState({
    shopName: "Viah's Shop",
    firstName: 'Viah',
    lastName: 'Saquing',
    midName: 'Cruz',
    email: 'viahsaquing@gmail.com',
    contactNo: '0917-123-4567',
    address: 'Santa Maria, Isabela',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleBackButtonPress = () => {
    router.back();
  };

  const handleEditButtonPress = () => {
    router.push('/auth/sellerinfoedit', { params: sellerInfo });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#069906" />
      <LinearGradient
        colors={['#069906', '#45c745']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Seller Info</Text>
      </LinearGradient>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#069906"
          />
        }
      >
        <View style={styles.content}>
          {Object.entries(sellerInfo).map(([key, value], index) => (
            <InfoCard
              key={key}
              icon={getIconForKey(key)}
              label={formatLabel(key)}
              value={value}
              index={index}
            />
          ))}
        </View>
      </Animated.ScrollView>
      
      <TouchableOpacity style={styles.fab} onPress={handleEditButtonPress}>
        <FontAwesome name="edit" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const InfoCard = ({ icon, label, value, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <FontAwesome5 name={icon} size={24} color="#069906" />
      <View style={styles.cardContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.infoText}>{value}</Text>
      </View>
    </Animated.View>
  );
};

const getIconForKey = (key) => {
  const iconMap = {
    shopName: "store",
    firstName: "user",
    lastName: "user",
    midName: "user",
    email: "envelope",
    contactNo: "phone",
    address: "map-marker",
  };
  return iconMap[key] || "info-circle";
};

const formatLabel = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContainer: {
    padding: 16,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#069906',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
