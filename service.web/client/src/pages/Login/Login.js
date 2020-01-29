import React from 'react'
import {Link} from 'react-router-dom'
import LoginForm from './components/form'
import './login.scss'

/**
 *
 * @param {Object} props
 */
function Login(props = {}) {
  return (
    <div className="Login">
      <div className='center'>
        <div className='bx form-container'>
          <header>InstaClone</header>
          <div className='form'>
            <LoginForm/>
          </div>
          <div className='breaker'>
            <div className='i'></div>
            <div className='c'>or</div>
            <div className='i'></div>
          </div>
          <Link className='fp' to='/accounts/password/reset'>Forgot password?</Link>
        </div>
        <div className='bx opt'>
					<span>Don't have an account? <Link to='/register'>Sign up</Link></span>
				</div>
      </div>
    </div>
  );
}

export default Login
