import { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { getUsers } from '../../api/adminApi'
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import logo from "../../assets/logo.png";
export default function UserListScreen() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
}

return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Users</Text>
      <Text style={styles.subtitle}>Manage system users</Text>
    </View>

    {/* LIST */}
    <FlatList
      contentContainerStyle={{ padding: SIZES.padding }}
      data={users}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() + "_" + index : index.toString()
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.role}>Role: {item.role}</Text>
        </View>
      )}
    />

  </View>
);
}
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

  email: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },

  role: {
    marginTop: 5,
    color: COLORS.secondary,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});