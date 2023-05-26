// import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { UseScrollToTop } from './utils/useScrollToTop'
import Header from './components/Header'
import Home from './pages/home/Home'
import Footer from './components/Footer'
import CategoryDetails from './components/CategoryDetails'
import BookDetails from './pages/bookDetails/BookDetails'
import Basket from './pages/basket/Basket'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Payment from './components/Payment'
import UserAccount from './pages/userAccount/UserAccount'
import { AuthProvider } from './utils/AuthContext'
import './components/Btn.css'
import './components/reset.css'


function App() {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || [])
  const [numberOfCartItems, setNumberOfCartItems] = useState(JSON.parse(localStorage.getItem('numberOfCartItems')) || "")

  // Ajouter un produit dans le panier et mettre à jour la décompte des produits du panier
  const AddItemToCart = (product) => {
    // console.log(product)
    const exist = cartItems.find((element) => element.id === product.id)
    // Si on a le meme produit on incrémente la quantité
    if (exist) {
      // if(exist.quantity && exist.quantity === 15){
      //   return
      // }
      setCartItems(cartItems.map((item) => item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item))
    }
    // Si non la quantité reste à 1
    else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
    setNumberOfCartItems(Number(numberOfCartItems) + 1)
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
    setNumberOfCartItems(Number(numberOfCartItems) - 1)
  }

  // Supprime un produit du panier et mettre à jour la décompte des produits du panier
  const deleteItemFromCart = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id))
    setNumberOfCartItems(Number(numberOfCartItems) - product.quantity)
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

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout numberOfCartItems={numberOfCartItems}>
            <UseScrollToTop />
            <Routes>
              <Route path='/' element={<Home AddItemToCart={AddItemToCart} />} />
              <Route path='/genres/:id/:id' element={<CategoryDetails AddItemToCart={AddItemToCart} />} />
              <Route path='/details/:id' element={<BookDetails AddItemToCart={AddItemToCart} />} />
              <Route path='/basket' element={<Basket cartItems={cartItems} setCartItems={setCartItems} AddItemToCart={AddItemToCart} decrementCartItem={decrementCartItem} deleteItemFromCart={deleteItemFromCart} itemsPrice={itemsPrice} shippingPrice={shippingPrice} totalPrice={totalPrice} />} />
              <Route path='/signUp' element={<SignUp />} />
              <Route path='/signIn' location={{ key: 'signIn' }} element={<SignIn cartItems={cartItems} />} />
              <Route path='/payment' element={<Payment cartItems={cartItems} setCartItems={setCartItems} setNumberOfCartItems={setNumberOfCartItems} totalPrice={totalPrice} itemsPrice={itemsPrice} shippingPrice={shippingPrice} />} />
              <Route path='/userAccount' element={<UserAccount />} />
            </Routes>
          </MainLayout>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>

  );
}
const MainLayout = ({ children, numberOfCartItems }) => {
  const location = useLocation()
  return (
    <>
      {location.pathname !== "/payment" && <Header numberOfCartItems={numberOfCartItems} />}
      {children}
    </>
  )
}
export default App
