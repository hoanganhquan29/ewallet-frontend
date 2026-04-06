import { useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import { 
  Image, 
  Keyboard, 
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { COLORS, SIZES, SHADOW } from "../theme/theme";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/authApi";
import axios from "axios";
import logo from "../assets/logo.png";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "898280789033-5028hm5o1at98g1ttnrcn5qatohmv8j2.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (!idToken) {
        Alert.alert("Error", "Could not get ID Token");
        return;
      }
      handleGoogleLogin(idToken);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      setLoading(true);
      const res = await axios.post("http://192.168.1.2:8081/api/auth/google", { idToken });
      const token = res.data;
      await AsyncStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      if (decoded.role === "ADMIN") {
        navigation.replace("AdminHome");
      } else {
        navigation.replace("Home");
      }
    } catch (err) {
      Alert.alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      setLoading(true);
      await login({ email, password });
      navigation.navigate("LoginOtp", { email });
    } catch (err) {
      Alert.alert("Error", err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            
            {/* HEADER SECTION */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
              </View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.brandTitle}>E-Wallet</Text>
              <Text style={styles.subtitle}>Sign in to continue your secure digital journey.</Text>
            </View>

            {/* FORM SECTION */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  placeholder="name@domain.com"
                  value={email}
                  onChangeText={(text) => { setEmail(text); setError(""); }}
                  style={styles.input}
                  placeholderTextColor="#AEAEB2"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  secureTextEntry
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholderTextColor="#AEAEB2"
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
              </TouchableOpacity>
            </View>

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* SOCIAL LOGIN */}
            <TouchableOpacity 
              style={styles.googleBtn} 
              onPress={() => promptAsync()}
              activeOpacity={0.7}
            >
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* FOOTER */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("Register")}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                New here? <Text style={styles.registerHighlight}>Create an account</Text>
              </Text>
            </TouchableOpacity>

          </View>
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
  innerContainer: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    backgroundColor: "#F2F2F7",
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#636366",
    marginTop: 8,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C1C1E",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    height: 56,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#000000",
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#AEAEB2",
    fontSize: 12,
    fontWeight: "600",
  },
  googleBtn: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  googleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  registerLink: {
    marginTop: 30,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  registerHighlight: {
    color: "#000",
    fontWeight: "700",
  },
});