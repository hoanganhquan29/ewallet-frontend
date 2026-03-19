import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getAllTransactions } from "../../api/adminApi";

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);

const fetchData = async () => {
  try {
    console.log("FETCH CALLED");

    const res = await getAllTransactions(page);

    console.log("API DATA:", res.data); 

    setTransactions(res.data.content);
  } catch (e) {
    console.log("FETCH ERROR:", e); 
  }
};

  useEffect(() => {
    console.log("USE EFFECT RUN");
    fetchData();
    console.log("STATE transactions:", transactions);
  }, [page]);

  return (
  <View style={{ flex: 1 }}>
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      onEndReached={() => setPage(prev => prev + 1)}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 15,
            backgroundColor: "#fff",
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.type}</Text>

          <Text>💰 {formatMoney(item.amount)}</Text>

          {item.sender && item.receiver && (
            <Text>
              👤 {item.sender.email} → {item.receiver.email}
            </Text>
          )}

          {item.receiver && !item.sender && (
            <Text>💳 Deposit to: {item.receiver.email}</Text>
          )}

          {item.suspicious && (
            <Text style={{ color: "red" }}>⚠️ Suspicious</Text>
          )}

          <Text>Status: {item.status}</Text>
          <Text>🕒 {formatDate(item.createdAt)}</Text>
        </View>
      )}
    />
  </View>
);
}

const formatMoney = (num) =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";

const formatDate = (date) =>
  new Date(date).toLocaleString("vi-VN");