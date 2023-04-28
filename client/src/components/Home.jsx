import './Home.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Card.css';
import ShowBooks from './ShowBooks';

const Home = ({AddItemToCart}) => {
  const [books, setBooks] = useState ([]);
  const [genres, setGenres] = useState ([]);

  const getGenres = async () => {
    try {
      const response = await axios.get ('http://localhost:8000/genres');
      // console.log(response.data);
      setGenres (response.data);
    } catch (error) {
      console.error (error);
    }
  };

  const getBooks = async () => {
    try {
      const response = await axios.get ('http://localhost:8000/books');
      // console.log(response.data);
      setBooks (response.data);
    } catch (error) {
      console.error (error);
    }
  };
  useEffect (() => {
    getGenres()
    getBooks()
  }, []);

  return (
    <div className="container-fluid home">
      <div className="container">
        <h1 className='text-center'>Catégories Bandes Dessinées</h1>
        <div className="m-auto bg-white home-cat row row-cols-1 row-cols-sm-2 row-cols-lg-4 mb-5">
          {genres.map ((genre, index) => {
            const isLast = index === genres.length - 1;
            const homeCatClass = isLast ? "home-item home-cat-border last-cat-item" : "home-item home-cat-border";
            return (
              <Link
                to={`/genres/${genre.genresName}/${genre.id}`}
                // state={{titleForGenres: `${genre.genresName}`}}
                key={genre.id}
                className="text-decoration-none link-dark"
              >
                <div className="col home-item-container py-5">
                  <div className={homeCatClass}>
                    <img
                      className="home-cat-img d-block m-auto px-5 pt-5 pb-4 w-100 w-100"
                      src={`http://localhost:8000/images/${genre.genresName.split(' ').join('')}.png`}
                      alt={genre.genresName}
                    />
                    <h2 className="text-center fw-bold pb-1">
                      {genre.genresName}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <form
          className="home-form col-12 col-sm-6 col-lg-3 ms-auto mb-5 "
          action=""
        >
          <select
            className="form-select form-select-lg mb-3"
            aria-label=".form-select-lg example"
          >
            <option value="DEFAULT">Trier par</option>
            <option value="1">Genres</option>
            <option value="2">Auteurs</option>
            <option value="3">Héros</option>
            <option value="4">Prix croissant</option>
            <option value="5">Prix décroissant</option>
          </select>
        </form>
        <ShowBooks books={books} home={true} AddItemToCart={AddItemToCart} />
      </div>
    </div>
  );
};

export default Home;
