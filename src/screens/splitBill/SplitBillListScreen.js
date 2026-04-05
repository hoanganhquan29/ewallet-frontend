import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StyleSheet, SafeAreaView
} from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMySplitBills } from "../../api/splitBillApi";

export default function SplitBillListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [res, token] = await Promise.all([
          getMySplitBills(),
          AsyncStorage.getItem("token"),
        ]);
        setData(res.data);
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUser(decoded.sub);
        }
      } catch (err) {
        console.log("INIT ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await getMySplitBills();
      setData(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED": return { bg: '#DCFCE7', text: '#166534' };
      case "PARTIAL":   return { bg: '#FEF3C7', text: '#92400E' };
      default:          return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const renderItem = ({ item }) => {
    const total = item.details?.length || 0;
    const paid = item.details?.filter((d) => d.status === "SUCCESS").length || 0;
    const isOwner = item.createdByEmail?.trim().toLowerCase() === currentUser.trim().toLowerCase();
    const myDetail = item.details?.find(
      (d) => d.email?.trim().toLowerCase() === currentUser.trim().toLowerCase()
    );
    const statusStyle = getStatusStyles(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate("SplitDetail", { id: item.id })}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.ownerBadge, { backgroundColor: isOwner ? '#E0E7FF' : '#F3E8FF' }]}>
            <Text style={[styles.ownerText, { color: isOwner ? '#4338CA' : '#7E22CE' }]}>
              {isOwner ? "Creator" : "Shared with you"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.amountText}>{item.totalAmount?.toLocaleString()} <Text style={styles.currency}>VND</Text></Text>
        
        {!isOwner && (
          <Text style={styles.fromText}>From: {item.createdByEmail}</Text>
        )}

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <Text style={styles.progressText}>{paid}/{total} members paid</Text>
          {myDetail && (
            <View style={styles.myShareContainer}>
              <Text style={styles.myShareLabel}>Your share:</Text>
              <Text style={styles.myShareValue}>{myDetail.amount?.toLocaleString()} VND</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0F172A" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Split Bills</Text>
        <Text style={styles.subtitle}>Manage your shared expenses</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("SplitCreate")}
          style={styles.createBtn}
        >
          <Text style={styles.createBtnText}>+ New Split Bill</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  listPadding: {
    padding: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ownerText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amountText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  currency: {
    fontSize: 14,
    color: '#64748B',
  },
  fromText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  myShareContainer: {
    alignItems: 'flex-end',
  },
  myShareLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  myShareValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  createBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});