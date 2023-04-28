import { useNavigate } from 'react-router-dom'
import {useContext, useEffect, useRef} from 'react'
import  { AuthContext } from '../AuthContext'
import './Basket.css'



const Basket = ({cartItems, AddItemToCart, decrementCartItem, deleteItemFromCart, itemsPrice, shippingPrice, totalPrice}) => {
    const navigate = useNavigate()
    const { isAuthenticated, login } = useContext(AuthContext)

    // Création d'une référence à la fonction login afin qu'elle ne soit pas incluse dans la dépendance de useEffect
    const loginRef = useRef(login);

    useEffect(() => {
    // On accède à la fonction login en utilisant la référence créée avec useRef
    loginRef.current();
    }, []);  

  // console.log(cartItems)
  // console.log(isAuthenticated)
  
   const handleClick = () =>{
     // Vérification si l'utilisateur est connecté avant qu'il accède à la page"Payment" 
          if (isAuthenticated) {
            navigate("/payment")
          } 
          else{
            navigate("/SignIn");
          }
    // fetchAuthMiddleware()
   }
  //  const fetchAuthMiddleware = async () =>{
  //   const token = localStorage.getItem('token');
   
  //   try {
  //     const response = await axios.get("http://localhost:8000/api/protected", {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }       
  //     })
  //     if (response.data.isAuthenticated) {
  //         navigate("/payment", { state: {totalCommande: totalPrice.toFixed(2)} });
  //     } 
  //   } catch (error) {
  //     navigate("/SignIn");
  //     console.log(error);
  //   }
  // }
  
  return (
    <>
    { cartItems.length === 0 ? <p className='text-center fs-1 m-5 basket-empty-cart'>Votre panier est vide</p>  :  
    (<div className='basket'>
    <div className="container">
      <div className='table-responsive'>
        <table className="table table-responsive mb-0 basket-table">
          <thead className='basket-thead'>
            <tr>
              <th scope="col">Produit</th>
              <th scope="col">Prix</th>
              <th scope="col">Quantité</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
          {
            cartItems.map((item) =>{
              return (
                <tr key={item.id} className='align-middle'>
                  <td>
                    <img className="basket-button-delete me-5" src="http://localhost:8000/images/buttonDelete.svg" alt="bouton supprimer article du panier" onClick={() => deleteItemFromCart(item)} />
                    <img className="basket-img-bd p-3 me-5" src={`http://localhost:8000/images/cover/${item.reference}.jpg`} alt={item.title} />
                    <span className='fw-bold'>{item.title}</span>
                  </td>
                  <td>{item.price}&euro;</td>
                  <td>
                    <div className='d-flex justify-content-between align-items-center' style={{width: "130px"}}>
                      <button type='button' onClick={() => decrementCartItem(item)} className={"border-0"}  style={{width: "50px"}} disabled={item.quantity === 1 && "disabled"}>-</button>
                        <span className='px-1'>{item.quantity}</span>
                      <button type='button' onClick={() => AddItemToCart(item)} className="border-0 " style={{width: "50px"}} disabled={item.quantity === 15 && "disabled"}>+</button>
                    </div>
                  </td>
                  <td>{item.quantity*item.price.toFixed(2) /* le prix sera de deux chiffre après la virgule*/}&euro;</td>
                </tr>
              )
            })        
          }      
          </tbody>      
        </table>  
      </div>
      <div className='basket-order-price pt-5 fw-semibold fs-4'>
          <p className='ps-2'>Total des articles:<span className='float-end pe-5'>{itemsPrice}&#8364;</span></p>
          <p className='ps-2'>Frais de livraison:<span className='float-end pe-5'>{shippingPrice}&#8364;</span></p>
          <p className='ps-2 fs-2'>Total de la commande:<span className='float-end pe-5 basket-total'>{totalPrice.toFixed(2)}&#8364;</span></p>
          {/* <Link to={'/payment'} state={{totalCommande: totalPrice.toFixed(2)}} onClick={handleClick} ><button type='button' className='btn btn-outline fw-bold float-end mt-5 me-5'>Commander</button></Link> */}
          <button onClick={handleClick} type='button' className='btn btn-outline fw-bold float-end mt-5 me-5'>Commander</button>
      </div>
    </div>
    </div>)   
  } 
    </>
    )
  
}

export default Basket
