import { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, Image } from "react-native";
import { getSuspicious } from "../../api/adminApi";
import { COLORS, SIZES } from "../../theme/theme";
import logo from "../../assets/logo.png";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatMoney = (num) =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";

const formatDate = (date) =>
  new Date(date).toLocaleString("vi-VN");

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const isSuccess = status === "SUCCESS";
  return (
    <View style={[badge.wrap, isSuccess ? badge.success : badge.failed]}>
      <Text style={[badge.text, isSuccess ? badge.successText : badge.failedText]}>
        {status}
      </Text>
    </View>
  );
};

const badge = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  success: { backgroundColor: "#F0FDF4" },
  failed: { backgroundColor: "#FFF1F2" },
  text: { fontSize: 11, fontWeight: "700" },
  successText: { color: "#16A34A" },
  failedText: { color: "#E11D48" },
});

// ─── Suspicious Card ──────────────────────────────────────────────────────────

const SuspiciousCard = ({ item }) => (
  <View style={card.wrap}>
    {/* Top Row */}
    <View style={card.row}>
      <View style={card.tagRow}>
        <View style={card.dot} />
        <Text style={card.warningLabel}>⚠ Suspicious</Text>
      </View>
      <Text style={card.amount}>{formatMoney(item.amount)}</Text>
    </View>

    {/* Route */}
    {item.sender && item.receiver && (
      <Text style={card.route}>
        {item.sender.email} → {item.receiver.email}
      </Text>
    )}
    {item.receiver && !item.sender && (
      <Text style={card.route}>Deposit → {item.receiver.email}</Text>
    )}

    {/* Bottom Row */}
    <View style={card.row}>
      <StatusBadge status={item.status} />
      <Text style={card.date}>{formatDate(item.createdAt)}</Text>
    </View>
  </View>
);

const card = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    shadowColor: "#F87171",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F87171",
    marginRight: 8,
  },
  warningLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E11D48",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  route: {
    marginTop: 6,
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    color: "#CBD5E1",
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SuspiciousScreen() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getSuspicious(page);
      setData((prev) => [...prev, ...res.data.content]);
    } catch (e) {
      console.log("ERROR:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <View style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.greeting}>Control Panel</Text>
            <Text style={styles.title}>Suspicious</Text>
          </View>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{data.length} flagged</Text>
        </View>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}_${index}` : `${index}`
        }
        contentContainerStyle={styles.listContent}
        onEndReached={() => setPage((prev) => prev + 1)}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <SuspiciousCard item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No suspicious activity</Text>
            <Text style={styles.emptySubText}>All transactions look normal</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 56,
    marginBottom: 12,
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
  countBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FFF1F2",
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E11D48",
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  emptySubText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 6,
  },
});