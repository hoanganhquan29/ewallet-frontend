import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  getOverview,
  getTrend,
  getTop,
  getMonthlyTrend,
  getYearlyTrend
} from "../api/userReportApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import TransactionItem from "../components/TransactionItem";

const screenWidth = Dimensions.get("window").width;

export default function UserReportScreen() {
  const [userId, setUserId] = useState(null);
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [mode, setMode] = useState("DAILY");
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const loadUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUserId(decoded.userId);
    setCurrentUserEmail(decoded.sub);
  };

  const loadData = async (id) => {
    try {
      setLoading(true);
      const [ov, tp] = await Promise.all([getOverview(id), getTop(id)]);
      let trendData = [];
      if (mode === "DAILY") {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        const res = await getTrend(id, start.toISOString(), end.toISOString());
        trendData = res.data;
      } else if (mode === "MONTHLY") {
        const res = await getMonthlyTrend(id);
        trendData = res.data;
      } else if (mode === "YEARLY") {
        const res = await getYearlyTrend(id);
        trendData = res.data;
      }
      setOverview(ov.data);
      setTop(tp.data);
      setTrend(trendData);
    } catch (err) {
      console.log("REPORT ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (userId) loadData(userId); }, [userId, days, mode]);

  if (loading || !overview) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const chartData = {
    labels: trend.map((t, i) => {
      if (trend.length > 10 && i % 2 !== 0) return "";
      if (mode === "DAILY") return t.date.slice(5);
      if (mode === "MONTHLY") return t.date.slice(2);
      return t.date;
    }),
    datasets: [{ data: trend.map((t) => t.amount) }],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Personal Analytics</Text>
          <Text style={styles.headerTitle}>Financial Report</Text>
        </View>

        {/* OVERVIEW CARDS */}
        <View style={styles.overviewGrid}>
          <View style={[styles.miniCard, { backgroundColor: '#F0F7FF' }]}>
            <Text style={styles.miniCardLabel}>Sent</Text>
            <Text style={styles.miniCardValue}>{overview.totalSent.toLocaleString()} ₫</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: '#F2FFF5' }]}>
            <Text style={styles.miniCardLabel}>Received</Text>
            <Text style={styles.miniCardValue}>{overview.totalReceived.toLocaleString()} ₫</Text>
          </View>
        </View>

        {/* MODE SELECTOR */}
        <View style={styles.pillContainer}>
          {["DAILY", "MONTHLY", "YEARLY"].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.pillBtn, mode === m && styles.activePillBtn]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.pillText, mode === m && styles.activePillText]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DAILY FILTER */}
        {mode === "DAILY" && (
          <View style={styles.subFilterRow}>
            {[7, 30].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDays(d)}
                style={styles.textFilterBtn}
              >
                <Text style={[styles.textFilter, days === d && styles.activeTextFilter]}>
                  Last {d} days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CHART SECTION */}
        <View style={styles.chartWrapper}>
          <Text style={styles.sectionTitle}>{mode.charAt(0) + mode.slice(1).toLowerCase()} Trend</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={chartData}
              width={Math.max(screenWidth - 40, trend.length * 60)}
              height={200}
              fromZero
              transparent
              yLabelsOffset={8} 
              formatYLabel={(value) => {
  const num = Number(value);
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return String(num);
}}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#000" },
                fillShadowGradientFrom: "#000",
                fillShadowGradientTo: "#fff",
                fillShadowGradientFromOpacity: 0.1,
                paddingLeft: 70,
              }}
              bezier
              style={styles.chartStyle}
            />
          </ScrollView>
        </View>

        {/* TOP TRANSACTIONS */}
        <View style={styles.transactionsWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Transactions</Text>
          </View>
          {top.map((item, index) => (
            <TransactionItem
              key={index}
              item={item}
              currentUserEmail={currentUserEmail}
            />
          ))}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    marginTop: 20,
    marginBottom: 25,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 4,
  },
  overviewGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  miniCard: {
    width: "48%",
    padding: 20,
    borderRadius: 24,
  },
  miniCardLabel: {
    fontSize: 12,
    color: "#636366",
    fontWeight: "600",
    marginBottom: 8,
  },
  miniCardValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activePillBtn: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
  },
  activePillText: {
    color: "#000000",
  },
  subFilterRow: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: 'center'
  },
  textFilterBtn: {
    marginHorizontal: 16,
  },
  textFilter: {
    fontSize: 14,
    color: "#AEAEB2",
    fontWeight: "600",
  },
  activeTextFilter: {
    color: "#007AFF", // Nhấn mạnh màu xanh minimalist của iOS
  },
  chartWrapper: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1C1C1E",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionsWrapper: {
    backgroundColor: "#F9F9F9",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },
});