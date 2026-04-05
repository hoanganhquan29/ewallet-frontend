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
  StatusBar,
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
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      const filters = { type: type === "ALL" ? undefined : type };
      const res = await getTransactions(pageNumber, PAGE_SIZE, filters);
      const newData = res.data.content || [];

      if (isRefresh || pageNumber === 0) {
        setTransactions(newData);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
      }
      setHasMore(newData.length === PAGE_SIZE);
    } catch (error) {
      console.log("Transaction fetch error:", error?.response?.status);
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
    if (type === selectedType) return;
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
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0F172A" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions found</Text>
      </View>
    );
  };

  if (!currentUserEmail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0F172A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* MINIMALIST HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>All your activities in one place</Text>
        </View>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TYPES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.typeRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.typeButton,
                selectedType === item && styles.typeButtonActive,
              ]}
              onPress={() => handleSelectType(item)}
            >
              <Text style={[
                styles.typeText,
                selectedType === item && styles.typeTextActive
              ]}>
                {item.charAt(0) + item.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* TRANSACTION LIST */}
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={transactions}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <TransactionItem item={item} currentUserEmail={currentUserEmail} />
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0F172A"
          />
        }
      />
    </View>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White clean background
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  filterWrapper: {
    marginBottom: 10,
  },
  typeRow: {
    paddingHorizontal: 24,
    gap: 8,
    paddingBottom: 10,
  },
  typeButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 0,
  },
  typeButtonActive: {
    backgroundColor: "#0F172A",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  typeTextActive: {
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  itemWrapper: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 12,
    padding: 4, // Padding nhẹ bao quanh item component cũ
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "500",
  },
});