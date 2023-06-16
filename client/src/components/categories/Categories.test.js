import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'; // Permet de simuler le routage en mémoire, le composant "Categories" utilise "Link" de react-router-dom mais n'est pas envelopper par "BrowserRouter"
import Categories from './Categories';

describe('Suite de tests du Composant Categories', () => {
  const categories = [
    { id: 1, categoryName: 'Humour' },
    { id: 2, categoryName: 'Jeunesse' },
    { id: 3, categoryName: 'Science-Fiction' },
    { id: 4, categoryName: 'Thriller' },
  ];

  it('Vérifie que tous les éléments de catégorie sont rendus correctement', () => {
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

  it('Vérifie que toutes les images de catégorie sont rendues correctement', () => {
    render(
      <MemoryRouter>
        <Categories categories={categories} />
      </MemoryRouter>
    );

    const imageElements = screen.getAllByRole('img');
    expect(imageElements).toHaveLength(categories.length);
  });

  it('Vérifie que les sources des images de catégorie sont correctes', () => {
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

  it('Vérifie que les liens de catégorie ont les attributs href corrects', () => {
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


  // it('Change l\'URL après avoir cliqué sur un lien de catégorie', async () => {
  //   render(
  //     <MemoryRouter> 
  //       <Categories categories={categories} />
  //     </MemoryRouter>
  //   );

  //   const linkElements = screen.getAllByRole('link');
  //   linkElements.forEach(async (linkElement, index) => {
  //     const expectedPath = `/categories/${categories[index].categoryName}/${categories[index].id}`;
  //     userEvent.click(linkElement);
  //     await waitFor(() => expect(window.location.pathname).toBe(expectedPath));
  //   });
  // });


  // it('Affiche la page de catégorie correspondante après avoir cliqué sur un lien de catégorie', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/categories']}>
  //       <Routes>
  //         <Route path="/categories" element={<Categories categories={categories} />} />
  //         <Route path="/categories/:categoryName/:id" element={<CategoryListing />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   for (const category of categories) {
  //     const linkElements = screen.getAllByText(category.categoryName);

  //    for (const linkElement of linkElements) {
  //      userEvent.click(linkElement);

  //     await waitFor(() => {
  //       const pageTitle = screen.getByRole('heading', { name: category.categoryName });
  //       expect(pageTitle).toBeInTheDocument();
  //     });
  //    }
  //   }
  // });

});


























