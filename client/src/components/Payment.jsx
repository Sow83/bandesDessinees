
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import "./form.css"

const Payment = () => {
  const [showAlert, setShowAlert] = useState(false)
  const location = useLocation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const onSubmit = data =>{
    setShowAlert(true)
    reset()
    console.log(data)

  };
  console.log(errors)

  const currentYear = new Date().getFullYear()
  /**
 * Fonction pour valider la date d'expiration d'une carte bancaire.
 * La fonction prend une chaîne de caractères au format "MM/YY" en entrée,
 * et renvoie true si la date est valide (non expirée) et false sinon.
 * @param {string} value - La date d'expiration de la carte bancaire au format "MM/YY"
 * @returns {boolean} - true si la date est valide, false sinon
 */
  const validateExpiryDate = (value) => {
    const [month, year] = value.split("/")
    if (!month || !year) return false
    const expiryMonth = parseInt(month)
    const expiryYear = parseInt("20" + year)
    if (expiryMonth < 1 || expiryMonth > 12) return false
    if (expiryYear < currentYear) return false
    if (expiryYear === currentYear && expiryMonth < new Date().getMonth() + 1) return false
    return true
  }

  let totalCommande
  if (location.state) {
    totalCommande = location.state.totalCommande   
  }
  // console.log(totalCommande)
  return (
    <div className='MyForm-container py-5'>
      <div className='container fw-semibold'>
        <div className='MyForm-title mb-0 py-3 text-center row'>
          <h1>Paiement</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='MyForm py-5 px-md-5 row'>
        <p className='fs-5'>Total commande: <span className='text-danger'>{totalCommande && totalCommande} &#8364;</span></p>
          <div className='col-sm-6'>
            <label className='d-block' htmlFor="nom">Nom sur la carte*</label>
            <input className='MyForm-input py-3 mb-4' id='nom' type="text" maxLength={30} placeholder='Isabelle' {...register("Nom", { required: true, maxLength: 30 })} />
            {errors.Nom?.type === 'required' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.Nom?.type === 'maxLength' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir maximum 30 caractères</p>}
          </div>

          <div className='col-sm-6'>
            <label className='d-block' htmlFor="numeroDeCarte">Numéro de carte*</label>
            <input className='MyForm-input py-3 mb-4' id='numeroDeCarte' type="text" maxLength="16" placeholder='4585978532648975' {...register("numeroDeCarte", {
              required: true, maxLength: 16, pattern:/^\d{16}$/ //ne prend que 16 chiffres sans espaces
            })} />
            {errors.numeroDeCarte?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.numeroDeCarte?.type === 'maxLength' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le numéro de la carte ne doit pas dépasser 16 chiffres</p>}
            {errors.numeroDeCarte?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le numéro de la carte est invalide</p>}
          </div>

          <div className='col-sm-6'>
            <label className='d-block' htmlFor="expiration">Date d'expiration*</label>
            <input
              className='MyForm-input py-3 mb-4'
              type="text"
              id="cardExpiry"
              name="cardExpiry"
              placeholder="MM/YY"
              {...register("dateExpirationCarte", {
                required: true,
                pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, //vérifie que la chaîne de caractères entrée correspond à un format valide sous la forme "MM/YY où "MM" est le mois (01-12) et "YY" les deux derniers chiffres de l'année.
                validate: validateExpiryDate
              })}
            />
            {errors.dateExpirationCarte?.type === 'required' && <p role="alert" className='text-danger mb-5' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.dateExpirationCarte?.type === "pattern" && <p role="alert" className='text-danger mb-5' style={{ marginTop: "-22px" }}>Le format doit être MM/YY</p>}
            {errors.dateExpirationCarte?.type === "validate" && <p role="alert" className='text-danger mb-5' style={{ marginTop: "-22px" }}>La date doit être future</p>}
          </div>

          <div className='col-sm-6'>
            <label className='d-block' htmlFor="cvv">Cvv*</label>
            <input className='MyForm-input py-3 mb-4' id='cvv' type="password" maxLength={3} placeholder='452' {...register("cvv", { required: true, maxLength: 3, pattern:/^\d{3}$/ })} />
            {errors.cvv?.type === 'required' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.cvv?.type === 'maxLength' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir maximum 3 caractères</p>}
            {errors.cvv?.type === 'pattern' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir que 3 chiffres</p>}
          </div>

          <div>
            <input className='d-block btn btn-outline fw-semibold mb-4' type="submit" value="Envoyer" />
          </div>
          {showAlert &&
          <div className='col-sm-6'>
            <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
              <strong className='d-block'>Merci d'être venu jusqu'ici</strong> Votre paiement a été effectué.
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>
          }
        </form>
      </div>
    </div>

  )
}

export default Payment


