import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form'
import axios from 'axios';



const UserAccountInformation = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [getData, setGetData] = useState(false);
  const [alert, setAlert] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  // const onSubmit = data => console.log(data);
  // console.log(errors);


  const hundleCloseAlert = () => {
    setAlert(false)
  }
  const updateData = async (newData) => {
    const token = localStorage.getItem('token')
    const options = {
      method: "PUT",
      url: "http://localhost:8000/users/update",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: newData
    }
    try {
      await axios(options)
      setValue("password", "")
      setAlert(true)

      // setUserInfo(response.data.result)
      // setGetData(true)
    } catch (error) {
      console.log(error)
    }
  }
  const onSubmit = (dataForm) => {
    // dataForm est l'ensemble des données saisies par l'utilisateur 
    // console.log(dataForm);
    updateData(dataForm)
  }

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token')
    const options = {
      method: "GET",
      url: "http://localhost:8000/users",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    try {
      const response = await axios(options)
      setUserInfo(response.data.result)
      setGetData(true)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (getData) {
      // Définir les valeurs par defaut des inputs
      setValue("sexe", userInfo[0].sexe)
      setValue("lastName", userInfo[0].lastName)
      setValue("firstName", userInfo[0].firstName)
      setValue("email", userInfo[0].email)
      setValue("phone", userInfo[0].phone)
      setValue("dateOfBirth", userInfo[0].dateOfBirth.slice(0, 10));
      setValue("streetNumberAndName", userInfo[0].streetNumberAndName)
      setValue("addressPostalCode", userInfo[0].addressPostalCode)
      setValue("addressCity", userInfo[0].addressCity)
      setValue("addressCountry", userInfo[0].addressCountry)
    }

  }, [getData, setValue, userInfo]);
  return (
    <div className='MyForm-container py-5  col-12 col-lg-9'>
      <div className='container fw-semibold'>
        <div className='MyForm-title mb-0 py-3 text-center row'>
          <h1>Mes informations personnelles</h1>
          {/* <p>Vous avez déjà un compte ? <Link to={'/signIn'} className='MyForm-subtitle text-decoration-none'>Connectez-vous</Link></p> */}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='MyForm py-5 px-md-5 row'>

          <div>
            <label htmlFor="info" className='me-2 d-block'>Civilité*</label>
            <select id="info" className='MyForm-select form-control py-3 mb-4' {...register("sexe", { required: true })}>
              <option value="Homme">M.</option>
              <option value="Femme">Mme</option>
            </select>
            {errors.sexe && <p className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champs est obligatoire</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="nom">Nom*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='nom' type="text" maxLength={30} {...register("lastName", { required: true, maxLength: 30 })} />
            {errors.lastName?.type === 'required' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.lastName?.type === 'maxLength' && <p role="alert" className='text-danger' style={{ marginTop: "-22px" }}>Ce champ doit avoir maximum 30 caractères</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="prenom">Prénom*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='prenom' type="text" {...register("firstName", { required: true, maxLength: 20 })} />
            {errors.firstName?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.firstName?.type === 'maxLength' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ doit avoir maximum 20 caractères</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="email">Email*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='email' type="email"  {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.email?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.email?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Email invalide</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="oldPassword">Mot de passe: Votre mot de passe a été crypté pour des raisons de sécurité</label>
            <input className='MyForm-input form-control py-3 mb-4' id='oldPassword' type="password" defaultValue={"*************"} />
          </div>

          <div>
            <label className='d-block' htmlFor="password">Nouveau mot de passe*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='password' type="password" placeholder='Si vous voulez changer de mot de passe, mettez ici le nouveau mot de passe choisit ' {...register("password", { min: 8, maxLength: 16, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/ })} />
            <p>Votre mot de passe doit contenir :</p>
            <ul className='SignUp-form-mdp-ul'>
              <li className='SignUp-form-mdp-li'>Entre 8 et 16 caractères</li>
              <li className='SignUp-form-mdp-li'>Au moins une majuscule</li>
              <li className='SignUp-form-mdp-li'>Au moins une minuscule</li>
              <li className='SignUp-form-mdp-li'>Au moins un chiffre</li>
            </ul>
            {errors.password?.type === 'min' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le mot de passe doit contenir au moins 8 caractères</p>}
            {errors.password?.type === 'maxLength' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le mot de passe doit contenir au maximum 16 caractères</p>}
            {errors.password?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le mot de passe est invalide</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="telephone">Téléphone*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='telephone' type="tel" {...register("phone", { required: true, maxLength: 12, pattern: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/i })} />
            {errors.phone?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
            {errors.phone?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Numéro de téléphone invalide</p>}
            {errors.phone?.type === 'maxLength' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le numéro de télophone ne doit pas avoir plus de 12 caractères</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="dateDeNaissance">Date de naissance*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='dateDeNaissance' type="date" {...register("dateOfBirth", {
              required: true,
              validate: (value) => {
                const dateOfBirth = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - dateOfBirth.getFullYear();
                dateOfBirth.setFullYear(today.getFullYear());
                if (today < dateOfBirth) {
                  age--;
                }
                return age >= 16 || "Vous devez avoir 16 ans ou plus pour commander sur ce site";
              }
            })} />
            {errors.dateOfBirth?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champs est obligatoire</p>}
            {errors.dateOfBirth?.message && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>{errors.dateOfBirth?.message}</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="nomDeRue">Numéro et nom de rue*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='nomDeRue' type="text" {...register("streetNumberAndName", { required: true, pattern: /^[0-9]+(?: ?[A-Za-zéèêëîïôöùûüÇçÀàÂâÊêÎîÔôÛûÜü]+)+$/ })} />
            {errors.streetNumberAndName?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champs est obligatoire</p>}
            {errors.streetNumberAndName?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Numéro et nom de rue invalide</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="codePostal">Code postal*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='codePostal' type="text" {...register("addressPostalCode", { required: true, pattern: /^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/i })} />
            {errors.addressPostalCode?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champs est obligatoire</p>}
            {errors.addressPostalCode?.type === 'pattern' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Le code postal est invalide</p>}
          </div>

          <div>
            <label className='d-block' htmlFor="ville">Ville*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='ville' type="text" {...register("addressCity", { required: true })} />
            {errors.Ville?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champs est obligatoire</p>}
          </div>

          <div>
            <label htmlFor="country" className='d-block me-2'>Pays*</label>
            <select id="country" className='py-3 MyForm-select form-control mb-4' {...register("addressCountry", { required: true })}>
              <option value="">Sélectionnez un pays</option>
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Canada">Canada</option>
              <option value="Suisse">Suisse</option>
            </select>
            {errors.addressCountry && <p className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champs est obligatoire</p>}
          </div>

          <div className='mb-3'>
            <input className='me-2' type="checkbox" {...register("politiqueDeConfidentialite", { required: true })} id="politiqueDeConfidentialite" />
            <label htmlFor="politiqueDeConfidentialite"> J'ai lu et accepté la politique de confidentialité de ce site*</label>
            {errors.politiqueDeConfidentialite?.type === 'required' && <p role="alert" className='text-danger mb-2'>Ce champs est obligatoire</p>}
          </div>

          <div>
            <input className='d-block btn btn-outline fw-semibold mb-3' type="submit" value="Envoyer" />
          </div>
          {alert &&
            <div className='col col-sm-10 col-lg-6'>
              <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                <p>Vos données ont été modifiées avec succès</p>
                <button type="button" onClick={hundleCloseAlert} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

export default UserAccountInformation;


