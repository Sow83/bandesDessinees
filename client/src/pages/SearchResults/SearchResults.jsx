import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ShowBooks from '../../components/showBooks/ShowBooks';
import axios from 'axios';

const SearchResults = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [books, setBooks] = useState([]);
  const location = useLocation();
  const searchInputValue = location.state.inputValue;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/books`);
        const booksData = response.data;
        const SearchBookResult = booksData.filter(book =>
          book.title.toLowerCase().includes(searchInputValue.toLowerCase())
        );
        setBooks(SearchBookResult);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [apiUrl, searchInputValue]);

  return (
    <div>
      {books.length > 0 ? (
        <>
          <p className='text-center mt-4 fw-bold'>{searchInputValue}</p>
          <ShowBooks books={books} />
        </>
      ) : (
        <div className='d-flex flex-column justify-content-center align-items-center text-center' style={{ minHeight: '50vh' }}>
          <h2>Nous n'avons pas de résultat pour votre recherche...</h2>
          <p>Vérifiez l’orthographe des mots saisis</p>
          <Link to={'/'} className='text-danger'>Retour à la page d'accueil</Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
