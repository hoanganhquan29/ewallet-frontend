import AsyncStorage from '@react-native-async-storage/async-storage'

export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('token')

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  } catch (error) {
    console.log('Logout error:', error)
  }
}