import React from 'react'
import { Link } from 'react-router-dom';
const Landing = () => {
    return (
        <div className="landing-bg">
            <div className="container">
                <div className="row">
                    <div className="offset-md-3 col-md-6 mt-5 pt-5">
                        <h1 className="mt-5 pt-5 text-center text-white">DEV PROFILER</h1>
                        <p className="text-center text-white">Create and show your portfolio, express ideas</p>
                        <div className="landing-btns"> <Link to="/register" className="btn btn-primary mr-2">Sign up</Link>
                            <Link to="/login" className="btn btn-light">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
