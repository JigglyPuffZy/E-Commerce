import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Dimensions } from 'react-native';
import CustomCheckbox from '../../components/checkbox/customcheckbox'; 
import { useRouter } from 'expo-router';

export default function Widget() {
  const [checkedItems, setCheckedItems] = useState({
    item1: { checked: false, quantity: 1 },
    item2: { checked: false, quantity: 1 },
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const router = useRouter();

  const itemPrices = {
    item1: 299.00,
    item2: 399.00,
  };

  const { width, height } = Dimensions.get('window');

  const toggleCheckbox = (itemKey) => {
    setCheckedItems((prev) => {
      const newCheckedItems = {
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          checked: !prev[itemKey].checked,
        },
      };

      const newTotalPrice = Object.keys(newCheckedItems)
        .filter(key => newCheckedItems[key].checked)
        .reduce((sum, key) => sum + itemPrices[key] * newCheckedItems[key].quantity, 0);
        
      setTotalPrice(newTotalPrice);

      return newCheckedItems;
    });
  };

  const changeQuantity = (itemKey, change) => {
    setCheckedItems((prev) => {
      const newQuantity = Math.max(prev[itemKey].quantity + change, 1);
      const newCheckedItems = {
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          quantity: newQuantity,
        },
      };

      const newTotalPrice = Object.keys(newCheckedItems)
        .filter(key => newCheckedItems[key].checked)
        .reduce((sum, key) => sum + itemPrices[key] * newCheckedItems[key].quantity, 0);

      setTotalPrice(newTotalPrice);

      return newCheckedItems;
    });
  };

  const handleCheckout = () => {
    const selectedItemsCount = Object.keys(checkedItems).filter(key => checkedItems[key].checked).length;

    if (selectedItemsCount === 0) {
      Alert.alert(
        'Error',
        'Please check an item before checking out',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      router.push('auth/payment');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingHorizontal: width * 0.05 }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingVertical: height * 0.02 }]}>
        <View style={[styles.card, { paddingHorizontal: width * 0.04 }]}>
          {/* Item 1 */}
          <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <View style={styles.checkboxContainer}>
                <CustomCheckbox
                  isChecked={checkedItems.item1.checked}
                  onCheck={() => toggleCheckbox('item1')}
                />
                <Text style={styles.itemHeaderText}>Banga Shop</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <Image source={{ uri: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>Kainan ng Aso</Text>
                <Text style={styles.itemDescription}>Height 100, Width 30</Text>
                <Text style={styles.itemPrice}>₱{itemPrices.item1.toLocaleString()}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => changeQuantity('item1', -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{checkedItems.item1.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => changeQuantity('item1', 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <View style={styles.checkboxContainer}>
                <CustomCheckbox
                  isChecked={checkedItems.item2.checked}
                  onCheck={() => toggleCheckbox('item2')}
                />
                <Text style={styles.itemHeaderText}>Banga Shop</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <Image source={{ uri: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>Kainan ng Aso</Text>
                <Text style={styles.itemDescription}>Height 100, Width 30</Text>
                <Text style={styles.itemPrice}>₱{itemPrices.item2.toLocaleString()}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => changeQuantity('item2', -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{checkedItems.item2.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => changeQuantity('item2', 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalPrice}>₱{totalPrice.toLocaleString()}</Text>
            </View>
            <TouchableOpacity 
              onPress={handleCheckout}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutText}>Check Out ({Object.keys(checkedItems).filter(key => checkedItems[key].checked).length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top:25,
  },
  itemContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeaderText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#069906',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
