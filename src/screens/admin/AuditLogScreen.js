import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getAuditLogs } from '../../api/adminApi'
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";
export default function AuditLogScreen() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)

  const fetchLogs = async () => {
    const res = await getAuditLogs(page)
    setLogs(prev => [...prev, ...res.data.content])
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Audit Logs</Text>
      <Text style={styles.subtitle}>
        System activity tracking
      </Text>
    </View>

    <FlatList
      contentContainerStyle={{ padding: SIZES.padding }}
      data={logs}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() + "_" + index : index.toString()
      }
      onEndReached={() => setPage(prev => prev + 1)}
      renderItem={({ item }) => {
        const d = parseDetails(item.details);

        return (
          <View style={styles.card}>

            {/* ACTION */}
            <Text style={styles.action}>
              {item.action}
            </Text>

            {/* EMAIL */}
            {d.email && (
              <Text style={styles.info}>
                👤 {d.email}
              </Text>
            )}

            {/* MESSAGE */}
            {d.message && (
              <Text style={styles.message}>
                {d.message}
              </Text>
            )}

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.ip}>
                🌐 {item.ipAddress}
              </Text>

              <Text style={styles.date}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

          </View>
        );
      }}
    />

  </View>
);
}
const parseDetails = (details) => {
  try {
    return JSON.parse(details);
  } catch {
    return { message: details };
  }
};

const formatMoney = (num) =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("vi-VN");
};
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

  action: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  info: {
    marginTop: 6,
    color: COLORS.secondary,
  },

  message: {
    marginTop: 6,
    color: COLORS.primary,
  },

  footer: {
    marginTop: 10,
  },

  ip: {
    fontSize: 12,
    color: COLORS.secondary,
  },

  date: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
});