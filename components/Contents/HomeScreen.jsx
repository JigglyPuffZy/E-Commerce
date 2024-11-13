import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.9;

const products = [
  { id: '1', name: 'BANGA Premium', description: 'Gourmet Dog Food', price: 125, rating: 5, reviews: 10, image: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' },
  { id: '2', name: 'BANGA Deluxe', description: 'Organic Dog Treats', price: 195, rating: 5, reviews: 10, image: 'https://placehold.co/300x400' },
  { id: '3', name: 'BANGA Classic', description: 'Everyday Dog Meal', price: 145, rating: 5, reviews: 2, image: 'https://placehold.co/300x400' },
  { id: '4', name: 'BANGA Puppy', description: 'Puppy Growth Formula', price: 180, rating: 4, reviews: 5, image: 'https://placehold.co/300x400' },
  { id: '5', name: 'BANGA Senior', description: 'Senior Dog Nutrition', price: 200, rating: 3, reviews: 7, image: 'https://placehold.co/300x400' },
];

export default function Content() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(text.toLowerCase()) ||
      product.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push('auth/products')}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
        <View style={styles.infoContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.subText}>{item.description}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₱{item.price}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name={i < item.rating ? "star" : "star-outline"} size={18} color="#FFD700" />
              ))}
              <Text style={styles.reviewCount}>({item.reviews})</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending Products</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Item added to cart!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    width: ITEM_WIDTH,
    height: 350,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  infoContainer: {
    justifyContent: 'flex-end',
  },
  itemTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    marginLeft: 6,
    fontSize: 16,
    color: '#e0e0e0',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
