import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import TransferScreen from "../screens/TransferScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import PaymentScreen from "../screens/PaymentScreen";
import DepositScreen from "../screens/DepositScreen";
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";

import UserListScreen from "../screens/admin/UserListScreen";
import TransactionListScreen from "../screens/admin/TransactionListScreen";
import SuspiciousScreen from "../screens/admin/SuspiciousScreen";
import AuditLogScreen from "../screens/admin/AuditLogScreen";
import RegisterScreen from '../screens/RegisterScreen'
import LoginOtpScreen from '../screens/LoginOtpScreen'
import PaymentSuccessScreen from "../screens/PaymentSuccessScreen";
import AdminReportScreen from "../screens/admin/AdminReportScreen";
import * as Linking from 'expo-linking'

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Success: 'success',
      Cancel: 'cancel'
    }
  }
}
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="OTP" component={OtpScreen} />
        <Stack.Screen name="Transactions" component={TransactionHistoryScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Deposit" component={DepositScreen} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="Users" component={UserListScreen} />
<Stack.Screen name="AdminTransactions" component={TransactionListScreen} />
<Stack.Screen name="Suspicious" component={SuspiciousScreen} />
<Stack.Screen name="AuditLogs" component={AuditLogScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
<Stack.Screen name="LoginOtp" component={LoginOtpScreen} />
<Stack.Screen name="Success" component={PaymentSuccessScreen} />
       <Stack.Screen name="AdminReport" component={AdminReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
