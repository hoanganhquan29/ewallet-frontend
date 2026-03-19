import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getSuspicious } from '../../api/adminApi'

export default function SuspiciousScreen() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)

  const fetchData = async () => {
    try {
      const res = await getSuspicious(page)

      console.log("SUSPICIOUS API:", res.data) // debug

      setData(prev => [...prev, ...res.data.content]) // 🔥 QUAN TRỌNG
    } catch (e) {
      console.log("ERROR:", e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        onEndReached={() => setPage(prev => prev + 1)}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: '#ffe6e6',
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              ⚠️ Suspicious Transaction
            </Text>

            <Text>💰 {formatMoney(item.amount)}</Text>

            {item.sender && item.receiver && (
              <Text>
                👤 {item.sender.email} → {item.receiver.email}
              </Text>
            )}

            <Text>Status: {item.status}</Text>
            <Text>🕒 {formatDate(item.createdAt)}</Text>
          </View>
        )}
      />
    </View>
  )
}

const formatMoney = (num) =>
  new Intl.NumberFormat('vi-VN').format(num) + ' VND'

const formatDate = (date) =>
  new Date(date).toLocaleString('vi-VN')