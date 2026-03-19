import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function AdminHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Users')} style={styles.card}>
        <Text>👤 Manage Users</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AdminTransactions')} style={styles.card}>
        <Text>💸 All Transactions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Suspicious')} style={styles.card}>
        <Text>⚠️ Suspicious Transactions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AuditLogs')} style={styles.card}>
        <Text>📜 Audit Logs</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 20,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 10,
  },
})