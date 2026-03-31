import { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { getUsers, lockUser, unlockUser, deleteUser } from '../../api/adminApi'
import { updateUser } from '../../api/adminApi'
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../../theme/theme";
import { Modal, TextInput } from "react-native"
import logo from "../../assets/logo.png";
export default function UserListScreen() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
const [selectedUser, setSelectedUser] = useState(null)
const [modalVisible, setModalVisible] = useState(false)

const [role, setRole] = useState("")
const [enabled, setEnabled] = useState(true)
const openEditModal = (user) => {
  setSelectedUser(user)
  setRole(user.role) 
  setModalVisible(true)
}
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
const handleUpdate = async () => {
  try {
    await updateUser(selectedUser.email, {
  email: selectedUser.email,
  phone: selectedUser.phone,
  role: role,
  enabled: selectedUser.enabled === true,
  locked: selectedUser.locked === true
})

    setModalVisible(false)
    fetchUsers()
  } catch (err) {
    console.log("UPDATE ERROR:", err?.response?.data || err.message)
  }
}
const handleLock = async (id) => {
  console.log("CLICK LOCK:", id)

  try {
    const res = await lockUser(id)

    console.log("LOCK SUCCESS:", res?.data)

    fetchUsers()
  } catch (err) {
    console.log("LOCK ERROR:", err?.response?.data || err.message)
  }
}

const handleUnlock = async (id) => {
  console.log("CLICK UNLOCK:", id)

  try {
    const res = await unlockUser(id)

    console.log("UNLOCK SUCCESS:", res?.data)

    fetchUsers()
  } catch (err) {
    console.log("UNLOCK ERROR:", err?.response?.data || err.message)
  }
}

const handleDelete = (id) => {
  Alert.alert("Confirm", "Delete this user?", [
    { text: "Cancel" },
    {
      text: "Delete",
      onPress: async () => {
        await deleteUser(id)
        fetchUsers()
      },
    },
  ])
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
        console.log("USER ITEM:", item),
        <View style={styles.card}>
  <Text style={styles.email}>{item.email}</Text>
  <Text style={styles.role}>Role: {item.role}</Text>
  <Text>Status: {item.locked ? "LOCKED" : "ACTIVE"}</Text>

  <View style={styles.actions}>
    <TouchableOpacity
  style={styles.editBtn}
  onPress={() => openEditModal(item)}
>
  <Text style={styles.btnText}>Edit</Text>
</TouchableOpacity>
    {item.locked ? (
      <TouchableOpacity
        style={styles.unlockBtn}
        onPress={() => handleUnlock(item.email)}
      >
        <Text style={styles.btnText}>Unlock</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.lockBtn}
        onPress={() => handleLock(item.email)}
      >
        <Text style={styles.btnText}>Lock</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => handleDelete(item.email)}
    >
      <Text style={styles.btnText}>Delete</Text>
    </TouchableOpacity>
   
  </View>
</View>
      )}
    />
<Modal visible={modalVisible} transparent animationType="slide">
  <View style={{
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  }}>
    <View style={{
      backgroundColor: "white",
      margin: 20,
      padding: 20,
      borderRadius: 10
    }}>

      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Edit User
      </Text>

      <Text>Email: {selectedUser?.email}</Text>

      <Text>Role</Text>
      <Text style={{ marginTop: 10 }}>Role</Text>

<View style={{ flexDirection: "row", marginVertical: 10 }}>

  <TouchableOpacity
    style={[
      styles.roleBtn,
      role === "USER" && styles.selectedRole
    ]}
    onPress={() => setRole("USER")}
  >
    <Text style={styles.btnText}>USER</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.roleBtn,
      role === "ADMIN" && styles.selectedRole
    ]}
    onPress={() => setRole("ADMIN")}
  >
    <Text style={styles.btnText}>ADMIN</Text>
  </TouchableOpacity>

</View>
      <TouchableOpacity
        onPress={handleUpdate}
        style={styles.editBtn}
      >
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text>Cancel</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>
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
  actions: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
},

lockBtn: {
  backgroundColor: "orange",
  padding: 8,
  borderRadius: 6,
},

unlockBtn: {
  backgroundColor: "green",
  padding: 8,
  borderRadius: 6,
},

deleteBtn: {
  backgroundColor: "red",
  padding: 8,
  borderRadius: 6,
},

btnText: {
  color: "#fff",
  fontWeight: "600",
},
editBtn: {
  backgroundColor: "blue",
  padding: 8,
  borderRadius: 6,
},
roleBtn: {
  flex: 1,
  backgroundColor: "gray",
  padding: 10,
  marginHorizontal: 5,
  borderRadius: 6,
  alignItems: "center"
},

selectedRole: {
  backgroundColor: "blue"
},
});