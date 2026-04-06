import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { logout } from '../../utils/auth';
import { COLORS, SIZES } from "../../theme/theme";
import logo from "../../assets/logo.png";

export default function AdminHomeScreen({ navigation }) {

  const handleLogout = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout(navigation) }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.greeting}>Control Panel</Text>
            <Text style={styles.appName}>Administrator</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* SYSTEM OVERVIEW CARD */}
      <View style={styles.dashboardCard}>
        <Text style={styles.cardLabel}>System Status</Text>
        <Text style={styles.dashboardTitle}>Active & Secure</Text>
        <Text style={styles.dashboardSub}>
          Monitor transactions and manage user access levels.
        </Text>
      </View>

      {/* MAIN MANAGEMENT GRID */}
      <Text style={styles.sectionTitle}>Management</Text>
      <View style={styles.grid}>
        
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("Users")}
        >
          <View style={[styles.dot, { backgroundColor: '#60A5FA' }]} />
          <Text style={styles.gridText}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("AdminTransactions")}
        >
          <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
          <Text style={styles.gridText}>Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("Suspicious")}
        >
          <View style={[styles.dot, { backgroundColor: '#F87171' }]} />
          <Text style={styles.gridText}>Suspicious</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("AuditLogs")}
        >
          <View style={[styles.dot, { backgroundColor: '#FBBF24' }]} />
          <Text style={styles.gridText}>Audit Logs</Text>
        </TouchableOpacity>
      </View>

      {/* SECONDARY ACTIONS */}
      <View style={styles.reportSection}>
        <TouchableOpacity 
          style={styles.reportBtn} 
          onPress={() => navigation.navigate("AdminReport")}
        >
          <Text style={styles.reportBtnText}>Generate System Report</Text>
          <Text style={styles.arrow}>→</Text>
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
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#94A3B8',
  },
  appName: {
    fontSize: 20,
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
  dashboardCard: {
    backgroundColor: '#0F172A', // Navy Dark đồng bộ HomeScreen
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
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  dashboardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  dashboardSub: {
    color: "#94A3B8",
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    backgroundColor: '#F8FAFC',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  gridText: {
    color: '#334155',
    fontWeight: "600",
    fontSize: 15,
  },
  reportSection: {
    marginTop: 10,
  },
  reportBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  reportBtnText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 18,
    color: '#64748B',
  },
});