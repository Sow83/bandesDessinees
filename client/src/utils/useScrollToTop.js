import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Fonctionnalité de défilement vers le haut de la page chaque fois que le chemin de l'URL (routePath) change
export const UseScrollToTop = () => {

  const routePath = useLocation();

  const onTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    onTop();
  }, [routePath]);

  return null
}


