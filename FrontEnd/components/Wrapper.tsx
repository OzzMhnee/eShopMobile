import { 
  Platform, 
  StyleSheet,
  View }
  from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppColors } from '@/constants/theme'

const Wrapper = ( { children } : {children: React.ReactNode} ) => {
  // React.ReactNode est le type le plus large pour tout ce qui peut être rendu par React (string, number, JSX, fragment, tableau, etc).
  // Cela permet à TypeScript de vérifier que ce composant reçoit bien des enfants valides pour React, et d’avoir l’autocomplétion et la sécurité de type.
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  )
}

export default Wrapper

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
})