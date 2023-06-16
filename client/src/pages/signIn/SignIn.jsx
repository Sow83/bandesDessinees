
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../utils/AuthContext'
import axios from 'axios'
import { CartContext } from '../../utils/CartContext'

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const { login } = useContext(AuthContext)

  const {value} = useContext(CartContext);
  const {cartItems} = value

  const navigate = useNavigate()


  /*Hook "useForm" de la bibliothèque "react-hook-form:
    Permet d'enregistrer des entrées de formulaire et de les valider avant de soumettre le formulaire.
   */
  const { register, handleSubmit, formState: { errors } } = useForm()
  // console.log(errors);
  const onSubmit = dataForm => {
    fetchData(dataForm)
    // console.log(dataForm);
  }
  const fetchData = async (dataForm) => {
    const options = {
      url: 'http://localhost:8000/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: dataForm
    }
    try {
      const response = await axios(options)
      // console.log(response.data.message)
      // console.log(response.data.user)
      // console.log(response.data.token)

      const token = response.data.token
      if (token) {
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // stocker le token dans le localStorage
        localStorage.setItem('token', token)
        login()
        if (cartItems.length === 0) {
          navigate('/')
        }
        else {
          navigate('/basket')
        }
      }


    } catch (error) {
      console.log(error)
      console.log(error.response.data.message)
      setErrorMessage(error.response.data.message)
    }

  }

  return (
    <div className='MyForm-container py-5'>
      <div className='container fw-semibold'>
        <div className='MyForm-title mb-0 py-3 text-center row'>
          <h1>Connectez-vous</h1>
          <p>Nouveau client ? <Link to={'/signUp'} className='MyForm-subtitle text-decoration-none' >Créer un compte</Link></p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='MyForm py-5 px-md-5 row' data-testid='form-signIn' >

          <div className='col-12 offset-lg-4 col-lg-4 offset-lg-4'>
            <label className='d-block' htmlFor="email">Email*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='email' type="email"  {...register("email", { required: true })} />
            {errors.email?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
          </div>

          <div className='col-12 offset-lg-4 col-lg-4 offset-lg-4'>
            <label className='d-block' htmlFor="mdp">Mot de passe*</label>
            <input className='MyForm-input form-control py-3 mb-4' id='mdp' type="password" {...register("password", { required: true })} />
            {errors.password?.type === 'required' && <p role="alert" className='text-danger mb-2' style={{ marginTop: "-22px" }}>Ce champ est obligatoire</p>}
          </div>

          <div className='offset-lg-4 col-lg-4 offset-lg-4 mb-3'>
            <input className='d-block btn btn-outline fw-semibold' type="submit" value="Envoyer" />
          </div>
          {errorMessage && <p className='offset-lg-4 col-lg-4 offset-lg-4 text-danger'>{errorMessage}</p>}
        </form>
      </div>
    </div>

  )
}

export default SignIn


