import React from 'react'
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formdata, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const { email, password, passwordConfirm } = formdata;

    const onChange = (e) => setFormData({
        ...formdata,
        [e.target.name]: e.target.value
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            console.log('password don\'t match');
        } else {


        }
    }
    return (
        <Fragment>
            <div className="row">
                <div className="offset-md-3 col-md-6 mt-2 py-5 bg-white">
                    <form onSubmit={e => onSubmit(e)}>
                        <h1 className="text-center text-primary mb-3">Sign In</h1>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="email" name="email" value={email} onChange={e => onChange(e)} required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" minLength="6" placeholder="password" name="password" value={password} onChange={e => onChange(e)} required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" minLength="6" placeholder="confirm password" name="passwordConfirm" value={passwordConfirm} onChange={e => onChange(e)} required />
                        </div>
                        <input type="submit" className="btn btn-primary" value="Sign In" />
                    </form>
                    <p className="my-1">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>
        </Fragment>
    )
}

export default Login
