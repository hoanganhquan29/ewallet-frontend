import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getAllTransactions } from "../../api/adminApi";
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";
export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);

const fetchData = async () => {
  try {
    console.log("FETCH PAGE:", page);

    const res = await getAllTransactions(page);

    const newData = res.data.content;

    console.log("NEW DATA:", newData.length);

    if (newData.length === 0) return; // ❌ không set rỗng

    setTransactions(prev => [...prev, ...newData]);

  } catch (e) {
    console.log("FETCH ERROR:", e);
  }
};

  useEffect(() => {
    console.log("USE EFFECT RUN");
    fetchData();
    console.log("STATE transactions:", transactions);
  }, [page]);

return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>All Transactions</Text>
      <Text style={styles.subtitle}>Monitor system activity</Text>
    </View>

    {/* LIST */}
    <FlatList
      contentContainerStyle={{ padding: SIZES.padding }}
      data={transactions}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() + "_" + index : index.toString()
      }
      onEndReached={() => setPage(prev => prev + 1)}
      renderItem={({ item }) => (
        <View style={styles.card}>

          {/* TOP ROW */}
          <View style={styles.rowBetween}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.amount}>
              {formatMoney(item.amount)}
            </Text>
          </View>

          {/* USERS */}
          {item.sender && item.receiver && (
            <Text style={styles.info}>
              {item.sender.email} → {item.receiver.email}
            </Text>
          )}

          {item.receiver && !item.sender && (
            <Text style={styles.info}>
              Deposit → {item.receiver.email}
            </Text>
          )}

          {/* STATUS */}
          <View style={styles.rowBetween}>
            <Text style={styles.status}>
              {item.status}
            </Text>

            {item.suspicious && (
              <Text style={styles.suspicious}>
                ⚠️ Suspicious
              </Text>
            )}
          </View>

          {/* DATE */}
          <Text style={styles.date}>
            {formatDate(item.createdAt)}
          </Text>

        </View>
      )}
    />

  </View>
);
}
const formatMoney = (num) =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";

const formatDate = (date) =>
  new Date(date).toLocaleString("vi-VN");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    alignItems: "center",
    paddingVertical: 20,
  },

  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },

  subtitle: {
    color: COLORS.secondary,
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontWeight: "600",
    color: COLORS.primary,
  },

  amount: {
    fontWeight: "700",
    color: COLORS.primary,
  },

  info: {
    marginTop: 6,
    color: COLORS.secondary,
  },

  status: {
    marginTop: 8,
    color: COLORS.secondary,
  },

  suspicious: {
    color: "red",
    fontWeight: "600",
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.secondary,
  },
});