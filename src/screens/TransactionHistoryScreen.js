import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getTransactions } from "../api/transactionApi";
import TransactionItem from "../components/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
const PAGE_SIZE = 10;

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

const [currentUserId, setCurrentUserId] = useState(null);


  const fetchTransactions = async (pageNumber = 0, isRefresh = false) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await getTransactions(pageNumber, PAGE_SIZE);

      const newData = res.data.content || [];

      if (isRefresh) {
        setTransactions(newData);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
      }

      if (newData.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.log(
        "Transaction fetch error:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, []);
useEffect(() => {
  const loadUser = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);

    console.log("USER ID:", decoded.userId);

    setCurrentUserId(decoded.userId);
  };

  loadUser();
}, []);
  const handleLoadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    fetchTransactions(0, true);
  }, []);

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text>No transactions yet</Text>
      </View>
    );
  };
if (!currentUserId) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TransactionItem item={item} currentUserId={currentUserId} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
});
