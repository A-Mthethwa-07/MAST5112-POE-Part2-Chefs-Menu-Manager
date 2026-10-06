import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  const successTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimer.current) {
        clearTimeout(successTimer.current);
      }
    };
  }, []);

  const handleAddDish = () => {
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = dishName.trim();
    const trimmedDescription = description.trim();
    const trimmedPrice = price.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter a valid dish name.');
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage('Please provide a brief description of the dish.');
      return;
    }

    if (!trimmedPrice) {
      setErrorMessage('Please enter a price.');
      return;
    }

    // Accept whole numbers or prices with one or two decimal places.
    // This prevents values such as "12abc" from being accepted.
    const pricePattern = /^\d+(\.\d{1,2})?$/;

    if (!pricePattern.test(trimmedPrice)) {
      setErrorMessage('Please enter a valid positive numerical price.');
      return;
    }

    const parsedPrice = Number(trimmedPrice);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Please enter a valid positive numerical price.');
      return;
    }

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dishName: trimmedName,
      description: trimmedDescription,
      course,
      price: parsedPrice.toFixed(2),
    };

    setMenuItems((previousItems) => [newItem, ...previousItems]);

    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');

    setSuccessMessage(`"${newItem.dishName}" was added to the menu.`);

    if (successTimer.current) {
      clearTimeout(successTimer.current);
    }

    successTimer.current = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F5F7" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>Chef's Menu Manager</Text>
            <Text style={styles.appSubtitle}>Christoffel's Kitchen</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Add New Dish</Text>

            {errorMessage ? (
              <View style={styles.errorBox} accessibilityRole="alert">
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBox} accessibilityRole="alert">
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Creamy Mushroom Pasta"
              value={dishName}
              onChangeText={setDishName}
              accessibilityLabel="Dish name"
              returnKeyType="next"
            />

            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Tagliatelle with garlic, herbs and wild mushrooms"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="Dish description"
            />

            <Text style={styles.inputLabel}>Course *</Text>
            <View style={styles.courseSelectorContainer}>
              {COURSES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.courseOption,
                    course === item && styles.courseOptionSelected,
                  ]}
                  onPress={() => setCourse(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item}`}
                  accessibilityState={{ selected: course === item }}
                >
                  <Text
                    style={[
                      styles.courseOptionText,
                      course === item && styles.courseOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Price *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 14.50"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              accessibilityLabel="Dish price"
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddDish}
              accessibilityRole="button"
              accessibilityLabel="Add item to menu"
            >
              <Text style={styles.addButtonText}>Add Item to Menu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>
              Current Menu Items ({menuItems.length})
            </Text>

            {menuItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No menu items added yet.</Text>
                <Text style={styles.emptySubtitle}>
                  Fill out the form above to build today's restaurant menu.
                </Text>
              </View>
            ) : (
              menuItems.map((item) => (
                <View key={item.id} style={styles.menuCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.dishTitle}>{item.dishName}</Text>
                    <Text style={styles.dishPrice}>{item.price}</Text>
                  </View>

                  <View style={styles.badgeContainer}>
                    <Text style={styles.courseBadge}>{item.course}</Text>
                  </View>

                  <Text style={styles.dishDescription}>
                    {item.description}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  headerContainer: { marginBottom: 20, alignItems: 'center' },
  appTitle: { fontSize: 26, fontWeight: '700', color: '#1E293B' },
  appSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 14,
  },

  textArea: { minHeight: 70 },

  courseSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  courseOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },

  courseOptionSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },

  courseOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  courseOptionTextSelected: { color: '#FFFFFF' },

  addButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },

  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '500',
  },

  successBox: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },

  successText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '500',
  },

  menuContainer: { marginTop: 8 },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },

  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dishTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },

  dishPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 8,
  },

  badgeContainer: {
    alignSelf: 'flex-start',
    marginVertical: 6,
  },

  courseBadge: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },

  dishDescription: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
});
