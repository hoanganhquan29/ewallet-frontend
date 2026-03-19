import { StyleSheet, Text, View } from "react-native";

const TransactionItem = ({ item, currentUserId }) => {


const getType = () => {
  const senderId = item.sender?.id;
  const receiverId = item.receiver?.id;

  if (item.type === "DEPOSIT") return "DEPOSIT";

  if (item.type === "TRANSFER") {
    if (senderId === currentUserId) return "SENT";
    if (receiverId === currentUserId) return "RECEIVED";
  }

  console.log("UNKNOWN:", item, "USER:", currentUserId);
  return "UNKNOWN";
};
const getDisplayText = () => {
  const senderEmail = item.sender?.email;
  const receiverEmail = item.receiver?.email;

  const type = getType();

  if (type === "SENT") return `To: ${receiverEmail}`;
  if (type === "RECEIVED") return `From: ${senderEmail}`;
  if (type === "DEPOSIT") return "Deposit";

  return "";
};
  const getColor = () => {
    if (getType() === "SENT") return "#ff4d4f";
    if (getType() === "RECEIVED") return "#52c41a";
    return "#1890ff";
  };

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
        {getType() === "SENT" ? "-" : "+"}
        {item.amount.toLocaleString()} VND
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
