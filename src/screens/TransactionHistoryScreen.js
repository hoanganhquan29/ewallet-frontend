import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { getTransactions } from "../api/transactionApi";
import TransactionItem from "../components/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { COLORS, SIZES } from "../theme/theme";
import logo from "../assets/logo.png";

const PAGE_SIZE = 10;
const TYPES = ["ALL", "DEPOSIT", "TRANSFER", "REQUEST"];

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [selectedType, setSelectedType] = useState("ALL");

  // ref để chặn spam — thay đổi không trigger re-render
  const isFetchingRef = useRef(false);
  const selectedTypeRef = useRef("ALL");

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      setCurrentUserEmail(decoded.sub);
    };
    loadUser();
  }, []);

  const fetchTransactions = async (pageNumber = 0, type = "ALL", isRefresh = false) => {
    if (isFetchingRef.current) return; // chặn double-call
    isFetchingRef.current = true;

    try {
      setLoading(true);

      const filters = {
        type: type === "ALL" ? undefined : type,
      };

      const res = await getTransactions(pageNumber, PAGE_SIZE, filters);
      const newData = res.data.content || [];

      if (isRefresh || pageNumber === 0) {
        setTransactions(newData);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
      }

      setHasMore(newData.length === PAGE_SIZE);
    } catch (error) {
      console.log("Transaction fetch error:", error?.response?.status, error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (currentUserEmail) {
      fetchTransactions(0, selectedType, true);
    }
  }, [currentUserEmail]);

  const handleSelectType = (type) => {
    if (type === selectedType) return; // không gọi lại nếu bấm cùng type
    selectedTypeRef.current = type;
    setSelectedType(type);
    setPage(0);
    setHasMore(true);
    fetchTransactions(0, type, true);
  };

  const handleLoadMore = () => {
    if (isFetchingRef.current || !hasMore || refreshing) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, selectedTypeRef.current);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    fetchTransactions(0, selectedTypeRef.current, true);
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: "#888" }}>No transactions yet</Text>
      </View>
    );
  };

  if (!currentUserEmail) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>Your transaction history</Text>
      </View>

      {/* TYPE FILTER BUTTONS */}
      <View style={styles.typeRow}>
        {TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonActive,
            ]}
            onPress={() => handleSelectType(type)}
          >
            <Text style={{ color: selectedType === type ? "#fff" : "#333", fontSize: 13 }}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
        data={transactions}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() + "_" + index : index.toString()
        }
        renderItem={({ item }) => (
          <TransactionItem item={item} currentUserEmail={currentUserEmail} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default TransactionHistoryScreen;

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
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  typeRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});