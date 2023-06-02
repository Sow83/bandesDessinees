import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Permet de simuler le routage en mémoire, le composant "Categories" utilise "Link" de react-router-dom mais n'est pas envelopper par "BrowserRouter"
import Categories from './Categories';

describe('Categories component', () => {
  const categories = [
    { id: 1, categoryName: 'Humour' },
    { id: 2, categoryName: 'Jeunesse' },
    { id: 3, categoryName: 'Science-Fiction' },
    { id: 4, categoryName: 'Thriller' },
  ];  
  
  it('Rendu correct des éléments', () => {
    render(
      <MemoryRouter> 
        <Categories categories={categories} />
      </MemoryRouter>
    );

    categories.forEach((category) => {
      const categoryElement = screen.getByText(category.categoryName);
      expect(categoryElement).toBeInTheDocument();
    });
  });

  it('Rendu correct des images', () => {
    render(
      <MemoryRouter> 
        <Categories categories={categories} />
      </MemoryRouter>
    );

    const imageElements = screen.getAllByRole('img');
    expect(imageElements).toHaveLength(categories.length);
  });

  it('Rendu correct des sources des images', () => {
    render(
      <MemoryRouter> 
        <Categories categories={categories} />
      </MemoryRouter>
    );

    const imageElements = screen.getAllByRole('img');
    imageElements.forEach((image, index) => {
      expect(image.getAttribute('src')).toBe(`http://localhost:8000/images/${categories[index].categoryName.split(' ').join('')}.png`)
    });

  })

  it('Rendu correct des liens', () => {
    render(
      <MemoryRouter>
        <Categories categories={categories} />
      </MemoryRouter>
    );

    const linkElements = screen.getAllByRole('link');
    linkElements.forEach((link, index) => {
      expect(link.getAttribute('href')).toBe(`/categories/${categories[index].categoryName}/${categories[index].id}`);
    });   
  });
});


























