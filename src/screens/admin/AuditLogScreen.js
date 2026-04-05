import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getAuditLogs } from '../../api/adminApi'
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";
import { TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from "react-native";
export default function AuditLogScreen() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)
const [loading, setLoading] = useState(false)
const [totalPages, setTotalPages] = useState(1)

const [action, setAction] = useState("")
const [from, setFrom] = useState("")
const [to, setTo] = useState("")
const [showFrom, setShowFrom] = useState(false);
const [showTo, setShowTo] = useState(false);
const fetchLogs = async (customPage = page) => {
  if (loading) return;

  setLoading(true);

  try {
    const res = await getAuditLogs({
      page: customPage,
      action,
      from,
      to
    });

    setLogs(prev =>
      customPage === 0
        ? res.data.content
        : [...prev, ...res.data.content]
    );

    setTotalPages(res.data.totalPages);
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (page !== 0) {
    fetchLogs(page)
  }
}, [page])
useEffect(() => {
  setLogs([])
  setTotalPages(1)
  setPage(0)

  fetchLogs(0)   
}, [action, userId, from, to])
const getColor = (action) => {
  if (action === "LOCK_USER" || action === "DELETE_USER" || action === "LOGIN_FAILED" || action === "LOGIN_BLOCKED" || action === "ACCOUNT_LOCKED") return "red";
  if (action === "LOGIN_SUCCESS_2FA" || action === "LOGIN_GOOGLE") return "green";
  if (action === "OTP_SENT" || action === "LOGIN_PASSWORD_OK") return "orange";
  return COLORS.primary;
};
return (
   
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Audit Logs</Text>
      <Text style={styles.subtitle}>
        System activity tracking
      </Text>
    </View>

    <FlatList
    ListHeaderComponent={
  <View style={{ paddingHorizontal: SIZES.padding }}>

    {/* ACTION */}
    <Picker
  selectedValue={action}
  onValueChange={(v) => {
    setLogs([])
    setPage(0)
    setTotalPages(1)
    setAction(v)
  }}
>
  <Picker.Item label="All Actions" value="" />
  <Picker.Item label="Login Success (2FA)" value="LOGIN_SUCCESS_2FA" />
  
  <Picker.Item label="Login Password OK" value="LOGIN_PASSWORD_OK" />
  <Picker.Item label="Login Failed" value="LOGIN_FAILED" />
  <Picker.Item label="Login Blocked" value="LOGIN_BLOCKED" />
  <Picker.Item label="Account Locked" value="ACCOUNT_LOCKED" />
  <Picker.Item label="OTP Sent" value="OTP_SENT" />
  <Picker.Item label="Lock User" value="LOCK_USER" />
  <Picker.Item label="Unlock User" value="UNLOCK_USER" />
  <Picker.Item label="Delete User" value="DELETE_USER" />
 
</Picker>

    

    {/* FROM DATE */}
    <TouchableOpacity
      style={styles.input}
      onPress={() => setShowFrom(true)}
    >
      <Text>{from || "Select From Date"}</Text>
    </TouchableOpacity>

    {showFrom && (
      <DateTimePicker
        value={from ? new Date(from) : new Date()}
        mode="date"
        display="default"
        onChange={(e, date) => {
          setShowFrom(false);
          if (date) {
            const f = date.toISOString().split("T")[0];
            setLogs([])
            setPage(0)
            setTotalPages(1)
            setFrom(f)
          }
        }}
      />
    )}

    {/* TO DATE */}
    <TouchableOpacity
      style={styles.input}
      onPress={() => setShowTo(true)}
    >
      <Text>{to || "Select To Date"}</Text>
    </TouchableOpacity>

    {showTo && (
      <DateTimePicker
        value={to ? new Date(to) : new Date()}
        mode="date"
        display="default"
        onChange={(e, date) => {
          setShowTo(false);
          if (date) {
            const t = date.toISOString().split("T")[0];
            setLogs([])
            setPage(0)
            setTotalPages(1)
            setTo(t)
          }
        }}
      />
    )}

  </View>
}
    keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: SIZES.padding }}
      data={logs}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() + "_" + index : index.toString()
      }
      onEndReached={() => {
  if (!loading && page < totalPages - 1) {
    setPage(prev => prev + 1)
  }
}}      ListFooterComponent={
  loading ? <Text style={{ textAlign: "center" }}>Loading...</Text> : null
}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
  <View style={styles.card}>

    <Text style={[
      styles.action,
      { color: getColor(item.action) }
    ]}>
      {item.action}
    </Text>

    <Text style={styles.message}>
      {item.description}
    </Text>

    <View style={styles.footer}>
      <Text style={styles.ip}>
        🌐 {item.ip}
      </Text>

      <Text style={styles.date}>
        {formatDate(item.time)}
      </Text>
    </View>

  </View>
)}

    />

  </View>
  
);
}
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("vi-VN");
};
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

  action: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  info: {
    marginTop: 6,
    color: COLORS.secondary,
  },

  message: {
    marginTop: 6,
    color: COLORS.primary,
  },

  footer: {
    marginTop: 10,
  },

  ip: {
    fontSize: 12,
    color: COLORS.secondary,
  },

  date: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  input: {
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 6,
  padding: 8,
  marginTop: 8,
},
});