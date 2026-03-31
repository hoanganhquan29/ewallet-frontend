import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native'
import { register } from '../api/authApi'
import { Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    // validation
    if (!email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    try {
      setLoading(true)

      await register({
        email,
        phone,
        password
      })

      Alert.alert('Success', 'Account created successfully')

      navigation.navigate('Login')
    } catch (err) {
      console.log(err.response?.data)

      Alert.alert(
        'Register failed',
        err.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>
    </View>

    {/* EMAIL */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
    </View>

    {/* PHONE */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Phone"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
    </View>

    {/* PASSWORD */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>

    {/* CONFIRM PASSWORD */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
    </View>

    {/* BUTTON */}
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.6 }]}
      onPress={handleRegister}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>Register</Text>
      )}
    </TouchableOpacity>

    {/* LINK */}
    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
      <Text style={styles.link}>
        Already have an account? Login
      </Text>
    </TouchableOpacity>

  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },

  subtitle: {
    color: COLORS.secondary,
    marginTop: 5,
  },

  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    paddingHorizontal: 12,
  },

  input: {
    height: 50,
    color: COLORS.primary,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: COLORS.secondary,
  },
});