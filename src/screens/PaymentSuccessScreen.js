import { View, Text, StyleSheet, Button } from 'react-native'
import { useEffect } from 'react'
import { getBalance } from '../api/walletApi'

export default function PaymentSuccessScreen({ navigation }) {

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const balance = await getBalance()
      console.log("New balance:", balance)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Payment Successful</Text>

      <Text style={styles.subtitle}>
        Your wallet has been credited
      </Text>

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green"
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16
  }
})