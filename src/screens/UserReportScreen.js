import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
  const [mode, setMode] = useState("DAILY"); // DAILY | MONTHLY | YEARLY
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  // ===== LOAD USER =====
  const loadUser = async () => {
  const token = await AsyncStorage.getItem("token");
  const decoded = jwtDecode(token);

  setUserId(decoded.userId);
  setCurrentUserEmail(decoded.sub); 
};

  // ===== LOAD DATA =====
  const loadData = async (id) => {
  try {
    setLoading(true);

    const [ov, tp] = await Promise.all([
      getOverview(id),
      getTop(id),
    ]);

    let trendData = [];

if (mode === "DAILY") {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const res = await getTrend(
    id,
    start.toISOString(),
    end.toISOString()
  );

  trendData = res.data;
}

if (mode === "MONTHLY") {
  const res = await getMonthlyTrend(id);
  trendData = res.data;
}

if (mode === "YEARLY") {
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

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadData(userId, days);
    }
  }, [userId, days, mode]);

  if (loading || !overview) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  // ===== CHART DATA =====
  const chartData = {
  labels: trend.map((t, i) => {
  if (trend.length > 10 && i % 2 !== 0) return ""; 

  if (mode === "DAILY") return t.date.slice(5);
  if (mode === "MONTHLY") return t.date.slice(2);
  return t.date;
}),
    datasets: [
      {
        data: trend.map((t) => t.amount),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* ===== OVERVIEW ===== */}
      <View style={styles.card}>
        <Text style={styles.title}>Overview</Text>

        <Text>Total Sent: {overview.totalSent.toLocaleString()} ₫</Text>
        <Text>Total Received: {overview.totalReceived.toLocaleString()} ₫</Text>
        <Text>Transactions: {overview.transactionCount}</Text>
      </View>

{/* ===== MODE ===== */}
<View style={styles.filterRow}>
  {["DAILY", "MONTHLY", "YEARLY"].map((m) => (
    <TouchableOpacity
      key={m}
      style={[
        styles.filterBtn,
        mode === m && styles.activeFilter,
      ]}
      onPress={() => setMode(m)}
    >
      <Text style={{ color: mode === m ? "white" : "black" }}>
        {m}
      </Text>
    </TouchableOpacity>
  ))}
</View>

      {/* ===== FILTER ===== */}
      {mode === "DAILY" && (
  <View style={styles.filterRow}>
    {[7, 30].map((d) => (
      <TouchableOpacity
        key={d}
        style={[
          styles.filterBtn,
          days === d && styles.activeFilter,
        ]}
        onPress={() => setDays(d)}
      >
        <Text style={{ color: days === d ? "white" : "black" }}>
          {d} days
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}

     
      {/* ===== CHART ===== */}
<View style={styles.card}>
  <Text style={styles.title}>{mode} Trend</Text>

  <View style={styles.chartContainer}>
    <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{
    paddingRight: 40, 
  }}
>
      <LineChart
      
  data={chartData}
  width={Math.max(screenWidth, trend.length * 60)} 
  height={220}
  yAxisInterval={1}
  fromZero
  yAxisSuffix="đ"

  formatYLabel={(yValue) => {
  const num = Math.round(Number(yValue));
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return String(num);
}}
  chartConfig={{
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(79, 172, 254, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  }}
  bezier
  style={{
    marginVertical: 8,
    borderRadius: 10,
    paddingLeft: 10, 
  }}
/>
    </ScrollView>
  </View>
</View>

      {/* ===== TOP ===== */}
      <View style={styles.card}>
        <Text style={styles.title}>Top Transactions</Text>

        {top.map((item, index) => (
          <TransactionItem
            key={index}
            item={item}
            currentUserEmail={currentUserEmail}
          />
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  filterBtn: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
  },

  activeFilter: {
    backgroundColor: "#4facfe",
  },
  chartContainer: {
  borderRadius: 10,
  paddingRight: 10, 
  
},
});