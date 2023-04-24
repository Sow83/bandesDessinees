// import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import Genres from './components/Genres'
import BookDetails from './components/BookDetails'
import Basket from './components/Basket'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Payment from './components/Payment'
import Profile from './components/Profile'
import { AuthProvider } from './AuthContext'
import './components/Btn.css'
import './components/reset.css'


function App() {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || [])
  const [numberOfCartItems, setNumberOfCartItems] = useState(JSON.parse(localStorage.getItem('numberOfCartItems')) || "")
 
  // Ajouter un produit dans le panier et mettre à jour la décompte des produits du panier
  const AddtoCart = (product) => {
    // console.log(product)
    const exist = cartItems.find((element) => element.id === product.id )  
    // Si on a le meme produit on incrémente la quantité
    if(exist) {
      if(exist.quantity && exist.quantity === 15){
        return
      }
      setCartItems(cartItems.map((item) => item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item))
    }
    // Si non la quantité reste à 1
    else{
      setCartItems([ ...cartItems, { ...product, quantity: 1}])
    }
    setNumberOfCartItems(Number(numberOfCartItems) + 1)
  }

  /* Diminuer la quantité de produit dans le panier(décrémenter la quantité d'un produit)
     et mettre à jour la décompte des produits du panier
  */
  const removeToCart = (product) => {
    const exist = cartItems.find((element) => element.id === product.id )
    // Si la quantité du produit dans le panier est de 1, au prochain décrémention il retourne rien et ça s'arrete là
    if(exist.quantity === 1) {    
      return
    }
   // Si non on décrémente la quantité
    else{
      setCartItems(cartItems.map((item) => item.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : item))
    }
    setNumberOfCartItems(Number(numberOfCartItems) - 1)
  }

  // Supprime un produit du panier et mettre à jour la décompte des produits du panier
  const removeItemCart = (product) =>{
    setCartItems(cartItems.filter((item) => item.id !== product.id)) 
    setNumberOfCartItems(Number(numberOfCartItems) - product.quantity)
  }
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    localStorage.setItem('numberOfCartItems', JSON.stringify(numberOfCartItems))
  }, [cartItems, numberOfCartItems])
  return (
    <> 
        <BrowserRouter>
          <AuthProvider>
            <Header numberOfCartItems={numberOfCartItems} />  
            <Routes>    
                <Route path='/' element={<Home AddtoCart={AddtoCart}/>} />
                <Route path='/genres/:id/:id' element={<Genres AddtoCart={AddtoCart} />} />   
                <Route path='/details/:id' element={<BookDetails AddtoCart={AddtoCart}/>} />   
                <Route path='/basket' element={<Basket cartItems={cartItems} setCartItems={setCartItems} AddtoCart={AddtoCart} removeToCart={removeToCart} removeItemCart={removeItemCart} />} />
                <Route path='/signUp' element={<SignUp />}/>   
                <Route path='/signIn' element={<SignIn cartItems={cartItems} />}/>  
                <Route path='/payment' element={<Payment />}/>   
                <Route path='/profile' element={<Profile />}/>   
            </Routes>
            <Footer />  
          </AuthProvider>
        </BrowserRouter>
    </>  

  );
}

export default App
