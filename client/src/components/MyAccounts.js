import React from 'react';
import { useLocation } from 'react-router-dom'


const MyAccounts = () => {
  const location = useLocation()
  if (location.state) {
      const alert = location.state.alert
      console.log(alert)
  }
  
  return (
    <div className='container py-5 '>
      <div className='row g-5'>
        <div className='col-12 col-md-4'>
          <p className='fw-bold'>Bonjour Mouhamadou</p>
          <h1 className='h2 mt-4 text-secondary'>Mon compte</h1>
          {/* <hr /> */}
          <p className='fw-semibold'>Mes informations</p>
        </div>
        <div className='col-12 col-md-8'>
            <h2 className='mb-5 mt-5 text-secondary'>Mes commandes</h2>
            <p className='fs-4 fw-semibold' >Vous n'avez pas de commandes</p>
            <p className='fs-5'>La balle est dans votre camp !</p>
            <p>Faites un petit tour dans notre boutique et laissez-vous tenter par nos articles...</p>
            <p>Si vous avez besoin d'un renseignement à propos d'une commande plus ancienne, un conseiller client est à votre disposition au</p>
            <p className='fs-2 mb-0'>0 969 323 515</p>
            <p>7 jours sur 7, de 8h à 21h,</p>
            <p>Service gratuit + prix appel</p>
        </div>
      </div>
     
    </div>
  );
}

export default MyAccounts;
