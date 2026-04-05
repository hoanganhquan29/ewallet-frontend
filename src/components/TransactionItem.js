import { StyleSheet, Text, View } from "react-native";
const formatAmount = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return String(num);
};
const TransactionItem = ({ item, currentUserEmail }) => {


const getType = () => {
  const sender = item.senderEmail;
  const receiver = item.receiverEmail;

  if (item.type === "DEPOSIT") return "DEPOSIT";

  if (item.type === "TRANSFER") {
    if (sender === currentUserEmail) return "SENT";
    if (receiver === currentUserEmail) return "RECEIVED";
  }

  if (item.type === "REQUEST") {
    if (item.status === "PENDING") return "REQUEST_PENDING";
    if (item.status === "REJECTED") return "REQUEST_REJECTED";

    if (item.status === "SUCCESS") {
      if (sender === currentUserEmail) return "SENT";
      if (receiver === currentUserEmail) return "RECEIVED";
    }
  }

  return "UNKNOWN";
};
const getDisplayText = () => {
  const sender = item.senderEmail;
  const receiver = item.receiverEmail;
  const type = getType();

  if (type === "SENT") return `To: ${receiver}`;
  if (type === "RECEIVED") return `From: ${sender}`;
  if (type === "DEPOSIT") return "Deposit";

  if (type === "REQUEST_PENDING") return `Request from ${sender}`;
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
if (type === "SENT") sign = "-";
if (type === "RECEIVED") sign = "+";
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
          {item.date}
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
