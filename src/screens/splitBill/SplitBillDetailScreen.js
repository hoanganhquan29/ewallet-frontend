import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  getSplitBillDetail,
  acceptSplit,
  rejectSplit,
} from "../../api/splitBillApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplitBillDetailScreen({ route }) {
  const { id } = route.params;

  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await getSplitBillDetail(id);
      setData(res.data);
    } catch (err) {
      console.log("DETAIL ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getSplitBillDetail(id);
        setData(res.data);
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUser(decoded.sub);
        }
      } catch (err) {
        console.log("INIT ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAccept = (detailId) => {
    Alert.alert("Payment Confirmation", "Do you want to accept and pay this share?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          try {
            setProcessingId(detailId);
            await acceptSplit(detailId);
            fetchDetail();
          } catch (err) {
            console.log(err.response?.data || err.message);
          } finally {
            setProcessingId(null);
          }
        },
      },
    ]);
  };

  const handleReject = (detailId) => {
    Alert.alert("Decline Request", "Are you sure you want to reject this split?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            await rejectSplit(detailId);
            fetchDetail();
          } catch (err) {
            console.log(err.response?.data || err.message);
          }
        },
      },
    ]);
  };

  const getStatusTheme = (status) => {
    switch (status) {
      case "SUCCESS": return { bg: '#DCFCE7', text: '#166534' };
      case "REJECTED": return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0F172A" />
    </View>
  );

  if (!data) return (
    <View style={styles.center}>
      <Text style={styles.errorMsg}>Failed to load bill details.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* SUMMARY HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.totalValue}>
          {data.totalAmount?.toLocaleString()} <Text style={styles.currency}>VND</Text>
        </Text>
        <View style={[styles.statusMainBadge, getStatusTheme(data.status)]}>
          <Text style={[styles.statusMainText, { color: getStatusTheme(data.status).text }]}>
            {data.status}
          </Text>
        </View>
      </View>

      {/* PARTICIPANTS LIST */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Participants</Text>
        <Text style={styles.listCount}>{data.details?.length} total</Text>
      </View>

      <FlatList
        data={data.details}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isMe = item.email?.trim().toLowerCase() === currentUser?.trim().toLowerCase();
          const theme = getStatusTheme(item.status);

          return (
            <View style={[styles.detailCard, isMe && styles.myDetailCard]}>
              <View style={styles.detailRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.emailText} numberOfLines={1}>
                    {item.email} {isMe && "(You)"}
                  </Text>
                  <Text style={styles.amountText}>{item.amount?.toLocaleString()} VND</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.bg }]}>
                  <Text style={[styles.badgeText, { color: theme.text }]}>{item.status}</Text>
                </View>
              </View>

              {item.status === "PENDING" && isMe && (
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.btn, styles.rejectBtn]} 
                    onPress={() => handleReject(item.id)}
                  >
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.btn, styles.acceptBtn]} 
                    disabled={processingId === item.id}
                    onPress={() => handleAccept(item.id)}
                  >
                    {processingId === item.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.acceptBtnText}>Pay Now</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginVertical: 10,
  },
  currency: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  statusMainBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
  },
  statusMainText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  listCount: {
    fontSize: 14,
    color: '#94A3B8',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  myDetailCard: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  emailText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#0F172A',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  rejectBtn: {
    backgroundColor: '#FEE2E2',
  },
  rejectBtnText: {
    color: '#991B1B',
    fontWeight: '700',
    fontSize: 14,
  },
  errorMsg: {
    color: '#94A3B8',
    fontSize: 16,
  }
});