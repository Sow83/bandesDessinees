import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import './Orders.css'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const Orders = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [ordersHistory, setOrdersHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token")
    const options = {
      method: "GET",
      url: `${apiUrl}/orders/history`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    try {
      const response = await axios(options)
      const ordersHistoryData = response.data.orders;
      if (ordersHistoryData.length !== 0) {
        setOrdersHistory(ordersHistoryData)
        setShowOrderHistory(true)
      } else {
        setShowOrderHistory(false)
      }
    } catch (error) {
      console.log(error)
    }
  }, [apiUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <section className='orders col-12 col-lg-9'>
      <h1 className='h2 mb-5 mt-5 text-secondary'>Mes commandes</h1>
      {showOrderHistory ?
        (
          <div className='orders-container'>
            <div className="container">
              <Accordion allowZeroExpanded preExpanded={ordersHistory.length > 0 ? [ordersHistory[0].orderNumber] : []}>    {/* "preExpanded" doit etre un tableau de chaine de carastères ou de nombres*/}
                {ordersHistory.map((orderHistory) => (
                  <AccordionItem key={orderHistory.orderNumber} uuid={orderHistory.orderNumber}>    {/* Le premier élément se déplie par defaut parce que la valeur de uuid du premier élément correspond à la valeur de "preExpanded" */}
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <h2 className='h3 fs-6 me-4'>Commande numéro: {orderHistory.orderNumber} du {new Date(orderHistory.orderDate).toLocaleDateString('fr-FR')} <span className='text-success'>En cours de traitement</span></h2>

                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className='table-responsive orders-item'>
                        <table className="table table-responsive mb-0">
                          <thead className='orders-thead'>
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
                                  <img className="orders-img-bd p-3 me-5" src={`${apiUrl}/images/cover/${item.reference}.jpg`} alt={item.title} />
                                  <span className='fw-semibold'>{item.title}</span>
                                </td>
                                <td>{item.price}&euro;</td>
                                <td>
                                  <div className='d-flex justify-content-between align-items-center' style={{ width: "130px" }}>
                                    <span className='px-1'>{item.quantity}</span>
                                  </div>
                                </td>
                                <td>{item.quantity * item.price}&euro;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className='fw-semibold fs-6'>
                          <p className='ps-2'>Total des articles : <span className='float-end orders-price'>{orderHistory.totalWithoutShipping}&#8364;</span></p>
                          <p className='ps-2'>Frais de livraison : <span className='float-end orders-price'>{orderHistory.shippingCost}&#8364;</span></p>
                          <p className='ps-2 fs-5'>Total de la commande : <span className='float-end orders-total orders-price'>{orderHistory.orderTotal}&#8364;</span></p>
                        </div>
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>

                ))}

              </Accordion>
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
    </section>
  );
}

export default Orders;
