import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";

function Login({ setLoggedIn, setUserId }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:9000/login', {
				email,
				password,
			});
			console.log('Login successful:', response.data);
			setLoggedIn(true);
			setUserId(response.data.userId);

			// Save userId to localStorage for 2 hours
			localStorage.setItem('userId', response.data.userId);
			setTimeout(() => {
				localStorage.removeItem('userId');
			}, 7200000); // 2 hours in milliseconds

			navigate('/dashboard');
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	return (
		<div className={`${styles.container} d-flex flex-column align-items-center mt-3`}>
			<h2 className='fs-2 fw-bold text-light mt-5 mb-4'>Login</h2>
			<form className='w-75'>
				<div className='mb-3'>
					<input
						className='form-control p-2'
						type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className='mb-3'>
					<input
						className='form-control p-2'
						type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className='mb-3 d-grid'>
					<button className='btn btn-light btn-lg' onClick={handleLogin}>Login</button>
				</div>
			</form>
			<p className='text-light'>Not registered yet?</p>
			<Link to="/register">
				<button className='btn btn-outline-light btn-lg'>Register</button>
			</Link>
		</div>
	);
}

export default Login;
