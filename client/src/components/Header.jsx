import { Link } from 'react-router-dom'
import { useState } from 'react'
import  { AuthContext } from '../AuthContext'
import { useContext } from 'react'
import './Header.css'



const Header = ({numberOfCartItems}) => {
  // console.log(numberOfCartItems)
  // const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const {isAuthenticated, user, logout} = useContext(AuthContext)

  // useEffect(() => {
  //   login()
  //   setIsLoading(false)  
  // }, []);

  // Déconnecte l'utilisateur
  const handleLogout = () => {
    logout()  
    setShowMenu(false)
  }

  // Affiche le menu
  const handleMouseEnter = () => {
    setShowMenu(true)
  }

  // Cache le menu
  const handleMouseLeave = () => {
    setShowMenu(false)
  }
  
// Formate le prénom de l'utilisateur connecté: 
// Première lettre en majuscule et le reste en miniscule avec un maximun de 12 lettres
  const firstNameLoggedUser = () =>{
    const userFirstName = user[0].firstName.slice(0, 1).toUpperCase() + user[0].firstName.slice(1, 12).toLowerCase()
    return userFirstName
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg py-5" style={{padding: "0 0.75rem"}}>
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
              <li className="nav-item">
                <a className="nav-link text-dark" href="##">Héros</a>
              </li>             
            </ul>      
          </div>
        </div>
      </nav>
      <div className='header-auth'>
        
        {/* {!isLoading && ( */}
              <>
                {isAuthenticated ? 
                  <div>
                  {user && <p className='d-inline-block'>Bonjour {firstNameLoggedUser()}</p>}
                    <img className='header-profile me-5' src="http://localhost:8000/images/profile-connected.png" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} alt="profil" />              
                    {showMenu &&
                      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div className='header-menu-profile p-4 text-center'>
                            <Link to={'/myAccounts'} className="text-decoration-none header-menu fw-semibold mb-4 d-block">Mon compte</Link>
                            <hr className='' />
                            <Link to={'/myAccounts'} className="text-decoration-none header-menu fw-semibold mb-4 d-block">Mes commandes</Link>
                            <hr className='mb-4' />
                            <Link className="fw-semibold btn" onClick={handleLogout}>Se déconnecter</Link>    
                        </div>      
                      </div>
                    }
                  </div>
                  :
                  <div>
                    <img className='header-profile me-5' src="http://localhost:8000/images/profile.png" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} alt="profil" />              
                    {showMenu &&
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                      <div className='header-menu-profile p-3 text-center'>    
                        <p className='fw-semibold'>Déjà client ?</p>    
                        <Link to={'/signIn'} className="btn fw-semibold">Se connecter</Link>                
                        <hr />
                        <p className='fw-semibold'>Nouveau client ?</p>
                        <Link to={'/signUp'} className="btn fw-semibold">Créer un compte</Link>                                            
                      </div>      
                    </div>
                    }
                  </div>
                }
              </>
            {/* ) */}
          {/* } */}
            <div className="mt-1">
              <Link to="/basket" className="nav-link"><img src="http://localhost:8000/images/shopping-bag.png" alt="panier" />{numberOfCartItems ? (<button className="badge header-badge btn btn-danger border-0">{numberOfCartItems}</button>) : " " }</Link>   
            </div>
        </div>
    </header>
  );
};

export default Header


