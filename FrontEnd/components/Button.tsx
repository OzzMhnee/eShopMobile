import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { AppColors } from '@/constants/theme'

interface ButtonProps {
    title: string;
    onPress: () => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    accessibilityLabel?: string;
    accessibilityRole?: 'button' | 'link' | 'header' | 'image' | 'text' | 'none' | undefined;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    testID?: string;
}

/**
 * Composant Button réutilisable, optimisé pour la performance et l'accessibilité.
 * - Utilise useMemo pour les styles.
 * - Utilise useCallback pour l'action onPress.
 * - Supporte les icônes à gauche/droite, le loading, le testID pour les tests.
 * - Désactive le bouton si loading ou disabled.
 */
const Button:React.FC<ButtonProps> = ({
    title, onPress, accessibilityLabel, accessibilityRole = 'button',
    size='medium',
    variant="primary",
    fullWidth=false,
    disabled=false,
    loading=false,
    style,
    textStyle,
    leftIcon,
    rightIcon,
    testID,
}) => {
    // Optimiser la génération des styles avec useMemo
    const buttonStyle = useMemo(() => [
        styles.button,
        styles[size],
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ], [size, variant, fullWidth, disabled, style]);

    const textStyles = useMemo(() => [
        styles.text,
        styles[`${variant}Text`],
        textStyle,
    ], [variant, textStyle]);

    // Empêcher l'action si loading ou disabled
    const handlePress = useCallback(() => {
        if (!disabled && !loading) {
            onPress();
        }
    }, [onPress, disabled, loading]);

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole={accessibilityRole}
            testID={testID}
        >
            {/* Afficher l'icône à gauche si fournie */}   
            {leftIcon && <>{leftIcon}</>}
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === 'primary'
                        ? AppColors.background.primary
                        : AppColors.primary[500]
                    }
                    style={{ marginHorizontal: 4 }}
                />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
            {/* Afficher l'icône à droite si fournie */}
            {rightIcon && <>{rightIcon}</>}
        </TouchableOpacity>
    )
}

export default React.memo(Button);

const styles = StyleSheet.create({
    button : {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 40,
    },
    text : {
        fontWeight: '600',
        fontSize: 16,
    },
    fullWidth : {
        width: '100%',
    },
    disabled : {
        opacity: 0.5,
    },
    //conteneur du bouton
    primary : {
        backgroundColor: AppColors.primary[500],
    },
    secondary : {
        backgroundColor: AppColors.accent[500],
    },
    outline : {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: AppColors.primary[500],
    },
    ghost : {
        backgroundColor: 'transparent',
    },
    //style du bouton
    primaryText : {
        color: AppColors.background.primary,
    },
    secondaryText : {
        color: AppColors.background.primary,
    },
    outlineText : {
        color: AppColors.primary[500],
    },
    ghostText : {
        color: AppColors.primary[500],
    },
    //taille du bouton
    small : {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium : {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large : {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
})                                                                                                                                                                                                                  