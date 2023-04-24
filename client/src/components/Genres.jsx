import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios'
import './Genres.css'
import './Card.css'
import ShowBooks from './ShowBooks';


const Genres = ({AddtoCart}) => {
  const [books, setBooks] = useState([]);
  let { id } = useParams();
  
  
  useEffect(() => {
    const source = axios.CancelToken.source(); // Crée une instance de AbortController
    const getBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/genres/${id}`, {
          cancelToken: source.token // Ajoute le token de cancelation à la requête
        });
        setBooks(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        } else {
          console.error(error);
        }
      }
    };
    getBooks();
    return () => {
      source.cancel('Request canceled by cleanup'); // Annule la requête lorsque le composant est démonté
    };
  }, [id]);
 

  // const path = window.location.pathname
  // const title =  path.split('/')[2]
  let { state } = useLocation();
  const title = state.titleForGenres
  // console.log(title)
  return (
    <section>
      <Link to={'/'} className="container d-block mt-3 text-decoration-none text-dark fs-5 fw-semibold fst-italic">Retour</Link>  
      <h2 className='text-center pt-5'>{title}</h2>
      <ShowBooks books={books} AddtoCart={AddtoCart}/>
    </section>
  );
}

export default Genres;
