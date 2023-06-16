import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Categories from '../../components/categories/Categories'
import ShowBooks from '../../components/showBooks/ShowBooks';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // Recupère les différentes catégories de bandes dessinées 
  const getCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Recupère tous les livres de bandes dessinées 
  const getBooks = useCallback(async () => {
    try {
      // "order" est un paramètre de requete qui ne fait pas partie de l'URL lui-même.
      // Il est utilisé pour construire dynamiquement l'URL en fonction de la valeur de sortBy.
      const url = sortBy ? `http://localhost:8000/books/sorted?order=${sortBy}` : 'http://localhost:8000/books';
      const response = await axios.get(url);
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [sortBy]);


  useEffect(() => {
    getCategories()
    getBooks()
  }, [getBooks]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="container-fluid home">
      <div className="container">
        <h1 className='text-center mb-3'>Catégories Bandes Dessinées</h1>
        <Categories categories={categories} />
        <form
          className="home-form col-12 col-sm-6 col-lg-3 ms-auto mb-5 "
          action=""
        >
          <select
            className="form-select form-select-lg mb-3"
            aria-label=".form-select-lg example"
            onChange={handleSortChange}
            value={sortBy}
          >
            <option value="">Trier par</option>
            <option value="ascending">Prix croissant</option>
            <option value="descending">Prix décroissant</option>
          </select>
        </form>
        <ShowBooks books={books} home={true} />
      </div>
    </div>
  );
};

export default Home;
