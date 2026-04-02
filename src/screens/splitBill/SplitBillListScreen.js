import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
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
console.log("RAW DATA:", JSON.stringify(res.data, null, 2)); // ← thêm
console.log("TOKEN:", token);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "green";
      case "PARTIAL":   return "orange";
      default:          return "gray";
    }
  };

  const renderItem = ({ item }) => {
    const total = item.details?.length || 0;
    const paid = item.details?.filter((d) => d.status === "SUCCESS").length || 0;

    const isOwner =
      item.createdByEmail?.trim().toLowerCase() === currentUser.trim().toLowerCase();

    const myDetail = item.details?.find(
      (d) => d.email?.trim().toLowerCase() === currentUser.trim().toLowerCase()
    );

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SplitDetail", { id: item.id })}
        style={{ padding: 16, borderWidth: 1, borderRadius: 10, marginBottom: 12 }}
      >
        <Text style={{
          fontSize: 11, fontWeight: "bold",
          color: isOwner ? "blue" : "purple", marginBottom: 4,
        }}>
          {isOwner ? "👑 Created by you" : `📩 From: ${item.createdByEmail}`}
        </Text>

        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {item.totalAmount?.toLocaleString()} VND
        </Text>

        <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>

        <Text>{paid}/{total} paid</Text>

        {!isOwner && myDetail && (
          <Text style={{ marginTop: 4, color: "gray" }}>
            Your share: {myDetail.amount?.toLocaleString() ?? "not set"} VND
            {" · "}
            <Text style={{ color: getStatusColor(myDetail.status) }}>
              {myDetail.status}
            </Text>
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("SplitCreate")}
        style={{ backgroundColor: "blue", padding: 14, borderRadius: 10, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>+ Create Split Bill</Text>
      </TouchableOpacity>
    </View>
  );
}