import { Product } from '@/type';
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import CommonHeader from '@/components/CommonHeader';
import { AppColors } from '@/constants/theme';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getProduct } from '@/lib/api';
import { useFavoritesStore } from '@/store/favoriteStore';
import Toast from 'react-native-toast-message';
import { useCartStore } from '@/store/cartStore';
const {width} = Dimensions.get("window");

const SingleProductScreen = () => {
  
  const { id } = useLocalSearchParams < { id : string } > ();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const isFav = isFavorite(product?.id);
  const { isFavorite ,toggleFavorite} = useFavoritesStore();
  const idNum = Number(id);
  console.log( 'id', id );



  useEffect(()=> {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await getProduct(idNum);
        setProduct(data);
      } catch (error) {
        setError("Not able de fetch data's product");
        console.log("Not able de fetch data's product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    if (id) {fetchProductData();}
  },[id])
  console.log('Product Data : ', product)

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product);
    }
  }


  if (loading) {
    return (
    <View style={{flex: 1, alignItems:'center', justifyContent: 'center'}}>
      <LoadingSpinner fullScreen/>
    </View>
    );
  }

  return (
    <View style={styles.headerContainerStyle}>
      <CommonHeader isFav={isFav} handleToggleFavorite={handleToggleFavorite} />
      <Text>SingleProductScreen</Text>
    </View>
  )
}

export default SingleProductScreen

const styles = StyleSheet.create({
  headerContainerStyle: {
    paddingTop: 30,
    backgroundColor: AppColors.background.primary,
  },
})