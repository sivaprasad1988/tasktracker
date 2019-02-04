import React, {Component} from "react";
import {Link} from "react-router-dom";

class NavbarAfterLogin extends Component {
    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper">
                        <a href="/dashboard" className="brand-logo">Logo</a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li>
                                <Link to="/trello-integration">Trello Login</Link>
                            </li>

                            <li><a href="javascript:void(0)" onClick={this.onLogoutClick}>Logout</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavbarAfterLogin;
