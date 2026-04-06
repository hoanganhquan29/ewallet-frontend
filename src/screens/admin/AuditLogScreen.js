import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuditLogs } from "../../api/adminApi";
import { COLORS, SIZES } from "../../theme/theme";
import logo from "../../assets/logo.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_OPTIONS = [
  { label: "All", value: "" },
  { label: "2FA Login", value: "LOGIN_SUCCESS_2FA" },
  { label: "Google Login", value: "LOGIN_GOOGLE" },
  { label: "Password OK", value: "LOGIN_PASSWORD_OK" },
  { label: "Login Failed", value: "LOGIN_FAILED" },
  { label: "Blocked", value: "LOGIN_BLOCKED" },
  { label: "OTP Sent", value: "OTP_SENT" },
  { label: "Lock User", value: "LOCK_USER" },
  { label: "Unlock User", value: "UNLOCK_USER" },
  { label: "Delete User", value: "DELETE_USER" },
  { label: "Acc Locked", value: "ACCOUNT_LOCKED" },
];

const DANGER_ACTIONS = ["LOCK_USER", "DELETE_USER", "LOGIN_FAILED", "LOGIN_BLOCKED", "ACCOUNT_LOCKED"];
const SUCCESS_ACTIONS = ["LOGIN_SUCCESS_2FA", "LOGIN_GOOGLE"];
const WARN_ACTIONS = ["OTP_SENT", "LOGIN_PASSWORD_OK"];

const getActionStyle = (action) => {
  if (DANGER_ACTIONS.includes(action)) return { bg: "#FFF1F2", text: "#E11D48", dot: "#F87171" };
  if (SUCCESS_ACTIONS.includes(action)) return { bg: "#F0FDF4", text: "#16A34A", dot: "#4ADE80" };
  if (WARN_ACTIONS.includes(action))    return { bg: "#FFFBEB", text: "#D97706", dot: "#FBBF24" };
  return { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString) =>
  new Date(dateString).toLocaleString("vi-VN");

// ─── Audit Card ───────────────────────────────────────────────────────────────

const AuditCard = ({ item }) => {
  const style = getActionStyle(item.action);
  return (
    <View style={card.wrap}>
      {/* Action tag */}
      <View style={card.topRow}>
        <View style={[card.tag, { backgroundColor: style.bg }]}>
          <View style={[card.dot, { backgroundColor: style.dot }]} />
          <Text style={[card.tagText, { color: style.text }]}>{item.action}</Text>
        </View>
        <Text style={card.date}>{formatDate(item.time)}</Text>
      </View>

      {/* Description */}
      <Text style={card.description}>{item.description}</Text>

      {/* IP */}
      <Text style={card.ip}>🌐 {item.ip}</Text>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    color: "#334155",
    lineHeight: 19,
  },
  ip: {
    marginTop: 8,
    fontSize: 11,
    color: "#CBD5E1",
  },
  date: {
    fontSize: 11,
    color: "#CBD5E1",
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AuditLogScreen() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchLogs = async (customPage = page) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getAuditLogs({ page: customPage, action, from, to });
      setLogs((prev) =>
        customPage === 0 ? res.data.content : [...prev, ...res.data.content]
      );
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page !== 0) fetchLogs(page);
  }, [page]);

  useEffect(() => {
    setLogs([]);
    setTotalPages(1);
    setPage(0);
    fetchLogs(0);
  }, [action, from, to]);

  const activeFilters = [action, from, to].filter(Boolean).length;

  const resetFilters = () => {
    setAction(""); setFrom(""); setTo("");
    setFilterOpen(false);
  };

  return (
    <View style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.greeting}>Control Panel</Text>
            <Text style={styles.title}>Audit Logs</Text>
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

          {/* Action chips */}
          <Text style={styles.filterLabel}>Action</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {ACTION_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setAction(opt.value)}
                style={[styles.chip, action === opt.value && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, action === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date Range */}
          <Text style={styles.filterLabel}>Date Range</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowFrom(true)}>
              <Text style={styles.dateBtnText}>
                {from || "From date"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateSep}>→</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowTo(true)}>
              <Text style={styles.dateBtnText}>
                {to || "To date"}
              </Text>
            </TouchableOpacity>
          </View>

          {showFrom && (
            <DateTimePicker
              value={from ? new Date(from) : new Date()}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowFrom(false);
                if (date) setFrom(date.toISOString().split("T")[0]);
              }}
            />
          )}
          {showTo && (
            <DateTimePicker
              value={to ? new Date(to) : new Date()}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowTo(false);
                if (date) setTo(date.toISOString().split("T")[0]);
              }}
            />
          )}

          {/* Reset */}
          {activeFilters > 0 && (
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters} activeOpacity={0.7}>
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ── LIST ── */}
      <FlatList
        data={logs}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}_${index}` : `${index}`
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onEndReached={() => {
          if (!loading && page < totalPages - 1) setPage((prev) => prev + 1);
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AuditCard item={item} />}
        ListFooterComponent={
          loading ? <Text style={styles.loadingText}>Loading...</Text> : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No logs found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          )
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
  chipRow: {
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#0F172A",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  chipTextActive: {
    color: "#FFFFFF",
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
  resetBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
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
  loadingText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    paddingVertical: 16,
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