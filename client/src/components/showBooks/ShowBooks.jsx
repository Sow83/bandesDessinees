
import { Link } from 'react-router-dom';


const ShowBooks = ({books, home, AddItemToCart}) => {

  return (
    <div className= {`${home === true ? "row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4" : "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 m-auto py-5" }`}>
    {books.map((book) => {
      return (
        <div className={`"col" ${books.length < 5 && "m-auto"}`} key={book.id}>
        <div className={`card h-100 border-0 card-container ${home !== true && "pt-4" }`}>
          <div className='position-relative m-auto card-container-img'>
            <Link to={`/details/${book.id}`}><img src={`http://localhost:8000/images/cover/${book.reference}.jpg`} className="card-img-top card-img-bottom mb-4 card-img " alt="..." style={{width: "188px", height: "277px"}} /></Link>
          </div>
          <div className="card-body text-center">
            <button type='button' className='btn btn-outline rounded-pill mb-3 fw-semibold' onClick={() => AddItemToCart(book)}>Ajouter</button>
            <p className='fw-bold mb-3 fs-5'>{book.price} &euro;</p>
            <h5 className="card-title mb-2 text-capitalize">{book.title}</h5>
            <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="" />
            <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="" />
            <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="" />
            <img className='card-star me-1' src="http://localhost:8000/images/star-fill.svg" alt="" />
          </div>
        </div>
      </div>
      )
    })}
    </div>
  );
}
export default ShowBooks;
