import HomeHeader from '@/components/HomeHeader';
import { useProductStore } from '@/store/productStore';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';



export default function HomeScreen() {
  const [ featuredProducts, setFeatureProducts] = useState<Product[]>([]);
  const { products, categories, fetchProducts, fetchCategories, loading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {

  },[]);

  return (
      
      <View>
        <HomeHeader/>
        <Text>index</Text>
      </View>
  );
}

// const styles = StyleSheet.create({
//   },
// });
