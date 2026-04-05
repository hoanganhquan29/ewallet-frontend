import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createSplitBill } from "../../api/splitBillApi";

export default function SplitBillCreateScreen({ navigation }) {
  const [emails, setEmails] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [equalSplit, setEqualSplit] = useState(true);
  const [customAmounts, setCustomAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const addEmail = () => {
    if (!inputEmail) return;
    if (!isValidEmail(inputEmail)) {
      setError("Please enter a valid email");
      return;
    }
    if (emails.includes(inputEmail)) {
      setError("This email is already added");
      return;
    }
    setEmails([...emails, inputEmail]);
    setInputEmail("");
    setError("");
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleCustomAmount = (email, value) => {
    setCustomAmounts({
      ...customAmounts,
      [email]: Number(value),
    });
  };

  const handleSubmit = async () => {
    try {
      setError("");
      if (!emails.length) {
        setError("Add at least one friend to split with");
        return;
      }
      if (!totalAmount) {
        setError("Total amount is required");
        return;
      }
      if (!equalSplit) {
        if (Object.keys(customAmounts).length !== emails.length) {
          setError("Enter amounts for all participants");
          return;
        }
        const totalCustom = Object.values(customAmounts).reduce((sum, val) => sum + val, 0);
        if (totalCustom !== Number(totalAmount)) {
          setError("Custom amounts must sum up to total");
          return;
        }
      }

      setLoading(true);
      const payload = {
        emails,
        totalAmount: Number(totalAmount),
        equalSplit,
        customAmounts: equalSplit ? {} : customAmounts,
      };

      await createSplitBill(payload);
      alert("Split bill request sent!");
      navigation.goBack();
    } catch (err) {
      setError("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.participantCard}>
      <View style={styles.participantInfo}>
        <Text style={styles.participantEmail}>{item}</Text>
        <TouchableOpacity onPress={() => removeEmail(item)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      {!equalSplit && (
        <View style={styles.customInputWrapper}>
          <Text style={styles.currencyLabel}>VND</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="#CBD5E1"
            keyboardType="numeric"
            onChangeText={(val) => handleCustomAmount(item, val)}
            style={styles.customAmountInput}
          />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.label}>Recipient Email</Text>
        <View style={styles.inputGroup}>
          <TextInput
            value={inputEmail}
            onChangeText={setInputEmail}
            placeholder="friend@example.com"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            style={styles.mainInput}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addEmail}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Participants ({emails.length})</Text>
          <FlatList
            data={emails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No friends added yet</Text>
            }
          />
        </View>

        <Text style={styles.label}>Total Bill Amount</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountCurrency}>VND</Text>
          <TextInput
            value={totalAmount}
            onChangeText={setTotalAmount}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            style={styles.totalAmountInput}
          />
        </View>

        <Text style={styles.label}>Split Method</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, equalSplit && styles.toggleBtnActive]} 
            onPress={() => setEqualSplit(true)}
          >
            <Text style={[styles.toggleText, equalSplit && styles.toggleTextActive]}>Equally</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, !equalSplit && styles.toggleBtnActive]} 
            onPress={() => setEqualSplit(false)}
          >
            <Text style={[styles.toggleText, !equalSplit && styles.toggleTextActive]}>Custom</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="#0F172A" />
        ) : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Create Request</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mainInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  addBtn: {
    backgroundColor: '#0F172A',
    marginLeft: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  errorText: {
    color: '#E11D48',
    fontSize: 13,
    marginBottom: 20,
  },
  listSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  participantCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  participantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantEmail: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  removeText: {
    fontSize: 12,
    color: '#E11D48',
    fontWeight: '600',
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 8,
  },
  customAmountInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    padding: 0,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  amountCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    marginRight: 10,
  },
  totalAmountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleTextActive: {
    color: '#1E293B',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 10,
  }
});