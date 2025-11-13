import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullscreen?: boolean;}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'small',
  color = AppColors.primary[500],
  text = 'Loading',
  fullscreen = false,
}) => {
  if (fullscreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  )
}

export default LoadingSpinner

const styles = StyleSheet.create({
  fullScreen : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : AppColors.background.primary,
  },
  text : {
    marginTop : 8,
    fontSize: 14,
    color : AppColors.text.primary
  },
  container : {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
})