import React from 'react';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formdata, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const { name, email, password, passwordConfirm } = formdata;

    const onChange = (e) => setFormData({
        ...formdata,
        [e.target.name]: e.target.value
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            console.log('password don\'t match');
        } else {

            try {
                const newUser = {
                    name,
                    email,
                    password
                };

                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    baseURL: "http://localhost:5000"
                };


                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);
                console.log(res.data);

            } catch (error) {
                console.error(error);
            }

        }
    }
    return (
        <Fragment>
            <div className="row">
                <div className="offset-md-3 col-md-6 mt-2 py-5 bg-white">
                    <form onSubmit={e => onSubmit(e)}>
                        <h1 className="text-center text-primary mb-3">Sign up</h1>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="name" name="name" value={name} onChange={e => onChange(e)} required />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="gravatar email" name="email" value={email} onChange={e => onChange(e)} required />
                        </div>
                        <small className="form-text mb-3">This site use gravatar. If you want a profile image, use a Gravatar email.</small>
                        <div className="form-group">
                            <input type="password" className="form-control" minLength="6" placeholder="password" name="password" value={password} onChange={e => onChange(e)} required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" minLength="6" placeholder="confirm password" name="passwordConfirm" value={passwordConfirm} onChange={e => onChange(e)} required />
                        </div>
                        <input type="submit" className="btn btn-primary" value="Register" />
                    </form>
                    <p className="my-1">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </Fragment>
    )
}

export default Register;
