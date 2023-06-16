import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section className='container m-auto text-center py-4 ' >
       <h1>Oops! page non trouvée</h1>
       <p>La page que vous cherchez n'existe pas </p>
       <Link to ={'/'} className='btn'>Retour à la page d'accueil</Link>
    </section>
  );
}

export default ErrorPage;
