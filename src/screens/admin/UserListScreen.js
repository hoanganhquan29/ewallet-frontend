import { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, TouchableOpacity, 
  Alert, StyleSheet, Image, Modal, ScrollView 
} from 'react-native';
import { getUsers, lockUser, unlockUser, deleteUser, updateUser } from '../../api/adminApi';
import { COLORS, SIZES } from "../../theme/theme";

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await updateUser(selectedUser.email, {
        ...selectedUser,
        role: role,
      });
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      Alert.alert("Error", "Could not update user");
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.cardInfo}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.email.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.roleBadge, { backgroundColor: item.role === 'ADMIN' ? '#EEF2FF' : '#F8FAFC' }]}>
              <Text style={[styles.roleText, { color: item.role === 'ADMIN' ? '#4F46E5' : '#64748B' }]}>{item.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.locked ? '#FFF1F2' : '#F0FDF4' }]}>
              <Text style={[styles.statusText, { color: item.locked ? '#E11D48' : '#166534' }]}>
                {item.locked ? "Locked" : "Active"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionIconBtn} onPress={() => openEditModal(item)}>
          <Text style={styles.actionIconText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionIconBtn} 
          onPress={() => item.locked ? unlockUser(item.email).then(fetchUsers) : lockUser(item.email).then(fetchUsers)}
        >
          <Text style={[styles.actionIconText, { color: item.locked ? '#059669' : '#D97706' }]}>
            {item.locked ? "Unlock" : "Lock"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionIconBtn} onPress={() => handleDelete(item.email)}>
          <Text style={[styles.actionIconText, { color: '#E11D48' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleDelete = (email) => {
    Alert.alert("Confirm Delete", `Are you sure you want to remove ${email}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await deleteUser(email);
          fetchUsers();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Directory</Text>
        <Text style={styles.headerSubtitle}>{users.length} total members</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#0F172A" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* MODERN EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Role</Text>
            <Text style={styles.modalSub}>{selectedUser?.email}</Text>

            <View style={styles.roleSelector}>
              {['USER', 'ADMIN'].map((r) => (
                <TouchableOpacity 
                  key={r}
                  style={[styles.roleOption, role === r && styles.roleOptionSelected]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleOptionText, role === r && styles.roleOptionTextSelected]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 60,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Shadow cho độ nổi khối
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  actionIconBtn: {
    marginLeft: 20,
  },
  actionIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  roleOptionSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleOptionText: {
    fontWeight: '600',
    color: '#64748B',
  },
  roleOptionTextSelected: {
    color: '#0F172A',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});