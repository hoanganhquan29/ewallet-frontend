import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { LineChart } from "react-native-chart-kit";
import {
  getReportOverview,
  getReportSummary,
  getRevenueDaily,
  getUserReport,
  getAuditSummary,
} from "../../api/adminApi";
import logo from "../../assets/logo.png";

// --- Helpers ---
const formatMoney = (num) => {
  if (!num) return "0 VND";
  return new Intl.NumberFormat("vi-VN").format(num) + " VND";
};

const formatNumber = (num) => {
  if (!num) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
};

// --- Custom Components ---
const StatCard = ({ label, value, type, fullWidth }) => (
  <View style={[cardStyles.wrap, fullWidth && { width: "100%" }]}>
    <Text style={cardStyles.label}>{label}</Text>
    <Text style={cardStyles.value}>
      {type === "money" ? formatMoney(value) : formatNumber(value)}
    </Text>
  </View>
);

const cardStyles = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
    width: "48%",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
});

export default function AdminReportScreen() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [summary, setSummary] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [users, setUsers] = useState({});
  const [audit, setAudit] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [ovRes, sumRes, revRes, userRes, audRes] = await Promise.all([
        getReportOverview(),
        getReportSummary(),
        getRevenueDaily(),
        getUserReport(),
        getAuditSummary(),
      ]);
      setOverview(ovRes.data || {});
      setSummary(sumRes.data || {});
      setRevenue(revRes.data || []);
      setUsers(userRes.data || {});
      setAudit(audRes.data || {});
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      let csv = "Date,Amount\n";
      revenue.forEach((r) => { csv += `${r.date},${r.amount}\n`; });
      const fileUri = FileSystem.documentDirectory + "report.csv";
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: "utf8" });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.log("EXPORT ERROR:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator color="#0F172A" size="large" />
      </View>
    );
  }

  const safeRevenue = Array.isArray(revenue) ? revenue.filter((r) => r && !isNaN(r.amount)) : [];
  const chartData = {
    labels: safeRevenue.map((r) => {
      const d = new Date(r.date);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }),
    datasets: [{ data: safeRevenue.map((r) => Number(r.amount) || 0) }],
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.greeting}>Admin Dashboard</Text>
            <Text style={styles.title}>System Reports</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <Text style={styles.exportBtnText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      {/* --- OVERVIEW --- */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.row}>
        <StatCard label="Total Users" value={overview.totalUsers} />
        <StatCard label="Transactions" value={overview.totalTransactions} />
      </View>
      <StatCard label="Total Volume" value={overview.totalAmount} fullWidth type="money" />

      {/* --- CHART SECTION --- */}
      <Text style={styles.sectionTitle}>Revenue Trends</Text>
      <View style={styles.chartCard}>
        {safeRevenue.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={chartData}
              width={Math.max(Dimensions.get("window").width - 64, safeRevenue.length * 70)}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#0F172A" },
                style: { borderRadius: 16 },
              }}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No data available</Text>
        )}
      </View>

      {/* --- TRANSACTION SUMMARY --- */}
      <Text style={styles.sectionTitle}>Transaction Breakdown</Text>
      <View style={styles.row}>
        <StatCard label="Deposits" value={summary.depositAmount} type="money" />
        <StatCard label="Transfers" value={summary.transferAmount} type="money" />
      </View>

      {/* --- USER ACTIVITY --- */}
      <Text style={styles.sectionTitle}>User Activity</Text>
      <View style={styles.row}>
        <StatCard label="New Users" value={users.newUsers} />
        <StatCard label="Inactive" value={users.inactiveUsers} />
      </View>

      <View style={styles.topUsersCard}>
        <Text style={styles.innerTitle}>Top Performers</Text>
        {users.topUsers?.map((u, index) => (
          <View key={index} style={styles.userItem}>
            <Text style={styles.userEmail}>{u[0]}</Text>
            <Text style={styles.userAmount}>{formatMoney(u[1])}</Text>
          </View>
        ))}
      </View>

      {/* --- AUDIT LOGS --- */}
      <Text style={styles.sectionTitle}>Security & Audit</Text>
      <View style={styles.row}>
        <StatCard label="Login Failures" value={audit.loginFail} />
        <StatCard label="Locked Users" value={audit.lockUser} />
      </View>
      <StatCard label="Admin Actions" value={audit.adminActions} fullWidth />
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 56,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  greeting: {
    fontSize: 13,
    color: "#94A3B8",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  exportBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#0F172A",
  },
  exportBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  topUsersCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  innerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  userEmail: {
    fontSize: 13,
    color: "#475569",
  },
  userAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    padding: 20,
  },
});