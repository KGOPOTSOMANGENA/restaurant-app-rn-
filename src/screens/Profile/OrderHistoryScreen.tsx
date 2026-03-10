import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Text, Card } from "react-native-paper";
import { db, auth } from "../../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function OrderHistoryScreen() {

  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {

    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("uid", "==", user.uid)
    );

    const snap = await getDocs(q);

    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (

    <View style={{ flex:1, padding:20 }}>

      <Text variant="headlineMedium" style={{ marginBottom:20 }}>
        My Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (

          <Card style={{ marginBottom:10 }}>
            <Card.Content>

              <Text>Total: R {item.total}</Text>
              <Text>Address: {item.address}</Text>

              <Text>
                Items: {item.items?.length}
              </Text>

            </Card.Content>
          </Card>

        )}
      />

    </View>
  );
}