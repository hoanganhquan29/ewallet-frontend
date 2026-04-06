import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { confirmDeposit } from "../api/walletApi";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";
import { Image } from "react-native";

export default function PaymentScreen({ route, navigation }) {
  const { transactionId, amount } = route.params;
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      await confirmDeposit(transactionId);
      Alert.alert("Success", "Payment successful");
      navigation.navigate("Home", { refresh: true });
    } catch (err) {
      Alert.alert("Error", "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          
          {/* HEADER SECTION */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
               <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.title}>Checkout</Text>
            <Text style={styles.subtitle}>Secure Payment Gateway</Text>
          </View>

          {/* AMOUNT DISPLAY */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountText}>
              {Number(amount).toLocaleString()} ₫
            </Text>
          </View>

          {/* PAYMENT FORM */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Card Number</Text>
              <TextInput 
                placeholder="0000 0000 0000 0000" 
                placeholderTextColor="#A1A1A1"
                keyboardType="numeric"
                style={styles.input} 
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.fieldLabel}>Expiry Date</Text>
                <TextInput 
                  placeholder="MM/YY" 
                  placeholderTextColor="#A1A1A1"
                  style={styles.input} 
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <TextInput
                  placeholder="•••"
                  placeholderTextColor="#A1A1A1"
                  style={styles.input}
                  secureTextEntry
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.actionContainer}>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} size="large" />
            ) : (
              <TouchableOpacity 
                style={styles.payButton} 
                onPress={handlePay}
                activeOpacity={0.8}
              >
                <Text style={styles.payButtonText}>Confirm Payment</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Go back</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between", // Tạo khoảng cách đều giữa header, form và footer
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    padding: 12,
    backgroundColor: '#F8F9FB',
    borderRadius: 20,
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingVertical: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
  },
  amountLabel: {
    fontSize: 13,
    color: "#636366",
    fontWeight: "600",
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
  },
  row: {
    flexDirection: "row",
  },
  actionContainer: {
    marginTop: 20,
  },
  payButton: {
    backgroundColor: "#000000", // Màu đen tối giản
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
});