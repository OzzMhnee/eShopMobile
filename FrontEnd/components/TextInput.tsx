import { 
  KeyboardTypeOptions, StyleProp,
  StyleSheet, Text, 
  TextStyle, View, 
  ViewStyle, TextInput as RNTextInput
} from 'react-native'
import React from 'react';
import { AppColors } from '@/constants/theme';

/**
 * Props personnalisées pour le composant TextInput.
 * On n'étend PAS TextInputProps pour éviter le conflit de type sur "style".
 * On passe explicitement toutes les props nécessaires.
 */
interface CustomTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: React.ReactNode; // Permet d'afficher un élément à droite du champ (ex: bouton œil)
  accessibilityLabel?: string; // Pour l'accessibilité (lecteurs d'écran)
}

const TextInput: React.FC<CustomTextInputProps> = ({
  value, onChangeText,
  placeholder, label,
  error, secureTextEntry = false,
  keyboardType = "default", autoCapitalize = "sentences",
  autoCorrect = true , multiline = false,
  numberOfLines = 1, style,
  inputStyle, labelStyle,
  rightIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <RNTextInput  
          value={value} 
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          accessibilityLabel={props.accessibilityLabel}
          style={[
            styles.input,
            inputStyle,
            multiline ? styles.multiligneInput : null,
            error ? styles.inputError : null,
            rightIcon ? { paddingRight: 40 } : null
          ]}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export default TextInput

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%"
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: AppColors?.text?.primary ?? '#333',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: AppColors?.background?.secondary ?? '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: AppColors?.gray?.[300] ?? '#ccc',
    color: AppColors?.text?.primary ?? '#333',
    fontSize: 16,
    paddingRight: 10,
  },
  multiligneInput: {
    minHeight: 100,
    textAlignVertical: "top"
  },
  rightIcon: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputError:{
    borderColor: AppColors?.error ?? 'red'
  },
  errorText: {
    color: AppColors?.error ?? 'red',
    fontSize: 12,
    marginTop: 4,
  }
})