
import Header from "./Header";
import SignIn from "../../pages/signIn/SignIn";
import SignUp from "../../pages/signUp/SignUp";
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';


describe(('Suite de tests du composant header'), () => {
  it(('Vérifiie le rendu du header pour un utilisateur non connecté avec le panier vide'), () => {
    let numberOfCartItems = 0 //On suppose que le panier est vide
    render(
      <BrowserRouter>
        <Header numberOfCartItems={numberOfCartItems} />
      </BrowserRouter>
    )
      const logo = screen.getByText('BandesDessinées')
      expect(logo).toBeInTheDocument()

      const input = screen.getByPlaceholderText('Rechercher un livre')
      expect(input).toBeInTheDocument()

      const text = screen.getByText('Bonjour, identifiez-vous')
      expect(text).toBeInTheDocument()

      const imgProfil = screen.getByAltText('profil')
      expect(imgProfil).toBeInTheDocument()

      const imgPanier = screen.getByAltText('panier')
      expect(imgPanier).toBeInTheDocument()

      const badge = screen.queryByTestId('cart-badge')
      expect(badge).toBeNull()
  })

  it(('Vérifie le rendudu du header si le panier n\'est pas vide'), () => {
    let numberOfCartItems = 2 // On suppose que le nombre d'article dans le panier est égal à 2
    render(
      <BrowserRouter>
        <Header numberOfCartItems={numberOfCartItems} />
      </BrowserRouter>
    )
    const badge = screen.getByTestId('cart-badge')
    expect(badge).toBeInTheDocument()
    expect(badge.textContent).toBe("2")
  })

  // Utilisateur déconnecté 
  it('Affichage du menu déroulant après un clic sur le profil', async () => {
    const isAuthenticated = false; // Utilisateur déconnecté
  
    render(
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} />
        <SignIn />
        <SignUp />
      </BrowserRouter>
    );
       /* Lien "Se connecter"*/

       // Vérifier que le menu déroulant n'est pas affiché initialement
       expect(screen.queryByTestId('menu-dropdown-2')).not.toBeInTheDocument();

       // Cliquez sur l'élément de profil pour afficher le menu déroulant
       const profilElement = screen.getByTestId('profile-2');
       
       // eslint-disable-next-line testing-library/no-unnecessary-act
       await act(async () => {
         userEvent.click(profilElement);
       });
   
       // Vérifier que le menu déroulant est affiché après le clic
       await waitFor(() => {
         expect(screen.getByTestId('menu-dropdown-2')).toBeInTheDocument();
       });
   
       // Vérifier la présence des éléments attendus dans le menu déroulant
       expect(screen.getByTestId('deja-client')).toBeInTheDocument();
       expect(screen.getByTestId('se-connecter')).toBeInTheDocument();
       expect(screen.getByTestId('nouveau-client')).toBeInTheDocument();
       expect(screen.getByTestId('creer-un-compte')).toBeInTheDocument();
   
       // Clic sur le lien "Se connecter" du menu déroulant et attendre la mise à jour 
       const loginLink = screen.getByTestId('se-connecter');
       // eslint-disable-next-line testing-library/no-unnecessary-act
       await act(async () => {
         userEvent.click(loginLink);
       });
   
       //Vérifier la disparition du menu
         expect(screen.queryByTestId('menu-dropdown-2')).toBeNull();

       // Vérifier que le menu déroulant n'est plus présent dans le DOM
       expect(screen.queryByTestId('menu-dropdown-2')).toBeNull();
   
       // Vérifiez si l'URL a été mise à jour
       expect(window.location.pathname).toBe('/signIn');
   
       // Vérifier l'affichage de la page de connexion
       expect(screen.getByTestId('form-signIn')).toBeInTheDocument();

       /* Lien "Créer un compte"*/

     // Vérifier que le menu déroulant n'est pas affiché initialement
     expect(screen.queryByTestId('menu-dropdown-2')).not.toBeInTheDocument();
  
     // Cliquez sur l'élément de profil pour afficher le menu déroulant et 
     // attendre la mise à jour de l'affichage
     // eslint-disable-next-line testing-library/no-unnecessary-act
     await act(async() => {
      userEvent.click(profilElement);
     })
   
    // Vérifier que le menu déroulant est affiché après le clic
    expect(screen.getByTestId('menu-dropdown-2')).toBeInTheDocument();
   
    // Vérifier la présence des éléments attendus dans le menu déroulant
    expect(screen.getByTestId('deja-client')).toBeInTheDocument();
    expect(screen.getByTestId('se-connecter')).toBeInTheDocument();
    expect(screen.getByTestId('nouveau-client')).toBeInTheDocument();
    expect(screen.getByTestId('creer-un-compte')).toBeInTheDocument();
     
    // Clic sur le lien "Créer un compte" du menu déroulant et attendre la mise à jour
    const signUpLink = screen.getByTestId('creer-un-compte');
    
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () =>{
      userEvent.click(signUpLink);
    })

    // Vérifier que le menu déroulant n'est plus présent dans le DOM
    expect(screen.queryByTestId('menu-dropdown-2')).toBeNull();

    // Vérifier l'URL après la disparition du menu
    expect(window.location.pathname).toBe('/signUp');

    // Vérifier l'affichage de la page de création de compte
    expect(screen.getByTestId('form-signUp')).toBeInTheDocument();
    
  });
  
  it('Disparition du menu déroulant lors d\'un clic en dehors du menu', async () => {
    const isAuthenticated = false; // Utilisateur déconnecté
  
    render(
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} />
        <SignIn />
        <SignUp />
      </BrowserRouter>
    );
  
    // Cliquez sur l'élément de profil pour afficher le menu déroulant et attendre la mise à jour de l'affichage
    const profilElement = screen.getByTestId('profile-2');
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act (async() =>{
      userEvent.click(profilElement);
    })
  
    // Vérifier que le menu déroulant est affiché après le clic 
    expect(screen.getByTestId('menu-dropdown-2')).toBeInTheDocument();
  
    // Cliquez n'importe où en dehors du menu déroulant pour le faire disparaître
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act (async() =>{
      userEvent.click(document.body);
    })
  
    // Vérifier que le menu déroulant n'est plus présent dans le DOM
    expect(screen.queryByTestId('menu-dropdown-2')).toBeNull();
  });
  
  it('Réapparition du menu déroulant après un nouveau clic sur l\'élément de profil(toggle)', async () => {
    const isAuthenticated = false; // Utilisateur déconnecté
  
    render(
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} />
        <SignIn />
        <SignUp />
      </BrowserRouter>
    );
  
    // Cliquez sur l'élément de profil pour afficher le menu déroulant
    const profilElement = screen.getByTestId('profile-2');
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act (async() =>{
      userEvent.click(profilElement);     
    })
  
    // Vérifier que le menu déroulant est affiché après le clic et attendre la mise à jour de l'affichage
    expect(screen.getByTestId('menu-dropdown-2')).toBeInTheDocument();

    // Cliquez à nouveau sur l'élément de profil pour faire disparaître le menu déroulant et attendre la mise à jour
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act (async() =>{
      userEvent.click(profilElement);    
    })

    // Vérifier que le menu déroulant n'est plus affiché
    expect(screen.queryByTestId('menu-dropdown-2')).toBeNull();
  });
  
})