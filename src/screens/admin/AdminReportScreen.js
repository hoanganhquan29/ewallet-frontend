import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { TouchableOpacity } from "react-native";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  getReportOverview,
  getReportSummary,
  getRevenueDaily,
  getUserReport,
  getAuditSummary,
} from "../../api/adminApi";
import { LineChart } from "react-native-chart-kit";
const formatMoney = (num) => {
  if (!num) return "0 VND";
  return new Intl.NumberFormat("vi-VN").format(num) + " VND";
};

const formatNumber = (num) => {
  if (!num) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
};
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
      const [
        overviewRes,
        summaryRes,
        revenueRes,
        usersRes,
        auditRes,
      ] = await Promise.all([
        getReportOverview(),
        getReportSummary(),
        getRevenueDaily(),
        getUserReport(),
        getAuditSummary(),
      ]);

      setOverview(overviewRes.data || {});
      setSummary(summaryRes.data || {});
      setRevenue(revenueRes.data || []);
      setUsers(usersRes.data || {});
      setAudit(auditRes.data || {});
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
const handleExport = async () => {
  try {
    let csv = "Date,Amount\n";

    revenue.forEach((r) => {
      csv += `${r.date},${r.amount}\n`;
    });

    const fileUri = FileSystem.documentDirectory + "report.csv";

    console.log("FILE URI:", fileUri); // debug

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: "utf8",
    });

    await Sharing.shareAsync(fileUri);

  } catch (error) {
    console.log("EXPORT ERROR:", error);
  }
};
  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  // ✅ SAFE DATA
  const safeRevenue = Array.isArray(revenue)
    ? revenue.filter((r) => r && !isNaN(r.amount))
    : [];

 const chartData = {
  labels: safeRevenue.map((r) => {
    const d = new Date(r.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }),
  datasets: [
    {
      data: safeRevenue.map((r) => Number(r.amount) || 0),
    },
  ],
};

  console.log("REVENUE:", revenue);

  return (
    
    <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
  <Text style={{ color: "white" }}>Export Report</Text>
</TouchableOpacity>
      {/* SECTION 1 */}
      <Text style={styles.title}>Overview</Text>
      <View style={styles.row}>
        <Card label="Users" value={overview.totalUsers} />
        <Card label="Transactions" value={overview.totalTransactions} />
      </View>
      <Card label="Total Amount" value={overview.totalAmount} full type="money" />

      {/* SECTION 2 */}
      <Text style={styles.title}>Transaction Summary</Text>
      <Card label="Total Amount" value={summary.totalAmount} type="money" />
      <Card label="Deposit" value={summary.depositAmount} type="money" />
      <Card label="Transfer" value={summary.transferAmount} type="money" />

      {/* SECTION 3 */}
      <Text style={styles.title}>Transaction Volume</Text>

      {safeRevenue.length > 0 ? (
     <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }} // Thêm padding bottom để tránh dính lề
    >
      <LineChart
        data={chartData}
        // Tăng độ rộng mỗi cột lên một chút (80 thay vì 70) 
        // và cộng thêm một khoảng đệm cố định cho cột số liệu trục Y
        width={Math.max(
          Dimensions.get("window").width - 30,
          safeRevenue.length * 80 + 60 
        )}
        height={250} // Tăng nhẹ height để nhãn trục X không bị sát đáy
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          // Thêm cấu hình style cho Label để không bị cắt
          propsForLabels: {
            fontSize: 10,
          },
          // Căn chỉnh lề để tránh mất số liệu bên trái
          paddingLeft: 15, 
          paddingRight: 50, // Tránh mất điểm dữ liệu cuối cùng bên phải
        }}
        // Giúp biểu đồ hiển thị mượt hơn và không bị tràn khung
        fromZero={true} 
        yAxisLabel=""
        yAxisSuffix=""
        verticalLabelRotation={30} // Xoay nhẹ nhãn ngày tháng nếu dữ liệu quá dày
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  ) : (
    <Text style={{ textAlign: 'center', margin: 20 }}>No revenue data</Text>
  )}

      {/* SECTION 4 */}
      <Text style={styles.title}>User Report</Text>
      <Card label="New Users" value={users.newUsers} />
      <Card label="Inactive Users" value={users.inactiveUsers} />

      <Text style={styles.subtitle}>Top Users</Text>
      {users.topUsers?.map((u, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.email}>{u[0]}</Text>
          <Text style={styles.amount}>{formatMoney(u[1])}</Text>
        </View>
      ))}

      {/* SECTION 5 */}
      <Text style={styles.title}>Audit Summary</Text>
      <Card label="Login Fail" value={audit.loginFail} />
      <Card label="Lock User" value={audit.lockUser} />
    <Card label="Admin Actions" value={audit.adminActions} />
    </ScrollView>
  );
}

const Card = ({ label, value, full, type }) => {
  const displayValue =
    type === "money"
      ? formatMoney(value)
      : formatNumber(value);

  return (
    <View style={[styles.card, full && { width: "100%" }]}>
      <Text style={styles.cardValue}>{displayValue}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardLabel: {
    color: "#888",
    marginTop: 5,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
  },
  amount: {
    fontWeight: "bold",
  },
  exportBtn: {
  backgroundColor: "#2ecc71",
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 15,
},
});