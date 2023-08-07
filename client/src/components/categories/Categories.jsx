import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css'

const Categories = ({ categories }) => {
const apiUrl = process.env.REACT_APP_API_URL

  return (
    <div className="m-auto bg-white categories row row-cols-1 row-cols-sm-2 row-cols-lg-4 mb-5">
      {categories.map((category, index) => {
        const isLast = index === categories.length - 1;
        const CatClass = isLast ? "categories-item categories-border last-cat-item" : "categories-item categories-border";
        return (
          <Link
            to={`/categories/${category.categoryName}/${category.id}`}
            key={category.id}
            className="text-decoration-none link-dark"
          >
            <div className="col categories-item-container py-5">
              <div className={CatClass}>
                <img
                  className="categories-img d-block m-auto px-5 pt-5 pb-4 w-100 w-100"
                  src={`${apiUrl}/images/${category.categoryName.split(' ').join('')}.png`}
                  alt={category.categoryName}
                />
                <h2 className="text-center fw-bold pb-1">
                  {category.categoryName}
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
