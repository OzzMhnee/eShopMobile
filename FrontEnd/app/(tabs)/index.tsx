import HomeHeader from '@/components/HomeHeader';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/type';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LoadingSpinner from '@/components/LoadingSpinner'
import ProductCard from '@/components/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [ featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { products, categories, fetchProducts, fetchCategories, loading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const reverseProducts = [...products].reverse();
      setFeaturedProducts(reverseProducts as Product[]);
    }
  },[products]);

  const navigateToCategory = (category: string) => {
    router.push({
      pathname: '/(tabs)/shop',
      params: { 
        category 
      },
    });
  }

  if(loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <LoadingSpinner fullscreen />
        </View>
      </SafeAreaView>
    )
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <View style={styles.wrapper}>
      <HomeHeader/>
      <View style={styles.categoriesSection}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainerView}
        >
          {/* Section des catégories de produits */}
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Catégories</Text>
            </View>
            {/* Scroll horizontal des catégories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {categories?.map((category) => (
                <TouchableOpacity
                  style= {styles.categoryButton}
                  key={category}
                  onPress={()=>navigateToCategory(category)}
                >
                  <AntDesign 
                    name="tag"
                    size={16}
                    color={AppColors.primary[500]}
                  />
                  <Text style={styles.categoryText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Section Meilleurs Ventes */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text  style={styles.sectionTitle}>Meilleures ventes</Text>
              <TouchableOpacity
              // onPress={() => navigateToAllProducts(products)}
              >
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {/* Horizontal liste des produits vedette */}
            <Flatlist 
            data={featuredProducts}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showHorizontalScrollIndicator = {false}
            contentContainerStyle = {styles.featuredProductContainer}
            renderItem={({item}) => (
              <View style = {styles.featuredProductContainer}>
                <ProductCard product={item} compact />
              </View>
            )}
            />
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper : {
    backgroundColor: AppColors.background.primary
  },
  container : {
    flex: 1,
    backgroundColor: AppColors.background.primary
  },
  contentContainer: {},
  scrollContainerView : {
    paddingBottom: 300,
  },
  errorContainer : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  categoriesSection : {
    marginTop: 10,
    marginBottom: 16
  },
  categoryButton : {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 5,
    minWidth: 100
  },
  categoryText : {
    marginLeft : 6,
    fontFamily : 'Inter-Medium',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 20
  },
  sectionHeader : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 20
  },
  sectionTitle : {
    fontFamily : 'Inter-Medium',
    fontSize: 14,
    color: AppColors.primary[500]
  },
  seeAllText : {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.primary[500]
  },
  errorText : {
    fontFamily : 'Inter-Medium',
    fontSize: 16,
    color : AppColors.error,
    textAlign : 'center',
  },
  productContainer : {},
  productsGrid : {},
  newestSection : {},
  productGrid : {},
  featuredProductsContainer : {},
  featuredProductContainer : {},
  featuredSection : {
    marginVertical: 16,
  },
});
