import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './BookDetails.css'
import moment from 'moment'
import 'moment/locale/fr'; // Importe le localisateur français de Moment.js
import { CartContext } from '../../utils/CartContext'


const BookDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const {value} = useContext(CartContext);
  const {AddItemToCart} = value

  const handleSelectChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };


  useEffect(() => {
    setLoading(true)
    async function getBookDetails() {
      try {
        const response = await axios.get(`http://localhost:8000/bookDetails/${id}`);
        // console.log(response.data);
        setDetails(response.data)
        setLoading(false)

      } catch (error) {
        console.error(error);
      }
    }
    getBookDetails()
    return () => {
      // cleanup
    };
  }, [id]);

  const dateMySQL = moment(details.releaseDate);
  dateMySQL.locale('fr');
  const frenchDate = dateMySQL.format('DD MMMM YYYY'); //exemple de format: 10 mars 2023

  return (
    <>
      {loading ? <p className='container text-center'>Chargement...</p> :
        (<div className='bookDetails'>
          <div className='container'>
            <div className='row row-cols-1 row-cols-md-2 mb-4 '>
              <div className='col mb-5'>
                <div className=''>
                  <img src={`http://localhost:8000/images/cover/${details.reference}.jpg`} className='img-fluid m-auto d-block p-3 p-md-4 p-lg-5 bg-light' alt="" />
                </div>
              </div>
              <div className='col'>
                <p className='mb-2 fs-1 fw-bold bookDetails-price'>{details.price} &euro;</p>
                <p className='mb-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <h2 className='mb-2'>{details.title}</h2>
                <div className='mb-5'>
                  <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="étoile" />
                  <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="étoile" />
                  <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="étoile" />
                  <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="étoile" />
                </div>
                <div className='mb-4'>
                  <span className='me-1'>Quantité</span>
                  <select value={quantity} onChange={handleSelectChange} className='me-4' name="pets" id="pet-select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                  <button type='button' className='btn me-4 fw-semibold' onClick={() => AddItemToCart(details, quantity)}>Ajouter</button>
                  <button type='button' className='btn bookDetails-btn fw-semibold'>Acheter</button>
                </div>
                <p><span className='fw-semibold'>Auteur: </span>{details.authorsName}</p>
                <p><span className='fw-semibold'>Genre: </span>{details.categoryName}</p>
                <p><span className='fw-semibold'>Référence: </span>{details.reference}</p>
                <p><span className='fw-semibold'>Date de sortie: </span>{frenchDate}</p>
              </div>

            </div>
            <div className='row row-cols-1 row-cols-md-2'>
              <div>
                <h3 className='mb-3 booksdetails-underline'>Résumé</h3>
                <p className='booksdetails-text'>{details.summary}</p>
              </div>
              <div>
                <h3 className='mb-3 booksdetails-underline'>Informations additionnelles</h3>
                <p className='booksdetails-text'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate sit nisi quam veniam tempore perspiciatis, adipisci voluptas quod nobis repellendus iusto. Sed iusto impedit suscipit natus ea at ratione exercitationem.</p>
              </div>
            </div>
          </div>
        </div>)
      }
    </>
  );
}

export default BookDetails;
