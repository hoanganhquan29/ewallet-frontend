import { StyleSheet, Text, View } from "react-native";
const formatAmount = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return String(num);
};
const TransactionItem = ({ item, currentUserEmail }) => {


const getType = () => {
  const senderEmail = item.sender?.email;
  const receiverEmail = item.receiver?.email;

  // ===== DEPOSIT =====
  if (!item.sender && item.receiver) {
    return "DEPOSIT";
  }

  // ===== TRANSFER =====
  if (item.type === "TRANSFER") {
    if (senderEmail === currentUserEmail) return "SENT";
    if (receiverEmail === currentUserEmail) return "RECEIVED";
  }

  // ===== REQUEST =====
  if (item.type === "REQUEST") {
    if (item.status === "PENDING") return "REQUEST_PENDING";
    if (item.status === "REJECTED") return "REQUEST_REJECTED";

    if (item.status === "SUCCESS") {
      if (senderEmail === currentUserEmail) return "SENT";
      if (receiverEmail === currentUserEmail) return "RECEIVED";
    }
  }

  // ===== FALLBACK =====
  if (receiverEmail === currentUserEmail) return "RECEIVED";
  if (senderEmail === currentUserEmail) return "SENT";

  return "UNKNOWN";
};
const getDisplayText = () => {
  const senderEmail = item.sender?.email;
  const receiverEmail = item.receiver?.email;

  const type = getType();

  if (type === "SENT") return `To: ${receiverEmail}`;
  if (type === "RECEIVED") return `From: ${senderEmail}`;
  if (type === "DEPOSIT") return "Deposit (Bank)";

  if (type === "REQUEST_PENDING") return `Request to ${senderEmail}`;
  if (type === "REQUEST_REJECTED") return `Request rejected`;

  return "";
};
const getColor = () => {
  const type = getType();

  if (type === "SENT") return "#ff4d4f";
  if (type === "RECEIVED") return "#52c41a";
  if (type === "REQUEST_PENDING") return "#faad14";
  if (type === "REQUEST_REJECTED") return "#999";
if (type === "DEPOSIT") return "#1890ff";
  return "#1890ff";
};
const type = getType();

let sign = "";
let amount = item.amount;

if (type === "SENT") {
  sign = "-";
} else if (type === "RECEIVED") {
  sign = "+";
} else {
  sign = ""; 
}
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.type}>{getType()}</Text>
        <Text style={styles.subText}>{getDisplayText()}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      <Text style={[styles.amount, { color: getColor() }]}>
  {sign}{formatAmount(amount)}đ
</Text>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
