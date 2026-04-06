import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import TransferScreen from "../screens/TransferScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import PaymentScreen from "../screens/PaymentScreen";
import DepositScreen from "../screens/DepositScreen";
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import React from "react";
import UserListScreen from "../screens/admin/UserListScreen";
import TransactionListScreen from "../screens/admin/TransactionListScreen";
import SuspiciousScreen from "../screens/admin/SuspiciousScreen";
import AuditLogScreen from "../screens/admin/AuditLogScreen";
import RegisterScreen from '../screens/RegisterScreen'
import LoginOtpScreen from '../screens/LoginOtpScreen'
import PaymentSuccessScreen from "../screens/PaymentSuccessScreen";
import AdminReportScreen from "../screens/admin/AdminReportScreen";
import SplitBillCreateScreen from "../screens/splitBill/SplitBillCreateScreen";
import SplitBillListScreen from "../screens/splitBill/SplitBillListScreen";
import SplitBillDetailScreen from "../screens/splitBill/SplitBillDetailScreen";
import RequestMoneyScreen from "../screens/RequestMoneyScreen";
import PendingRequestsScreen from "../screens/PendingRequestsScreen";
import UserReportScreen from "../screens/UserReportScreen";
import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['exp://'], 
  config: {
    screens: {
      Success: 'payment-success',  
      Deposit: 'payment-cancel'
    }
  }
}
const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const navigationRef = React.useRef();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;

      console.log("DEEPLINK:", url);

      if (url.includes("payment-success")) {
        navigationRef.current?.navigate("Success");
      }

      if (url.includes("payment-cancel")) {
        navigationRef.current?.navigate("Deposit");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
       <Stack.Screen name="SplitList" component={SplitBillListScreen} />
<Stack.Screen name="SplitCreate" component={SplitBillCreateScreen} />
<Stack.Screen name="SplitDetail" component={SplitBillDetailScreen} />
       <Stack.Screen name="RequestMoney" component={RequestMoneyScreen}/>
       <Stack.Screen name="PendingRequests" component={PendingRequestsScreen}/>
       <Stack.Screen name="UserReport" component={UserReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
