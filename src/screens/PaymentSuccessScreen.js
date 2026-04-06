import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native'
import { useState, useEffect } from 'react'
import { getBalance } from '../api/walletApi'
import { COLORS, SIZES, SHADOW } from "../theme/theme"

export default function PaymentSuccessScreen({ navigation }) {

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await getBalance();
      setBalance(res.data);
      // Giữ nguyên logic Alert của bạn
      Alert.alert("Success", "Deposit successful 🎉");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        
        {/* SUCCESS ICON & HEADER */}
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
          
          <Text style={styles.title}>Payment Successful</Text>
          <Text style={styles.subtitle}>
            Your transaction has been processed and your wallet has been credited.
          </Text>
        </View>

        {/* BALANCE CARD */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            {balance !== null ? `${balance.toLocaleString()} ₫` : "--- ₫"}
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Back to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  content: {
    alignItems: "center",
    marginTop: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  checkIcon: {
    fontSize: 40,
    color: "#000", 
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  balanceContainer: {
    width: '100%',
    backgroundColor: "#F9F9F9",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F2F2F7",
  },
  balanceLabel: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
  },
  footer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: "#000000",
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 16,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#8E8E93",
    fontSize: 15,
    fontWeight: "600",
  },
});