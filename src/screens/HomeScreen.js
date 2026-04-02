import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import { COLORS, SIZES, SHADOW } from "../theme/theme";
import { logout } from "../utils/auth";
import logo from "../assets/logo.png";
import { getBalance } from "../api/walletApi";

export default function HomeScreen({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(navigation) },
    ]);
  };

  const loadBalance = async () => {
    try {
      setLoading(true);
      const res = await getBalance();
      setBalance(res.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

useFocusEffect(
  useCallback(() => {
    loadBalance();
  }, [])
);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.appName}>E-Wallet</Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* BALANCE */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current Balance</Text>

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.balance}>
            {balance?.toLocaleString()} ₫
          </Text>
        )}
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Deposit")}
        >
          <Text style={styles.actionText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Transfer")}
        >
          <Text style={styles.actionText}>Transfer</Text>
        </TouchableOpacity>
      </View>

      {/* VIEW TRANSACTIONS */}
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => navigation.navigate("Transactions")}
      >
        <Text style={styles.viewText}>View Transactions</Text>
      </TouchableOpacity>

      <TouchableOpacity 
  style={styles.button} 
  onPress={() => navigation.navigate("SplitList")}
>
  <Text style={styles.buttonText}>Split Bill</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },

  appName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },

  logout: {
    color: "red",
    fontWeight: "500",
  },

  card: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    ...SHADOW,
  },

  cardLabel: {
    color: "#ccc",
    marginBottom: 5,
  },

  balance: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  actionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },

  viewBtn: {
    marginTop: 20,
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },

  viewText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  
});