import HomeHeader from '@/components/HomeHeader';
import Wrapper from '@/components/Wrapper';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/type';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LoadingSpinner from '@/components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';



export default function HomeScreen() {
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

  if(!loading) {
    return (
      <Wrapper>
        <LoadingSpinner fullscreen />
      </Wrapper>
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
      <Text>index</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: AppColors.background.primary
  },
  errorContainer : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText : {
    fontFamily : 'Inter-Medium',
    fontSize: 16,
    color : AppColors.error,
    textAlign : 'center'
  },
  wrapper : {
    
  }
});
