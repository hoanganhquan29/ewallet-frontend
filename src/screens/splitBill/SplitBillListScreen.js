import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getMySplitBills } from "../../api/splitBillApi";

export default function SplitBillListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getMySplitBills();
      setData(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "PARTIAL":
        return "orange";
      default:
        return "gray";
    }
  };

  const renderItem = ({ item }) => {
    const total = item.details?.length || 0;
const paid =
  item.details?.filter((d) => d.status === "SUCCESS").length || 0;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SplitDetail", { id: item.id })
        }
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {item.totalAmount} VND
        </Text>

        <Text style={{ color: getStatusColor(item.status) }}>
          {item.status}
        </Text>

        <Text>
          {paid}/{total} paid
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("SplitCreate")}
        style={{
          backgroundColor: "blue",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          + Create Split Bill
        </Text>
      </TouchableOpacity>
    </View>
  );
}