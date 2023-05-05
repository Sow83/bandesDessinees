import { useState, useEffect, useContext, useCallback} from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import  { AuthContext } from '../AuthContext'
import axios from 'axios'
import './MyAccounts.css'



const MyAccounts = () => {
  const [showAlert, setShowAlert] = useState("")
  const [ordersHistory, setOrdersHistory] = useState({});
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const location = useLocation()
  const navigate = useNavigate()
  const {isAuthenticated} = useContext(AuthContext)

  useEffect(() => {
    if (location.state) {
      const alert = location.state.alert
      setShowAlert(alert)    
    }
  
  }, [location.state]);

  const fetchData = useCallback (async() => {
    const token = localStorage.getItem("token")
    const options = {
      method: "GET",
      url: "http://localhost:8000/orders/history",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    try {
      const response = await axios(options)
      // Avec "Object.values(response.data.orders)" on aura un tableau plutot qu'un objet pour pouvoir itérer facilement les données
      const ordersHistoryData = Object.values(response.data.orders);
      if (ordersHistoryData.length !== 0) {
        // console.log(ordersHistoryData)
        // console.log(typeof(ordersHistoryData))

        setOrdersHistory(ordersHistoryData)
        setShowOrderHistory(true)
      } else {
        setShowOrderHistory(false)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signIn")
    } else {
      fetchData()
    }
  }, [isAuthenticated, navigate, fetchData])


  return (
    <>
      {isAuthenticated &&
        <div className='container py-5 '>
          {showAlert !== "" &&
          <div className='col col-sm-10 col-lg-6 offset-lg-4'>
            <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
              <p>{showAlert}</p>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>
          }
          <div className='row g-5'>
            <div className='col-12 col-lg-3'>
              <p className='fw-bold'>Bonjour Mouhamadou</p>
              <h1 className='h2 mt-4 text-secondary'>Mon compte</h1>
              <Link to='/UserAccountInformation' className='fw-semibold link-dark'>Mes informations</Link>
            </div>
            <div className='col-12 col-lg-9'>
                <h2 className='mb-5 mt-5 text-secondary'>Mes commandes</h2>
                {showOrderHistory ? 
                  (
                    <div className='myAccounts'>
  <div className="container">
    {ordersHistory.map((orderHistory) => (
      <div key={orderHistory.orderNumber}>
      <h3 className='fs-6'>Commande numéro: {orderHistory.orderNumber} du {new Date(orderHistory.orderDate).toLocaleDateString('fr-FR')} <span className='text-success'>En cours de traitement</span></h3>
        <div className='table-responsive'>
          <table className="table table-responsive mb-0 myAccounts-table">
            <thead className='myAccounts-thead'>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Prix</th>
                <th scope="col">Quantité</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.items.map((item, itemIndex) => (
                <tr key={itemIndex} className='align-middle'>
                  <td>
                    <img className="myAccounts-img-bd p-3 me-5" src={`http://localhost:8000/images/cover/${item.reference}.jpg`} alt={item.title} />
                    <span className='fw-semibold'>{item.title}</span>
                  </td>
                  <td>{item.price}&euro;</td>
                  <td>
                    <div className='d-flex justify-content-between align-items-center' style={{width: "130px"}}>
                      <span className='px-1'>{item.quantity}</span>
                    </div>
                  </td>
                  <td>{item.quantity * item.price}&euro;</td>
                </tr>  
              ))}
            </tbody>      
          </table>  
          <div className='myAccounts-order-price  fw-semibold fs-6'>
            <p className='ps-2'>Total des articles : <span className='float-end pe-5'>{orderHistory.totalWithoutShipping}&#8364;</span></p>
            <p className='ps-2'>Frais de livraison : <span className='float-end pe-5'>{orderHistory.shippingCost}&#8364;</span></p>
            <p className='ps-2 fs-5'>Total de la commande : <span className='float-end pe-5 myAccounts-total'>{orderHistory.orderTotal}&#8364;</span></p>
          </div>
          <hr />
        </div>
      </div>
    ))}
  </div>
</div>

                  )   
                  :  
                  (<div>      
                    <p className='fs-4 fw-semibold' >Vous n'avez pas de commandes</p>
                    <p className='fs-5'>La balle est dans votre camp !</p>
                    <p>Faites un petit tour dans notre boutique et laissez-vous tenter par nos articles...</p>
                    <p>Si vous avez besoin d'un renseignement à propos d'une commande plus ancienne, un conseiller client est à votre disposition au</p>
                    <p className='fs-2 mb-0'>0 969 323 515</p>
                    <p>7 jours sur 7, de 8h à 21h,</p>
                    <p>Service gratuit + prix appel</p>                          
                  </div>
                  )
                }
            </div>
          </div>
        
        </div>
      }
    </>
  )
}

export default MyAccounts;

