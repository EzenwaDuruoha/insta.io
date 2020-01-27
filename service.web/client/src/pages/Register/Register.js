import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from './components/form'
import './register.scss'

function Register(props) {
  return (
    <div className="Register">
      <div className='center'>
        <div className='bx form-container'>
          <header>InstaClone</header>
          <div className='form'>
            <RegisterForm/>
		      </div>
          <p className='terms'>
            By signing up, you agree to our Terms .
            Learn how we collect, use and share your data in our Data Policy and
            how we use cookies and similar technology in our Cookies Policy .
		      </p>
        </div>
        <div className='bx opt'>
          <span>Have an account? <Link to='/login'>Log in</Link></span>
        </div>
      </div>
    </div>
  );
}

export default Register
