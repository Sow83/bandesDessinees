import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { AuthContext } from '../utils/AuthContext'
import { useContext } from 'react'
import './Header.css'



const Header = ({ numberOfCartItems }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const menuRef = useRef()

  useEffect(() => {
    // Ajoute le gestionnaire d'événement pour la fermeture du menu
    document.addEventListener('click', handleDocumentClick);

    return () => {
      // Supprime le gestionnaire d'événement lors du démontage du composant
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleDocumentClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };


  /* C'est pour éviter que le menu ne disparaisse lorsqu'on clique à l'intérieur, 
    à l'exception des liens qu'il contient qui appellent la fonction "toggleMenu"
   */
  const handleMenuClick = (event) => {
    event.stopPropagation();
  };

  // Montre et cache le menu 
  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  // Déconnecte l'utilisateur et cache le menu
  const handleLogout = () => {
    logout()
    setShowMenu(false)
  }

  // Formate le prénom de l'utilisateur connecté: 
  // Première lettre en majuscule et le reste en miniscule avec un maximun de 12 lettres
  const firstNameLoggedUser = () => {
    const userFirstName = user[0].firstName.slice(0, 1).toUpperCase() + user[0].firstName.slice(1, 12).toLowerCase()
    return userFirstName
  }

  return (
    <header className='header'>
      <nav className="navbar navbar-expand-lg py-5" style={{ padding: "0 0.75rem" }}>
        <div className="header-logo-navbar">
          <Link to={'/'} className="navbar-brand fw-bold">BandesDessinées</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav container-lg align-items-lg-center ms-xl-5">
              <li className="nav-item">
                <a className="nav-link text-dark" aria-current="page" href="##">
                  Qui sommes-nous ?
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="##">Nouveautés</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="##">A paraître</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="##">Auteurs</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className='header-auth'>

        {isAuthenticated ?
          <div>
            <div onClick={toggleMenu} ref={menuRef} className='header-cursor-profile'>
              {user && <span className='header-profile-text' >Bonjour {firstNameLoggedUser()}</span>}
              <img className='header-profile-img me-sm-5' src="http://localhost:8000/images/profile-connected.png" alt="profil" />
            </div>
            {showMenu &&
              <div onClick={handleMenuClick}>
                <div className='header-menu-profile p-4 text-center rounded-2'>
                  <Link to='/userAccount' state={{ showOrder: false }} onClick={toggleMenu} className="text-decoration-none header-menu fw-semibold mb-4 d-block">Mes informations</Link>
                  <hr className='' />
                  <Link to='/userAccount' state={{ showOrder: true }} onClick={toggleMenu} className="text-decoration-none header-menu fw-semibold mb-4 d-block">Mes commandes</Link>
                  <hr className='mb-4' />
                  <Link className="fw-semibold btn" onClick={handleLogout}>Se déconnecter</Link>
                </div>
              </div>
            }
          </div>
          :
          <div>
            <div onClick={toggleMenu} ref={menuRef} className='header-cursor-profile'>
              <span className='header-profile-text'>Bonjour, identifiez-vous</span>
              <img className='header-profile-img me-sm-5' src="http://localhost:8000/images/profile.png" alt="profil" />
            </div>
            {showMenu &&
              <div onClick={handleMenuClick}>
                <div className='header-menu-profile p-3 text-center rounded-2'>
                  <p className='fw-semibold'>Déjà client ?</p>
                  <Link to={'/signIn'} className="btn fw-semibold" onClick={toggleMenu}>Se connecter</Link>
                  <hr />
                  <p className='fw-semibold'>Nouveau client ?</p>
                  <Link to={'/signUp'} className="btn fw-semibold" onClick={toggleMenu}>Créer un compte</Link>
                </div>
              </div>
            }
          </div>
        }
        <div className="header-bag">
          <Link to="/basket" className="nav-link"><img src="http://localhost:8000/images/shopping-bag.png" alt="panier" />{numberOfCartItems ? (<button className="badge header-badge btn btn-danger border-0">{numberOfCartItems}</button>) : " "}</Link>
        </div>
      </div>
    </header>
  );
};

export default Header


