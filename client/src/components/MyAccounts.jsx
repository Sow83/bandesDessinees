import { useState, useEffect, useContext} from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import UserAccountInformation from './userAccountInformation'
import Orders from './Orders'




const MyAccounts = () => {
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false)
  const [showOrders, setShowOrders] = useState(true);
  // const [showInfos, setShowInfos] = useState(false);
 
  // const alert = useLocation()
  let locationAlert  = useLocation();
  let locationshowOrder  = useLocation();
// console.log(locationAlert.state.alert)
// console.log(locationshowOrder.state.showOrder)
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  // console.log(showOrders)
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signIn")
    } 
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // locationAlert.state.alert est le message d'alerte. Il vient du composant "Payment"
    if (locationAlert.state && locationAlert.state.alert !== undefined) {
      const alertMessage = locationAlert.state.alert
      setAlert(alertMessage)
      setShowAlert(true)
    }
    // showOrder vient du composant Header lors d'un clic sur "Mes informations" ou "Mes commandes"
    // locationshowOrder.state.showOrder sera "true" ou "false" 
    if (locationshowOrder.state && locationshowOrder.state.showOrder !== undefined) {
      const booleanState = locationshowOrder.state.showOrder
      setShowOrders(booleanState)     
      console.log(booleanState)
    }


  }, [locationAlert.state, locationshowOrder.state]);

  // Affiche le composant "UserAccountInformation"
  const handleDisplayUserInfo = () =>{
    setShowOrders(false)
  }

  // Affiche le composant "Orders"
  const handleDisplayUserOrder = () =>{
    setShowOrders(true)
  }
  
 

  return (
    <>
      {isAuthenticated &&
        <div className='container py-5 '>
          {showAlert  &&
            <div className='col col-sm-10 col-lg-6 offset-lg-3'>
              <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                <p>{alert}</p>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            </div>
          }
          <div className='row g-5'>
            <div className='col-12 col-lg-3'>
              <p className='fw-bold'>Bonjour Mouhamadou</p>
              <h1 className='h2 mt-4 text-secondary'>Mon compte</h1>
              <Link onClick={handleDisplayUserInfo} className='fw-semibold link-dark d-block mb-2'>Mes informations</Link>
              <Link onClick={handleDisplayUserOrder} className='fw-semibold link-dark d-block'>Mes commandes</Link>
            </div> 
            {showOrders ? <Orders /> : <UserAccountInformation /> }                
          </div>

        </div>
      }
    </>
  )
}

export default MyAccounts;

