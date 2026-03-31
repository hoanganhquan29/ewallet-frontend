import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getSuspicious } from '../../api/adminApi'
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";
export default function SuspiciousScreen() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)

  const fetchData = async () => {
    try {
      const res = await getSuspicious(page)

      console.log("SUSPICIOUS API:", res.data) // debug

      setData(prev => [...prev, ...res.data.content]) // 🔥 QUAN TRỌNG
    } catch (e) {
      console.log("ERROR:", e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Suspicious</Text>
      <Text style={styles.subtitle}>
        High-risk transactions
      </Text>
    </View>

    {/* LIST */}
    <FlatList
      contentContainerStyle={{ padding: SIZES.padding }}
      data={data}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() + "_" + index : index.toString()
      }
      onEndReached={() => setPage(prev => prev + 1)}
      renderItem={({ item }) => (
        <View style={styles.card}>

          {/* TOP */}
          <View style={styles.rowBetween}>
            <Text style={styles.warning}>⚠️ Suspicious</Text>
            <Text style={styles.amount}>
              {formatMoney(item.amount)}
            </Text>
          </View>

          {/* USER FLOW */}
          {item.sender && item.receiver && (
            <Text style={styles.info}>
              {item.sender.email} → {item.receiver.email}
            </Text>
          )}

          {/* STATUS */}
          <Text style={styles.status}>
            Status: {item.status}
          </Text>

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
  new Intl.NumberFormat('vi-VN').format(num) + ' VND'

const formatDate = (date) =>
  new Date(date).toLocaleString('vi-VN')
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
    backgroundColor: "#fff5f5", // đỏ nhẹ (không gắt)
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ffcccc",
    ...SHADOW,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  warning: {
    color: "red",
    fontWeight: "700",
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

  date: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.secondary,
  },
});