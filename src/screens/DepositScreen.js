import React, { useState } from "react";
import { useEffect } from "react";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { requestDeposit } from "../api/walletApi";
import { COLORS, SIZES, SHADOW } from "../theme/theme";

export default function DepositScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const getReturnUrl = () => {
    const host = Constants.expoConfig?.hostUri;
    return `exp://${host}/--/payment-success`;
  };

  const handleDeposit = async () => {
    const numericAmount = parseInt(amount);

    if (!numericAmount || numericAmount < 1000) {
      Alert.alert("Error", "Minimum amount is 1,000 VND");
      return;
    }

    try {
      setLoading(true);
      const successUrl = getReturnUrl();
      const cancelUrl = successUrl.replace("payment-success", "payment-cancel");

      const res = await requestDeposit({
        amount: numericAmount,
        successUrl,
        cancelUrl,
      });

      Linking.openURL(res.url);
    } catch (err) {
      Alert.alert("Error", "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.headerSubtitle}>Wallet Balance</Text>
              <Text style={styles.headerTitle}>Add Funds</Text>
              <Text style={styles.description}>
                Enter the amount you would like to top up into your digital wallet.
              </Text>
            </View>

            {/* INPUT SECTION */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Amount (VND)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₫</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#AEAEB2"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  selectionColor="#000"
                />
              </View>
              <Text style={styles.helperText}>Minimum deposit: 1,000 ₫</Text>
            </View>

            {/* QUICK SELECT (Optional Add-on for UX) */}
            <View style={styles.quickSelectRow}>
              {[50000, 100000, 200000].map((val) => (
                <TouchableOpacity 
                  key={val} 
                  style={styles.quickBtn}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text style={styles.quickBtnText}>+{val.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ACTION BUTTON */}
            <View style={styles.footer}>
              {loading ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleDeposit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Continue to Payment</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  description: {
    fontSize: 15,
    color: "#636366",
    marginTop: 12,
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 70,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C1C1E",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 10,
    marginLeft: 4,
  },
  quickSelectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  quickBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3A3A3C",
  },
  footer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#000000",
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#8E8E93",
    fontSize: 15,
    fontWeight: "600",
  },
});