import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const storedProducts = await AsyncStorage.getItem('products');
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                const validProducts = parsedProducts.filter(product => product && product.id);
                setProducts(validProducts);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (!productId) {
            console.error('Invalid product ID:', productId);
            Alert.alert("Error", "Unable to delete product. Invalid product ID.");
            return;
        }
    
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
    
        try {
            await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
            console.log('Product deleted successfully');
        } catch (error) {
            console.error('Error saving updated products:', error);
            Alert.alert("Error", "Failed to save changes. Please try again.");
        }
    };
    

    const handleImagePress = (images) => {
        setSelectedImages(images);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImages([]);
        setCurrentIndex(0);
    };

    const renderProductItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => handleImagePress(item.images)}>
                <Image 
                    source={{ uri: item.images && item.images[0] }}
                    style={styles.productImage} 
                    onError={() => console.log('Image load error')}
                />
            </TouchableOpacity>
            <View style={styles.cardContent}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        onPress={() => router.push({ pathname: 'auth/editproduct', params: { productId: item.id } })}
                        style={styles.editButton}
                    >
                        <FontAwesome5 name="edit" size={16} color="#fff" />
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleDelete(item.id)} 
                        style={styles.deleteButton}
                    >
                        <FontAwesome5 name="trash-alt" size={16} color="#fff" />
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Products</Text>
                <TouchableOpacity 
                    onPress={() => router.push('auth/addproduct')}
                    style={styles.addButton}
                >
                    <FontAwesome5 name="plus" size={16} color="#069906" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.main}
            />
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Carousel
                            loop
                            width={400}
                            height={600}
                            autoPlay={false}
                            data={selectedImages}
                            scrollAnimationDuration={300}
                            onSnapToItem={(index) => setCurrentIndex(index)}
                            renderItem={({ item, index }) => (
                                <Image key={index.toString()} source={{ uri: item }} style={styles.fullscreenImage} resizeMode="contain" />
                            )}
                        />
                        <View style={styles.imageIndexContainer}>
                            <Text style={styles.imageIndexText}>{`${currentIndex + 1} of ${selectedImages.length}`}</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <FontAwesome5 name="times" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#069906',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        color: '#069906',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    main: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#069906',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    editButton: {
        backgroundColor: '#069906',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 140,
        position: 'relative',
    },
    fullscreenImage: {
        width: '100%',
        height: '90%',
    },
    imageIndexContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    imageIndexText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 20,
    },
});
