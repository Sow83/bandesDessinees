import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import ShowBooks from '../../components/showBooks/ShowBooks';


const CategoryListing = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [books, setBooks] = useState([]);
  let { id } = useParams();


  useEffect(() => {
    const source = axios.CancelToken.source(); // Crée une instance de AbortController
    const getBooks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories/${id}`, {
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
  }, [apiUrl, id]);


  const path = window.location.pathname
  const title = path.split('/')[2]

  // console.log(title)
  return (
    <section>
      <Link to={'/'} className="container d-block mt-3 text-decoration-none text-dark fs-5 fw-semibold fst-italic">Retour</Link>
      <h2 className='text-center pt-5'>{title}</h2>
      <ShowBooks books={books} />
    </section>
  );
}

export default CategoryListing;
