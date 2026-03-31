import { useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import { Image } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
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
 console.log("REDIRECT URI:", AuthSession.makeRedirectUri({ useProxy: true }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


const [error, setError] = useState("");
const [request, response, promptAsync] = Google.useAuthRequest({
  /*expoClientId: "898280789033-tt6h5ss47oq5de1fn1f3b6vc338hi4sf.apps.googleusercontent.com",*/
  iosClientId: "898280789033-5028hm5o1at98g1ttnrcn5qatohmv8j2.apps.googleusercontent.com",
  scopes: ["openid", "profile", "email"],
  /*redirectUri: AuthSession.makeRedirectUri({
    useProxy: true,}),*/
   
});

  // 🔥 HANDLE GOOGLE RESPONSE
  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;

      if (!idToken) {
        Alert.alert("Error", "Không lấy được idToken");
        return;
      }

      handleGoogleLogin(idToken);
    }
  }, [response]);

  // 🔥 LOGIN GOOGLE
  const handleGoogleLogin = async (idToken) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://192.168.1.2:8081/api/auth/google",
        { idToken }
      );

      const token = res.data;

      await AsyncStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      if (decoded.role === "ADMIN") {
        navigation.replace("AdminHome");
      } else {
        navigation.replace("Home");
      }
    } catch (err) {
      console.log(err);
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

    // 🔥 CHUYỂN MÀN HÌNH Ở ĐÂY
    navigation.navigate("LoginOtp", { email });

  } catch (err) {
    Alert.alert(
  "Error",
  err.response?.data || "Login failed"
);
  } finally {
    setLoading(false);
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={styles.container}>
    <View style={styles.header}>
  <Image source={logo} style={styles.logo} />

  <Text style={styles.title}>E-Wallet</Text>
  <Text style={styles.subtitle}>Secure Digital Wallet</Text>
</View>

    {/* INPUT EMAIL */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
  setEmail(text);
  setError("");
}}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
      />
    </View>

    {/* INPUT PASSWORD */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
      />
    </View>
{error ? (
  <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
    {error}
  </Text>
) : null}
    {/* LOGIN BUTTON */}
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogin}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>Login</Text>
      )}
    </TouchableOpacity>

    {/* GOOGLE BUTTON */}
    <TouchableOpacity
      style={styles.googleBtn}
      onPress={() => promptAsync()}
    >
      <Text style={styles.googleText}>Continue with Google</Text>
    </TouchableOpacity>

    {/* REGISTER */}
    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
      <Text style={styles.link}>
        Don’t have an account? Register
      </Text>
    </TouchableOpacity>

  </View>
   </TouchableWithoutFeedback>
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
  marginBottom: 10,
},
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.secondary,
    marginBottom: 30,
    textAlign: "center",
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

  googleBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
  },

  googleText: {
    color: COLORS.primary,
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.secondary,
  },
  logoContainer: {
  alignItems: "center",
  marginBottom: 20,
},

logo: {
  width: 90,
  height: 90,
  resizeMode: "contain",
  marginBottom: 10,
},
});