import './App.css';
import './globalStyles/form.css'
import './globalStyles/Card.css'
import './globalStyles/Btn.css'
import './globalStyles/reset.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { UseScrollToTop } from './utils/useScrollToTop'
import Header from './components/header/Header'
import Home from './pages/home/Home'
import Footer from './components/footer/Footer'
import CategoryListing from './pages/CategoryListing/CategoryListing'
import BookDetails from './pages/bookDetails/BookDetails'
import Basket from './pages/basket/Basket'
import SignUp from './pages/signUp/SignUp'
import SignIn from './pages/signIn/SignIn'
import Payment from './pages/payment/Payment'
import SearchResults from './pages/SearchResults/SearchResults'
import UserAccount from './pages/userAccount/UserAccount'
import { AuthProvider } from './utils/AuthContext'
import { CartProvider } from './utils/CartContext'
import ErrorPage from './components/ErrorPage/ErrorPage'


function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <CartProvider>
          <MainLayout >
          <main>
            <UseScrollToTop />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/categories/:categoryName/:id' element={<CategoryListing />} />
              <Route path='/details/:id/:bookTitle' element={<BookDetails />} />
              <Route path='/basket' element={<Basket />} />
              <Route path='/signUp' element={<SignUp />} />
              <Route path='/signIn' element={<SignIn />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/userAccount' element={<UserAccount />} />
              <Route path='/searchResults' element={<SearchResults />} />
              <Route path='*' element={<ErrorPage />} />
            </Routes>
          </main>
          </MainLayout>
          <Footer />
        </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
const MainLayout = ({ children }) => {
  const location = useLocation()
  return (
    <>
      {location.pathname !== "/payment" && <Header />}
      {children}
    </>
  )
}
export default App
