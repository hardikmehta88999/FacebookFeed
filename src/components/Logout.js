import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../actions";
import Container from "@material-ui/core/Container";

class Logout extends Component {
    handleLogout = () => {
        const { dispatch } = this.props;
        dispatch(logoutUser());
    };
    render() {

        return (
            // <div>
            <Container maxWidth="md">
                <button style={{ marginTop: '40px' }} onClick={this.handleLogout}>Logout</button>
            </Container>
            // </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoggingOut: state.auth.isLoggingOut,
        logoutError: state.auth.logoutError
    };
}

export default connect(mapStateToProps)(Logout);