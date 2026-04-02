import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
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
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchDetail();

  const loadUser = async () => {
    const email = await AsyncStorage.getItem("email");
    setCurrentUser(email);
  };

  loadUser();
}, []);

  const handleAccept = (detailId) => {
  Alert.alert("Confirm", "Accept this split?", [
    { text: "Cancel" },
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
    Alert.alert("Confirm", "Reject this split?", [
      { text: "Cancel" },
      {
        text: "Reject",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!data) {
  return <Text>Error loading data</Text>;
}

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Total: {data.totalAmount} VND
      </Text>

      <Text style={{ marginBottom: 16 }}>
        Status: {data.status}
      </Text>

      <FlatList
        data={data.details}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text>{item.email}</Text>
            <Text>{item.amount} VND</Text>

            <Text style={{ color: getStatusColor(item.status) }}>
              {item.status}
            </Text>

            {item.status === "PENDING" && item.email === currentUser && (
              <>
                <Button
  title={processingId === item.id ? "Processing..." : "Accept"}
  disabled={processingId === item.id}
  onPress={() => handleAccept(item.id)}
/>
                <Button
                  title="Reject"
                  color="red"
                  onPress={() => handleReject(item.id)}
                />
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}