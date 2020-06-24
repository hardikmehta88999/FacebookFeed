import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import Link from '@material-ui/core/Link';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import image from '../images/signup-image.webp';
import Checkbox from '@material-ui/core/Checkbox';
import { myFirebase } from "../firebase/firebase";
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import firebase from 'firebase'

const styles = () => ({
    "@global": {
        body: {
            backgroundColor: "#fff"
        }
    },
    paper: {
        marginTop: 100,

        width: 'auto',
        height: 'auto',
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#f50057"
    },
    form: {
        marginTop: 1
    },
    errorText: {
        color: "#f50057",
        marginBottom: 5,
        textAlign: "center"
    }
});

class Login extends Component {
    state = { email: "", password: "", name: '', password1: '', checked: false };

    handleEmailChange = ({ target }) => {
        this.setState({ email: target.value });
    };

    handlePasswordChange = ({ target }) => {
        this.setState({ password: target.value });
    };

    handleSubmit = () => {

        myFirebase
            .auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(user => {
                firebase.firestore().collection('user').doc(user.user.uid).set({

                    email: this.state.email,
                    followers: [],
                    name: this.state.name,
                    following: [],
                    uid: user.user.uid,
                    image: "https://image.shutterstock.com/image-vector/people-vector-icon-260nw-378571234.jpg"
                })

            })
    };

    handlecheck = () => {
        if (this.state.password === '')
            alert("Please Fill your Details");
        else if (this.state.password1 === '')
            alert("Please enter Repeat password");
        else if (this.state.password !== this.state.password1) {
            alert("\nPassword did not match: Please try again...")
            return false;
        }
        else if (this.state.checked === false) {
            alert("Please Accept the Terms and Condition")
        }
        else {
            this.handleSubmit();
        }
    }
    render() {
        const { classes, isAuthenticated } = this.props;
        if (isAuthenticated) {
            return <Redirect to="/home" />;
        } else {
            return (

                <Container maxWidth="md">
                    <Paper className={classes.paper} style={{ height: '370px' }}>
                        <div style={{ float: 'right' }}>

                            <img src={image} alt="image"></img>
                            <Link href="/" style={{ textDecoration: 'underline' }}>
                                <Typography component="h1" variant="h5" >
                                    I am already member
            </Typography>
                            </Link>
                        </div>

                        <Container maxWidth="sm" style={{ float: 'left', marginTop: '40px' }}>
                            <Typography component="h1" variant="h5" >
                                Sign up
            </Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                placeholder="Your Name"
                                name="email"
                                onChange={(e) => this.setState({ name: e.target.value })}
                                id="input-with-icon-textfield"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                id="input-with-icon-textfield"
                                margin="normal"
                                fullWidth
                                placeholder="Your Email"
                                name="email"
                                onChange={this.handleEmailChange}

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="input-with-icon-textfield"
                                name="password"
                                placeholder="Password"
                                type="password"
                                onChange={this.handlePasswordChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="input-with-icon-textfield"
                                name="password"
                                type="password"
                                placeholder="Repeat Your Password"
                                onChange={(e) => this.setState({ password1: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <Checkbox
                                    checked={this.state.checked}
                                    color="primary"
                                    onChange={(e) => this.setState({ checked: e.target.checked })}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                /> I agree all statements in Terms of service
                            </div>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                style={{ width: '150px', marginTop: '30px' }}
                                color="primary"
                                className={classes.submit}
                                onClick={() => this.handlecheck()}
                            >
                                register
            </Button>

                        </Container>
                    </Paper>
                </Container>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
        isAuthenticated: state.auth.isAuthenticated
    };
}

export default withStyles(styles)(connect(mapStateToProps)(Login));
