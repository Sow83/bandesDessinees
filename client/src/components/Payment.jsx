
import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../utils/AuthContext'
import "./form.css"


const PaymentHeader = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg py-5 justify-content-center" style={{ padding: "0 0.75rem" }}>
        <div className="header-logo-navbar">
          <Link to={'/'} className="navbar-brand fw-bold">BandesDessinées</Link>
        </div>
      </nav>
    </header>
  );
}

const Payment = ({ cartItems, setCartItems, setNumberOfCartItems, itemsPrice, shippingPrice, totalPrice }) => {
  // console.log(cartItems)
  // console.log(itemsPrice)
  // console.log(shippingPrice)
  // console.log(totalPrice)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  // console.log(errors)

  // Rediriger l'utilisateur vers la page d'accueil (navigate("/")) lorsqu'il essaie de 
  // revenir à la page de paiement avec le bouton "Précédent" ou "Suivant" du navigateur, cela s'applique toute l'application 
  // window.onpopstate = () => {
  //   navigate("/");
  // }

  const { isAuthenticated, user } = useContext(AuthContext)
  let userId
  let userName
  if (user) {
    userId = user[0].id
    userName = user[0].lastName
  }

  /* Le numéro de commande sera composé du nom de l'utilisatur et de la date
    de commande(date et heure) sous la forme(Sow-03052023-173901). Les mois, 
    jours, heures, minutes et secondes sont convertis en chaînes et remplis 
    avec des zéros à gauche si nécessaire pour s'assurer qu'ils ont deux chiffres(padStart).
   */
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const formattedDate = `${userName}-${day}${month}${year}-${hours}${minutes}${seconds}`;
  // console.log(formattedDate);

  const onSubmit = data => {
    fetchData()
    localStorage.removeItem('cartItems')
    localStorage.removeItem('numberOfCartItems')
    setNumberOfCartItems("")
    setCartItems([])
    // console.log(data)
  };

  const token = localStorage.getItem("token")
  const fetchData = async () => {


    const options = {
      url: "http://localhost:8000/orders",
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`
      },
      data: {
        "totalWithoutShipping": itemsPrice,
        "shippingCost": shippingPrice,
        "orderTotal": totalPrice,
        "orderNumber": formattedDate,
        "id_users": userId,
        //les lignes de commande du panier (cad chaque article) sont dans un tableau (articles)
        "articles": cartItems
      }
    }
    try {
      const response = await axios(options)
      // setShowAlert(response.data.message)
      reset()
      navigate('/userAccount', { state: { alert: response.data.message } })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié, redirige-le vers la page de connexion
    if (isAuthenticated === false) {
      navigate("/signIn")
    }
  }, [isAuthenticated, navigate]);

  const currentYear = new Date().getFullYear()
  /**
 * Fonction pour valider la date d'expiration d'une carte bancaire.
 * La fonction prend une chaîne de caractères au format "MM/YY" en entrée,
 * et renvoie true si la date est valide (non expirée) et false sinon.
 * @param {string} value - La date d'expiration de la carte bancaire au format "MM/YY"
 * @returns {boolean} - true si la date est valide, false sinon
 */
  const validateExpiryDate = (value) => {
    const [month, year] = value.split("/")
    if (!month || !year) return false
    const expiryMonth = parseInt(month)
    const expiryYear = parseInt("20" + year)
    if (expiryMonth < 1 || expiryMonth > 12) return false
    if (expiryYear < currentYear) return false
    if (expiryYear === currentYear && expiryMonth < new Date().getMonth() + 1) return false
    return true
  }

  // let totalCommande
  // if (location.state) {
  //   totalCommande = location.state.totalCommande   
  // }
  // const test = "taftaf"
  return (
    <>
      <PaymentHeader />
      <div className='MyForm-container py-5'>
        <div className='container fw-semibold'>
          <div className='MyForm-title mb-0 py-3 text-center row'>
            <h1>Paiement</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='MyForm py-5 px-md-5 row'>
            <p className='fs-5'>Total commande: <span className='text-danger'>{totalPrice && totalPrice} &#8364;</span></p>
            <div className='col-sm-6'>
              <label className='d-block' htmlFor="nom">Nom sur la carte*</label>
              <input className='MyForm-input py-3 mb-4' id='nom' type="text" maxLength={30} placeholder='Isabelle' {...register("Nom", { required: true, maxLength: 30 })} />
              {errors.Nom?.type === 'required' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
              {errors.Nom?.type === 'maxLength' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir maximum 30 caractères</p>}
            </div>

            <div className='col-sm-6'>
              <label className='d-block' htmlFor="numeroDeCarte">Numéro de carte*</label>
              <input className='MyForm-input py-3 mb-4' id='numeroDeCarte' type="text" maxLength="16" placeholder='4585978532648975' {...register("numeroDeCarte", {
                required: true, maxLength: 16, pattern: /^\d{16}$/ //ne prend que 16 chiffres sans espaces
              })} />
              {errors.numeroDeCarte?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
              {errors.numeroDeCarte?.type === 'maxLength' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le numéro de la carte ne doit pas dépasser 16 chiffres</p>}
              {errors.numeroDeCarte?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le numéro de la carte est invalide</p>}
            </div>

            <div className='col-sm-6'>
              <label className='d-block' htmlFor="expiration">Date d'expiration*</label>
              <input
                className='MyForm-input py-3 mb-4'
                type="text"
                id="cardExpiry"
                name="cardExpiry"
                placeholder="MM/YY"
                {...register("dateExpirationCarte", {
                  required: true,
                  pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, //vérifie que la chaîne de caractères entrée correspond à un format valide sous la forme "MM/YY où "MM" est le mois (01-12) et "YY" les deux derniers chiffres de l'année.
                  validate: validateExpiryDate
                })}
              />
              {errors.dateExpirationCarte?.type === 'required' && <p role="alert" className='text-danger mb-5' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
              {errors.dateExpirationCarte?.type === "pattern" && <p role="alert" className='text-danger mb-5' style={{ marginTop: "-22px" }}>Le format doit être MM/YY</p>}
              {errors.dateExpirationCarte?.type === "validate" && <p role="alert" className='text-danger mb-5' style={{ marginTop: "-22px" }}>La date doit être future</p>}
            </div>

            <div className='col-sm-6'>
              <label className='d-block' htmlFor="cvv">Cvv*</label>
              <input className='MyForm-input py-3 mb-4' id='cvv' type="password" maxLength={3} placeholder='452' {...register("cvv", { required: true, maxLength: 3, pattern: /^\d{3}$/ })} />
              {errors.cvv?.type === 'required' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
              {errors.cvv?.type === 'maxLength' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir maximum 3 caractères</p>}
              {errors.cvv?.type === 'pattern' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir que 3 chiffres</p>}
            </div>
            <div>
              <input className='d-block btn btn-outline fw-semibold mb-4' type="submit" value="Envoyer" />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Payment


