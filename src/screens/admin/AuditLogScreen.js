import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getAuditLogs } from '../../api/adminApi'

export default function AuditLogScreen() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)

  const fetchLogs = async () => {
    const res = await getAuditLogs(page)
    setLogs(prev => [...prev, ...res.data.content])
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  return (
    <FlatList
      data={logs}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={() => setPage(prev => prev + 1)}
renderItem={({ item }) => {
  const d = parseDetails(item.details);

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        {item.action}
      </Text>

      {/* EMAIL */}
      {d.email && (
        <Text>👤 {d.email}</Text>
      )}

      {/* MESSAGE */}
      {d.message && (
        <Text>{d.message}</Text>
      )}

      <Text>🌐 IP: {item.ipAddress}</Text>
      <Text>🕒 {formatDate(item.createdAt)}</Text>
    </View>
  );
}}
    />
  )
}
const parseDetails = (details) => {
  try {
    return JSON.parse(details);
  } catch {
    return { message: details };
  }
};

const formatMoney = (num) =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("vi-VN");
};