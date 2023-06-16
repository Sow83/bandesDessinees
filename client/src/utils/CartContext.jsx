import { createContext, useState, useEffect } from "react";

export const CartContext = createContext("")

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || [])
  const [numberOfCartItems, setNumberOfCartItems] = useState(JSON.parse(localStorage.getItem('numberOfCartItems')) || 0)

  // Ajouter un produit dans le panier et mettre à jour la décompte des produits du panier
  const AddItemToCart = (product, quantityToAdd) => {
    const exist = cartItems.find((element) => element.id === product.id)
    // Si on a le meme produit on incrémente la quantité
    if (exist) {
      setCartItems(cartItems.map((item) => item.id === product.id ? { ...exist, quantity: exist.quantity + quantityToAdd } : item))
    }
    // Si non la quantité reste à 1
    else {
      setCartItems([...cartItems, { ...product, quantity: quantityToAdd }])
    }
    setNumberOfCartItems(numberOfCartItems + quantityToAdd)
  }

  /* Diminuer la quantité de produit dans le panier(décrémenter la quantité d'un produit)
     et mettre à jour la décompte des produits du panier
  */
  const decrementCartItem = (product) => {
    const exist = cartItems.find((element) => element.id === product.id)
    // Si la quantité du produit dans le panier est de 1, au prochain décrémention il retourne rien et ça s'arrete là
    if (exist.quantity === 1) {
      return
    }
    // Si non on décrémente la quantité
    else {
      setCartItems(cartItems.map((item) => item.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : item))
    }
    setNumberOfCartItems(numberOfCartItems - 1)
  }

  // Supprime un produit du panier et met à jour la décompte des produits du panier
  const deleteItemFromCart = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id))
    setNumberOfCartItems(numberOfCartItems - product.quantity)
  }

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    localStorage.setItem('numberOfCartItems', JSON.stringify(numberOfCartItems))
  }, [cartItems, numberOfCartItems])

  // Calcul des prix de la commande
  const itemsPrice = cartItems.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity, 0)

  const shippingPrice = itemsPrice >= 100 ? 0 : 10
  const totalPrice = itemsPrice + shippingPrice

  const value = {
    cartItems,
    numberOfCartItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    setCartItems,
    setNumberOfCartItems,
    AddItemToCart,
    decrementCartItem,
    deleteItemFromCart, 
  };

  return (
    <CartContext.Provider value={{value}}>
      {children}
    </CartContext.Provider>
  );
}


