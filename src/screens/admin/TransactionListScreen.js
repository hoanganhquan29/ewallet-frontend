import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAllTransactions } from "../../api/adminApi";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatMoney = (num) =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";

const formatDate = (date) =>
  new Date(date).toLocaleString("vi-VN");

// ─── Status Badge ────────────────────────────────────────────────────────────

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
  wrap: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  success: { backgroundColor: "#F0FDF4" },
  failed: { backgroundColor: "#FFF1F2" },
  text: { fontSize: 11, fontWeight: "700" },
  successText: { color: "#16A34A" },
  failedText: { color: "#E11D48" },
});

// ─── Type Chip ───────────────────────────────────────────────────────────────

const TypeChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[chip.base, active && chip.active]}
    activeOpacity={0.7}
  >
    <Text style={[chip.text, active && chip.activeText]}>{label}</Text>
  </TouchableOpacity>
);

const chip = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
  },
  active: { backgroundColor: "#0F172A" },
  text: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  activeText: { color: "#FFFFFF" },
});

// ─── Transaction Card ─────────────────────────────────────────────────────────

const TransactionCard = ({ item }) => {
  const isDeposit = !item.sender && item.receiver;
  const dotColor = isDeposit ? "#60A5FA" : "#4ADE80";

  return (
    <View style={card.wrap}>
      {/* Top Row */}
      <View style={card.row}>
        <View style={card.typeRow}>
          <View style={[card.dot, { backgroundColor: dotColor }]} />
          <Text style={card.type}>{item.type}</Text>
        </View>
        <Text style={card.amount}>{formatMoney(item.amount)}</Text>
      </View>

      {/* Route */}
      <Text style={card.route}>
        {isDeposit
          ? `Deposit → ${item.receiver?.email}`
          : `${item.sender?.email} → ${item.receiver?.email}`}
      </Text>

      {/* Bottom Row */}
      <View style={card.row}>
        <View style={card.bottomLeft}>
          <StatusBadge status={item.status} />
          {item.suspicious && (
            <View style={card.suspiciousTag}>
              <Text style={card.suspiciousText}>⚠ Suspicious</Text>
            </View>
          )}
        </View>
        <Text style={card.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );
};

const card = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  type: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1E293B",
  },
  amount: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1E293B",
  },
  route: {
    marginTop: 6,
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  suspiciousTag: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  suspiciousText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EA580C",
  },
  date: {
    fontSize: 11,
    color: "#CBD5E1",
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [reload, setReload] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchData = async () => {
    try {
      const params = { page, size: 10 };
      if (type) params.type = type;
      if (status) params.status = status;
      if (from) params.from = from.slice(0, 19);
      if (to) params.to = to.slice(0, 19);
      if (email) params.email = email;

      const res = await getAllTransactions(params);
      const newData = res.data.content;

      if (page === 0) {
        setTransactions(newData);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
      }
    } catch (e) {
      console.log("FETCH ERROR:", e);
    }
  };

  const applyFilter = () => {
    setTransactions([]);
    setPage(0);
    setReload((prev) => !prev);
    setFilterOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, reload]);

  // Count active filters for badge
  const activeFilters = [type, status, from, to, email].filter(Boolean).length;

  return (
    <View style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.greeting}>Control Panel</Text>
            <Text style={styles.title}>Transactions</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.filterToggle, activeFilters > 0 && styles.filterToggleActive]}
          onPress={() => setFilterOpen((p) => !p)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterToggleText, activeFilters > 0 && styles.filterToggleTextActive]}>
            {activeFilters > 0 ? `Filter (${activeFilters})` : "Filter"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── FILTER PANEL ── */}
      {filterOpen && (
        <View style={styles.filterPanel}>

          {/* Email */}
          <TextInput
            placeholder="Search by email"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            style={styles.searchInput}
          />

          {/* Type */}
          <Text style={styles.filterLabel}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            <TypeChip label="All" active={type === ""} onPress={() => setType("")} />
            <TypeChip label="Transfer" active={type === "TRANSFER"} onPress={() => setType("TRANSFER")} />
            <TypeChip label="Deposit" active={type === "DEPOSIT"} onPress={() => setType("DEPOSIT")} />
          </ScrollView>

          {/* Status */}
          <Text style={styles.filterLabel}>Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            <TypeChip label="All" active={status === ""} onPress={() => setStatus("")} />
            <TypeChip label="Success" active={status === "SUCCESS"} onPress={() => setStatus("SUCCESS")} />
            <TypeChip label="Failed" active={status === "FAILED"} onPress={() => setStatus("FAILED")} />
          </ScrollView>

          {/* Date Range */}
          <Text style={styles.filterLabel}>Date Range</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowFromPicker(true)}
            >
              <Text style={styles.dateBtnText}>
                {from ? new Date(from).toLocaleDateString("en-GB") : "From date"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateSep}>→</Text>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowToPicker(true)}
            >
              <Text style={styles.dateBtnText}>
                {to ? new Date(to).toLocaleDateString("en-GB") : "To date"}
              </Text>
            </TouchableOpacity>
          </View>

          {showFromPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(e, date) => {
                setShowFromPicker(false);
                if (date) setFrom(date.toISOString());
              }}
            />
          )}
          {showToPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(e, date) => {
                setShowToPicker(false);
                if (date) setTo(date.toISOString());
              }}
            />
          )}

          {/* Apply */}
          <TouchableOpacity style={styles.applyBtn} onPress={applyFilter} activeOpacity={0.8}>
            <Text style={styles.applyBtnText}>Apply Filter</Text>
          </TouchableOpacity>

          {/* Reset */}
          {activeFilters > 0 && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setEmail(""); setType(""); setStatus(""); setFrom(""); setTo("");
                setTransactions([]); setPage(0); setReload((p) => !p); setFilterOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ── LIST ── */}
      <FlatList
        data={transactions}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}_${index}` : `${index}`
        }
        contentContainerStyle={styles.listContent}
        onEndReached={() => setPage((prev) => prev + 1)}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <TransactionCard item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters</Text>
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

  // Header
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
  filterToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  filterToggleActive: {
    backgroundColor: "#0F172A",
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  filterToggleTextActive: {
    color: "#FFFFFF",
  },

  // Filter panel
  filterPanel: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 14,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1E293B",
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateBtnText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  dateSep: {
    fontSize: 16,
    color: "#CBD5E1",
  },
  applyBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  resetBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  resetBtnText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 14,
  },

  // List
  listContent: {
    paddingBottom: 40,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
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