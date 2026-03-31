import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { logout } from '../../utils/auth'
import { Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
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
    )
  }

  return (
  <View style={styles.container}>

    {/* TOP BAR */}
    <View style={styles.topBar}>
      <View style={styles.left}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.appName}>Admin</Text>
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>

    {/* DASHBOARD CARD */}
    <View style={styles.dashboardCard}>
      <Text style={styles.dashboardTitle}>System Overview</Text>
      <Text style={styles.dashboardSub}>
        Manage users & monitor transactions
      </Text>
    </View>

    {/* GRID MENU */}
    <View style={styles.grid}>

      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => navigation.navigate("Users")}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.gridText}>Users</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => navigation.navigate("AdminTransactions")}
      >
        <Text style={styles.icon}>💸</Text>
        <Text style={styles.gridText}>Transactions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => navigation.navigate("Suspicious")}
      >
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.gridText}>Suspicious</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => navigation.navigate("AuditLogs")}
      >
        <Text style={styles.icon}>📜</Text>
        <Text style={styles.gridText}>Audit Logs</Text>
      </TouchableOpacity>
<TouchableOpacity
  style={styles.gridItem}
  onPress={() => navigation.navigate("AdminReport")}
>
  <Text style={styles.icon}>📊</Text>
  <Text style={styles.gridText}>Reports</Text>
</TouchableOpacity>
    </View>

  </View>
);
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  left: {
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

  dashboardCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },

  dashboardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  dashboardSub: {
    color: "#ccc",
    marginTop: 5,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridItem: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  icon: {
    fontSize: 24,
    marginBottom: 8,
  },

  gridText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});