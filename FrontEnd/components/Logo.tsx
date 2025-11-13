import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

const Logo = () => {
  const router = useRouter();
  return (
    // TouchableOpacity Container qui rend son contenu cliquable
    <TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}>
      <MaterialIcons
        name="shopping-cart" 
        size={25} 
        color={AppColors.primary[700]} />
      <Text style={styles.logoText}>Shop&Go</Text>
    </TouchableOpacity>
  )
}

export default Logo

const styles = StyleSheet.create({
  logoView : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  logoText : {
    fontSize : 20,
    marginLeft: 2,
    fontFamily : 'Inter-Bold',
    color : AppColors.primary[700]
  }
})