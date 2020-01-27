import React from 'react'
import { Link } from 'react-router-dom'
import './lander.scss'

function Lander() {
	return (
		<div className='Lander'>
			<div className='hero'>
				<div className='head bx'>
					<header>InstaClone</header>
					<span>Share photos and videos to the world.</span>
				</div>
				<div className='opt bx'>
					<span>Have an account? <Link to='/login'>Log in</Link></span>
				</div>
				<div className='opt bx'>
					<span>Don't have an account? <Link to='/register'>Sign up</Link></span>
				</div>
			</div>
		</div>
	)
}

export default Lander
