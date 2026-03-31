import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getAllTransactions } from "../../api/adminApi";
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";
import { TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
const [email, setEmail] = useState("");
const [type, setType] = useState("");
const [status, setStatus] = useState("");
const [from, setFrom] = useState("");
const [to, setTo] = useState("");
const [showFromPicker, setShowFromPicker] = useState(false);
const [showToPicker, setShowToPicker] = useState(false);
const [reload, setReload] = useState(false);
const fetchData = async () => {
  try {
    console.log("FETCH PAGE:", page);

    let params = {
      page,
      size: 10,
    };

    if (type) params.type = type;
    if (status) params.status = status;
    if (from) params.from = from.slice(0, 19);
if (to) params.to = to.slice(0, 19);

if (email) params.email = email;

    const res = await getAllTransactions(params);

    const newData = res.data.content;

    console.log("NEW DATA:", newData.length);

    if (page === 0) {
      setTransactions(newData); 
    } else {
      setTransactions(prev => [...prev, ...newData]);
    }

  } catch (e) {
    console.log("FETCH ERROR:", e);
  }
};
const applyFilter = () => {
  setTransactions([]);
  setPage(0);
  setReload(prev => !prev); 
};
useEffect(() => {
  fetchData();
}, [page, reload]);

return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>All Transactions</Text>
      <Text style={styles.subtitle}>Monitor system activity</Text>
    </View>
<View style={styles.filterBox}>

  {/* EMAIL */}
  <TextInput
    placeholder="Search email"
    value={email}
    onChangeText={setEmail}
    style={styles.input}
  />

  {/* TYPE */}
  <View style={styles.row}>
    <TouchableOpacity
  onPress={() => setType("TRANSFER")}
  style={[
    styles.input,
    type === "TRANSFER" && { backgroundColor: "#4CAF50" }
  ]}
>
  <Text style={{ color: type === "TRANSFER" ? "white" : "black" }}>
    TRANSFER
  </Text>
</TouchableOpacity>

    <TouchableOpacity
  onPress={() => setType("DEPOSIT")}
  style={[
    styles.input,
    type === "DEPOSIT" && { backgroundColor: "#4CAF50" }
  ]}
>
  <Text style={{ color: type === "DEPOSIT" ? "white" : "black" }}>
    DEPOSIT
  </Text>
</TouchableOpacity>

    <TouchableOpacity
  onPress={() => setType("")}
  style={[
    styles.input,
    type === "" && { backgroundColor: "#4CAF50" }
  ]}
>
  <Text style={{ color: type === "" ? "white" : "black" }}>
    ALL
  </Text>
</TouchableOpacity>
  </View>

  {/* STATUS */}
  <View style={styles.row}>
    <TouchableOpacity
    onPress={() => setStatus("SUCCESS")}
    style={[
      styles.input,
      status === "SUCCESS" && { backgroundColor: "#4CAF50" }
    ]}
  >
    <Text style={{ color: status === "SUCCESS" ? "white" : "black" }}>
      SUCCESS
    </Text>
  </TouchableOpacity>

    <TouchableOpacity
    onPress={() => setStatus("FAILED")}
    style={[
      styles.input,
      status === "FAILED" && { backgroundColor: "#4CAF50" }
    ]}
  >
    <Text style={{ color: status === "FAILED" ? "white" : "black" }}>
      FAILED
    </Text>
  </TouchableOpacity>

    <TouchableOpacity
    onPress={() => setStatus("")}
    style={[
      styles.input,
      status === "" && { backgroundColor: "#4CAF50" }
    ]}
  >
    <Text style={{ color: status === "" ? "white" : "black" }}>
      ALL
    </Text>
  </TouchableOpacity>
  </View>

<TouchableOpacity onPress={() => setShowFromPicker(true)}>
  <Text style={styles.input}>
    {from ? new Date(from).toLocaleDateString() : "Select From Date"}
  </Text>
</TouchableOpacity>

{showFromPicker && (
  <DateTimePicker
    value={new Date()}
    mode="date"
    onChange={(e, date) => {
      setShowFromPicker(false);
      if (date) setFrom(date.toISOString());
    }}
  />
)}

<TouchableOpacity onPress={() => setShowToPicker(true)}>
  <Text style={styles.input}>
    {to ? new Date(to).toLocaleDateString() : "Select To Date"}
  </Text>
</TouchableOpacity>

{showToPicker && (
  <DateTimePicker
    value={new Date()}
    mode="date"
    onChange={(e, date) => {
      setShowToPicker(false);
      if (date) setTo(date.toISOString());
    }}
  />
)}

  {/* APPLY */}
  <TouchableOpacity style={styles.button} onPress={applyFilter}>
    <Text>Apply Filter</Text>
  </TouchableOpacity>

</View>
    {/* LIST */}
    <FlatList
      contentContainerStyle={{ padding: SIZES.padding }}
      data={transactions}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() + "_" + index : index.toString()
      }
      onEndReached={() => setPage(prev => prev + 1)}
      renderItem={({ item }) => (
        <View style={styles.card}>

          {/* TOP ROW */}
          <View style={styles.rowBetween}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.amount}>
              {formatMoney(item.amount)}
            </Text>
          </View>

          {/* USERS */}
          {item.sender && item.receiver && (
            <Text style={styles.info}>
              {item.sender.email} → {item.receiver.email}
            </Text>
          )}

          {item.receiver && !item.sender && (
            <Text style={styles.info}>
              Deposit → {item.receiver.email}
            </Text>
          )}

          {/* STATUS */}
          <View style={styles.rowBetween}>
            <Text style={styles.status}>
              {item.status}
            </Text>

            {item.suspicious && (
              <Text style={styles.suspicious}>
                ⚠️ Suspicious
              </Text>
            )}
          </View>

          {/* DATE */}
          <Text style={styles.date}>
            {formatDate(item.createdAt)}
          </Text>

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

  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontWeight: "600",
    color: COLORS.primary,
  },

  amount: {
    fontWeight: "700",
    color: COLORS.primary,
  },

  info: {
    marginTop: 6,
    color: COLORS.secondary,
  },

  status: {
    marginTop: 8,
    color: COLORS.secondary,
  },

  suspicious: {
    color: "red",
    fontWeight: "600",
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.secondary,
  },
  input: {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 8,
  marginVertical: 6,
  backgroundColor: "white",
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 6,
},

filterBox: {
  backgroundColor: "white",
  margin: 10,
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#ddd",
},

button: {
  backgroundColor: "#4CAF50",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
},
});