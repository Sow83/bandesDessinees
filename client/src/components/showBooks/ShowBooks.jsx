
import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { CartContext } from '../../utils/CartContext';

const ShowBooks = ({ books, home }) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const { value } = useContext(CartContext);
  const { AddItemToCart } = value

  return (
    <div className={`${home === true ? "row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4" : "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 m-auto py-5"}`}>
      {books.map((book) => {
        const cleanedTitle = book.title
          .toLowerCase() // Convertit la chaîne en minuscules
          .normalize("NFD") // Normalise les caractères accentués en caractères non accentués
          .replace(/[\u0300-\u036f]/g, "") // Supprime les accents de la chaîne
          .split(" ") // Divise la chaîne en un tableau de mots
          .join("-") // Joint les mots avec des tirets
          .replace(/'+/g, "-") // Remplace les apostrophes par des tirets
          .replace(/[^a-zA-Z0-9-]/g, "") // Supprime tous les caractères non alphabétiques, non numériques et non des tirets
          .replace(/-+/g, "-"); // Remplace les séquences de tirets par un seul tiret
        return (
          <div className={`"col" ${books.length < 5 && "m-auto"}`} key={book.id}>
            <div className={`card h-100 border-0 card-container ${home !== true && "pt-4"}`}>
              <div className='position-relative m-auto card-content '>
                <img className='card-container-img' src={`${apiUrl}/images/dotted.png`} alt="" />
                <Link to={`/details/${book.id}/${cleanedTitle}`}><img src={`${apiUrl}/images/cover/${book.reference}.jpg`} className="card-img-top card-img-bottom mb-4 card-img " alt="..." style={{ width: "188px", height: "277px" }} /></Link>
              </div>
              <div className="card-body text-center">
                <button type='button' className='btn btn-outline rounded-pill mb-3 fw-semibold' onClick={() => AddItemToCart(book, 1)}>Ajouter</button>
                <p className='fw-bold mb-3 fs-5'>{book.price} &euro;</p>
                <h5 className="card-title mb-2 text-capitalize">{book.title}</h5>
                <img className='card-star me-1' src={`${apiUrl}/images/star-fill.svg`} alt="" />
                <img className='card-star me-1' src={`${apiUrl}/images/star-fill.svg`} alt="" />
                <img className='card-star me-1' src={`${apiUrl}/images/star-fill.svg`} alt="" />
                <img className='card-star me-1' src={`${apiUrl}/images/star-fill.svg`} alt="" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
export default ShowBooks;
