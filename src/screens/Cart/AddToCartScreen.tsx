import React, { useState, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { CartContext } from "../../store/CartContext";

export default function AddToCartScreen({ route, navigation }: any) {

  const { item } = route.params;
  const { addToCart } = useContext(CartContext);

  const [qty, setQty] = useState(1);

  const increase = () => setQty(qty + 1);

  const decrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const addItem = () => {
    addToCart(item, qty);
    navigation.navigate("Cart");
  };

  return (

    <View style={styles.container}>

      <Image source={{ uri:item.imageUrl }} style={styles.image}/>

      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.desc}>{item.description}</Text>

      <Text style={styles.price}>R {item.price}</Text>

      <View style={styles.qtyRow}>

        <Button mode="outlined" onPress={decrease}>−</Button>

        <Text style={styles.qty}>{qty}</Text>

        <Button mode="outlined" onPress={increase}>+</Button>

      </View>

      <Button
        mode="contained"
        style={{ marginTop:20 }}
        onPress={addItem}
      >
        Add To Cart
      </Button>

    </View>

  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20
  },

  image:{
    width:"100%",
    height:220,
    borderRadius:20
  },

  title:{
    fontSize:22,
    fontWeight:"bold",
    marginTop:15
  },

  desc:{
    marginTop:10,
    fontSize:16
  },

  price:{
    marginTop:10,
    fontWeight:"bold"
  },

  qtyRow:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:20
  },

  qty:{
    marginHorizontal:20,
    fontSize:18,
    fontWeight:"bold"
  }

});