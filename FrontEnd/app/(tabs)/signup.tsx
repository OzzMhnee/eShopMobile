import { 
  KeyboardAvoidingView, StyleSheet,
  Text, View, ScrollView, Platform,
  TouchableOpacity
} from 'react-native'
import React, { useState, useCallback } from 'react';
import { Foundation } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';
import Wrapper from '@/components/Wrapper';
import { useRouter } from 'expo-router';
import TextInput from '@/components/TextInput';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';

const SignUpScreen = () => {
  // État du formulaire (email, mot de passe, confirmation)
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  // État des erreurs pour chaque champ
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  // État pour afficher/masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // État pour la force du mot de passe
  const [passwordStrength, setPasswordStrength] = useState<'faible' | 'moyen' | 'fort' | ''>('');

  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();

  // Fonction pour évaluer la force du mot de passe
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    if (score <= 2) return 'faible';
    if (score === 3 || score === 4) return 'moyen';
    if (score === 5) return 'fort';
    return '';
  };

  // Validation optimisée et centralisée
  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    // Vérifier que l'email est renseigné et valide
    if (!form.email.trim()) {
      newErrors.email = 'Email obligatoire';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Adresse email invalide';
      isValid = false;
    }

    // Vérifier que le mot de passe est renseigné et suffisamment fort
    // Renforcer la sécurité : au moins 14 caractères, une majuscule, une minuscule, un chiffre, un caractère spécial
    if (!form.password) {
      newErrors.password = 'Mot de passe obligatoire';
      isValid = false;
    } else if (form.password.length < 14) {
      newErrors.password = 'Le mot de passe doit contenir au moins 14 caractères';
      isValid = false;
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule';
      isValid = false;
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une minuscule';
      isValid = false;
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
      isValid = false;
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins un caractère spécial';
      isValid = false;
    }

    // Vérifier que la confirmation du mot de passe correspond au mot de passe
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form]);

  // Gestion du changement de champ
  const handleChange = useCallback((key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    // Mettre à jour la force du mot de passe en temps réel
    if (key === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  }, []);

  // Gestion de la soumission du formulaire
  const handleSignUp = useCallback(async () => {
    if (validateForm()) {
      await signup(form.email, form.password);
      router.push('./login');
      setForm({ email: '', password: '', confirmPassword: '' });
      setPasswordStrength('');
    }
  }, [form, signup, router, validateForm]);

  return (
    <Wrapper>
      {/* KeyboardAvoidingView permet d'éviter que le clavier masque les champs sur mobile */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ScrollView permet de scroller le formulaire si le clavier est ouvert */}
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* En-tête du formulaire avec logo et titre */}
          <View style={styles.header} >
            <View style={styles.logoContainer} >
              <Foundation 
                name='shopping-cart'
                size={40}
                color={AppColors.primary[500]} />
            </View>
            <Text style={styles.title} >Shop&Go</Text>
            <Text style={styles.subtitle} >Créez un nouveau compte</Text>
          </View>
          {/* Formulaire d'inscription */}
          <View style={styles.form} >
            {/* Afficher l'erreur globale si elle existe (ex: email déjà utilisé) */}
            {error && <Text style={styles.errorText} >{error}</Text>}
            {/* Champ email avec validation et accessibilité */}
            <TextInput
              label='Email'
              value={form.email}
              onChangeText={v => handleChange('email', v)}
              placeholder='Entrez votre email ici ...'
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              error={errors.email}
              accessibilityLabel="Champ email"
            />
            {/* Champ mot de passe avec validation, accessibilité, force et affichage/masquage */}
            <TextInput
              label='Mot de passe'
              value={form.password}
              onChangeText={v => handleChange('password', v)}
              placeholder='Entrez ici votre mot de passe ...'
              error={errors.password}
              secureTextEntry={!showPassword}
              accessibilityLabel="Champ mot de passe"
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  accessibilityLabel={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  accessibilityRole="button"
                >
                  <Text style={{ color: AppColors.primary[500], fontSize: 14 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              }
            />
            {/* Indicateur de force du mot de passe */}
            {form.password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <Text style={[
                  styles.passwordStrength,
                  passwordStrength === 'faible' && { color: 'red' },
                  passwordStrength === 'moyen' && { color: 'orange' },
                  passwordStrength === 'fort' && { color: 'green' },
                ]}>
                  Force du mot de passe : {passwordStrength}
                </Text>
              </View>
            )}
            {/* Champ confirmation mot de passe avec validation, accessibilité et affichage/masquage */}
            <TextInput
              label='Confirmez le mot de passe'
              value={form.confirmPassword}
              onChangeText={v => handleChange('confirmPassword', v)}
              placeholder='Entrez une nouvelle fois votre mot de passe ...'
              error={errors.confirmPassword}
              secureTextEntry={!showConfirm}
              accessibilityLabel="Champ confirmation mot de passe"
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirm((prev) => !prev)}
                  accessibilityLabel={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  accessibilityRole="button"
                >
                  <Text style={{ color: AppColors.primary[500], fontSize: 14 }}>
                    {showConfirm ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              }
            />
            {/* Bouton d'inscription, désactivé si le formulaire n'est pas valide */}
            <Button
              onPress={handleSignUp}
              title='Inscription'
              fullWidth
              loading={isLoading}
              style={styles.button}
              accessibilityLabel="S'inscrire"
              accessibilityRole="button"
              disabled={
                isLoading ||
                !form.email ||
                !form.password ||
                !form.confirmPassword ||
                !!errors.email ||
                !!errors.password ||
                !!errors.confirmPassword ||
                passwordStrength === 'faible'
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor: AppColors.background.primary,
  },
  scrollContainer : {
    flexGrow : 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header : {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer : {
    width : 80,
    height : 80,
    borderRadius : 40,
    backgroundColor : AppColors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title : {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: AppColors.text.primary,
  },
  subtitle : {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color : AppColors.text.secondary,
  },
  form : {
    width: '100%',
  },
  button : {
    marginTop: 16,
  },
  footer : {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText : {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  link : {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: AppColors.primary[500],
    marginLeft: 4,
  },
  errorText : {
    color: AppColors.error,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  passwordStrengthContainer: {
    marginBottom: 8,
    marginTop: -8,
  },
  passwordStrength: {
    fontSize: 13,
    fontWeight: 'bold',
  },
})