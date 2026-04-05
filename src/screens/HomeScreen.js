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
  ScrollView,
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.appName}>E-Wallet</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* BALANCE CARD - Focus of the screen */}
      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Current Balance</Text>
        {loading ? (
          <ActivityIndicator color="white" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.balanceValue}>
            {balance?.toLocaleString()} <Text style={styles.currency}>VND</Text>
          </Text>
        )}
      </View>

      {/* QUICK ACTIONS - Minimalist Grid */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Deposit")}
        >
          <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
          <Text style={styles.actionBtnText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Transfer")}
        >
          <View style={[styles.dot, { backgroundColor: '#60A5FA' }]} />
          <Text style={styles.actionBtnText}>Transfer</Text>
        </TouchableOpacity>
      </View>

      {/* FEATURES LIST */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => navigation.navigate("Transactions")}
        >
          <Text style={styles.listItemText}>Transaction History</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => navigation.navigate("SplitList")}
        >
          <Text style={styles.listItemText}>Split Bill</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.listItem} 
          onPress={() => navigation.navigate("UserReport")}
        >
          <Text style={styles.listItemText}>Spending Analytics</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* REQUEST SECTION - Clean Sub-buttons */}
      <View style={styles.requestContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RequestMoney")}
          style={[styles.requestBtn, { backgroundColor: '#F0FDF4' }]}
        >
          <Text style={[styles.requestBtnText, { color: '#166534' }]}>Request Money</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("PendingRequests")}
          style={[styles.requestBtn, { backgroundColor: '#FFF7ED' }]}
        >
          <Text style={[styles.requestBtnText, { color: '#9A3412' }]}>Pending</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 60,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#94A3B8',
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: '#1E293B',
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
  },
  logoutText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: "700",
  },
  balanceCard: {
    backgroundColor: '#0F172A',
    padding: 28,
    borderRadius: 32,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10,
  },
  currency: {
    fontSize: 18,
    color: '#64748B',
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  actionBtn: {
    flex: 0.47,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  actionBtnText: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  listItemText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#CBD5E1',
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  requestBtn: {
    flex: 0.48,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  requestBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});