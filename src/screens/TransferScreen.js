import { useState } from "react";
import { 
  Keyboard, 
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet, 
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";
import { requestTransfer } from "../api/walletApi";

export default function TransferScreen({ navigation }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!receiverEmail || !amount) {
      return Alert.alert("Error", "Fill all fields");
    }

    if (Number(amount) <= 0) {
      return Alert.alert("Error", "Amount must > 0");
    }

    try {
      setLoading(true);

      await requestTransfer({
        receiverEmail,
        amount: Number(amount),
      });

      Alert.alert("Success", "OTP sent");

      navigation.navigate("OTP", {
        receiverEmail,
        amount,
      });
    } catch (err) {
      Alert.alert(
        "Error",
        JSON.stringify(err.response?.data || "Transfer failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            
            {/* HEADER SECTION */}
            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <Image source={logo} style={styles.logo} />
              </View>
              <Text style={styles.headerSubtitle}>Money Transfer</Text>
              <Text style={styles.headerTitle}>Send Funds</Text>
              <Text style={styles.description}>
                Transfer money instantly to another user by entering their registered email address.
              </Text>
            </View>

            {/* FORM SECTION */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={receiverEmail}
                    onChangeText={setReceiverEmail}
                    placeholder="example@mail.com"
                    placeholderTextColor="#AEAEB2"
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currency}>₫</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#AEAEB2"
                    style={[styles.input, styles.amountInput]}
                  />
                </View>
              </View>
            </View>

            {/* ACTION SECTION */}
            <View style={styles.footer}>
              {loading ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <TouchableOpacity
                  onPress={handleSendOtp}
                  style={styles.button}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Send OTP Verification</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.backLink}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backLinkText}>Cancel and go back</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  header: {
    alignItems: "flex-start", // Minimalism thường ưu tiên căn lề trái để tạo sự hiện đại
    marginBottom: 40,
  },
  logoWrapper: {
    backgroundColor: "#F2F2F7",
    padding: 10,
    borderRadius: 16,
    marginBottom: 20,
  },
  logo: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: "#636366",
    marginTop: 12,
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  currency: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  amountInput: {
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#000000", // Màu đen thuần mang lại cảm giác minimalism cao cấp
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backLink: {
    marginTop: 20,
    alignItems: "center",
  },
  backLinkText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
});