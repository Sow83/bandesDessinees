import React from 'react';
import { Link } from 'react-router-dom';

const Categories = ({ genres }) => {
  return (
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
  );
};

export default Categories;
