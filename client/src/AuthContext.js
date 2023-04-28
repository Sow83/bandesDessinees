import { createContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export const AuthContext = createContext("")

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLogouted, setIsLogouted] = useState(false);
  const [user, setUser] = useState(null)
  const navigate = useNavigate();
  const navigateRef = useRef(navigate)


  // Vérifie si l'utilisateur est connecté ou pas et met à jour isAuthenticated et userId en cas de connexion
  const login = async () => {
    const token = localStorage.getItem('token') !== null ? localStorage.getItem('token') : ''

    try {
      const response = await axios.get("http://localhost:8000/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`
        }       
      })
      // Si la réponse du serveur est "true" l'utilisateur est connecté
      if (response.data.authenticated) {
        setIsAuthenticated(true)
        setUser(response.data.user)
      } 
    } catch (error) {
      console.log(error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false) 
    setUser(null)
    setIsLogouted(true)
  }

  // Vérifie s'il ya connexion lorsqu'une page se recharge
  useEffect(() => {
    const verifyAuth = async () => {
      await login();
      setIsLoading(false);
    }
    verifyAuth();
  }, []);

  // Redirrige l'utilisateur à la page d'accueil après l'appel de la fonction "logout" cad après la déconnexion
  useEffect(() => {
    if (isLogouted) {
      navigateRef.current('/')
      setIsLogouted(false)
    }
  }, [isLogouted])

  // Attends que l'authentification soit vérifiée avant de renvoyer les enfants
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return ( 
    /*L'enfant direct de ce Provider est {children}, qui représente tous les composants
     qui sont imbriqués directement dans le Provider(le fournisseur de contexte). 
     Ces composants ont maintenant 
     accès aux valeurs de contexte fournies par le Provider.  */ 
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
