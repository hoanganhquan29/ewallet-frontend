import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { register } from '../api/authApi'
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
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
      await register({ email, phone, password })
      Alert.alert('Success', 'Account created successfully')
      navigation.navigate('Login')
    } catch (err) {
      Alert.alert(
        'Register failed',
        err.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <Image source={logo} style={styles.logo} />
              </View>
              <Text style={styles.headerSubtitle}>Join us today</Text>
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.description}>
                Start your digital journey with the most secure wallet.
              </Text>
            </View>

            {/* FORM SECTION */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  placeholder="example@mail.com"
                  placeholderTextColor="#AEAEB2"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  placeholder="090 123 4567"
                  placeholderTextColor="#AEAEB2"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#AEAEB2"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#AEAEB2"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {/* ACTION BUTTON */}
              <TouchableOpacity
                style={[styles.registerButton, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.registerButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* FOOTER */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("Login")}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  logoWrapper: {
    backgroundColor: "#F2F2F7",
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: "#636366",
    marginTop: 8,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C1C1E",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    height: 54,
    backgroundColor: "#F9F9F9",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  registerButton: {
    backgroundColor: "#000000",
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loginLink: {
    marginTop: 28,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  loginHighlight: {
    color: "#000000",
    fontWeight: "700",
  },
});