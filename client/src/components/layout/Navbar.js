import React from 'react'
import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/" className="navbar-brand">DevProfiler</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link to="/" className="nav-item nav-link">Developers</Link>
                    <Link to="/register" className="nav-item nav-link">Register</Link>
                    <Link to="/login" className="nav-item nav-link">Login</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
