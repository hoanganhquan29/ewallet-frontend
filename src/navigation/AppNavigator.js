import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import TransferScreen from "../screens/TransferScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="OTP" component={OtpScreen} />
        <Stack.Screen name="Transactions" component={TransactionHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
