import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import {
  getPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../api/walletApi";

export default function PendingRequestsScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getPendingRequests();
      setData(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      Alert.alert("Success", "Request accepted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("ACCEPT ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Accept failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      Alert.alert("Rejected", "Request has been declined");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("REJECT ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Reject failed");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.receiver?.email || "Unknown User"}
          </Text>
          <Text style={styles.amount}>
            {item.amount?.toLocaleString()} <Text style={styles.currency}>VND</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() => handleReject(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => handleAccept(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending</Text>
        <Text style={styles.headerSubtitle}>You have {data.length} requests waiting</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>All caught up!</Text>
            <Text style={styles.emptySubText}>No pending requests at the moment.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  listContent: {
    padding: 24,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  amount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  currency: {
    fontSize: 14,
    fontWeight: "400",
    color: "#64748B",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    backgroundColor: "#0F172A",
  },
  rejectBtn: {
    backgroundColor: "#F1F5F9",
  },
  acceptText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  rejectText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptySubText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
  },
});