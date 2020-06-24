import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../actions";
import { withStyles } from "@material-ui/styles";
import Link from '@material-ui/core/Link';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import image from '../images/signin-image.webp';
import google from '../images/google.PNG';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import firebase from '../firebase/firebase'
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
  state = { email: "", password: "" };

  handleEmailChange = ({ target }) => {
    this.setState({ email: target.value });
  };

  handlePasswordChange = ({ target }) => {
    this.setState({ password: target.value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { email, password } = this.state;

    dispatch(loginUser(email, password));
  };
  handleGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(user => {
      console.log(user)
      if (user.additionalUserInfo.isNewUser) {
        firebase.firestore().collection('user').doc(user.user.uid).set({

          email: user.user.email,
          name: user.user.displayName,
          uid: user.user.uid,
          image: user.user.photoURL
        })
      }
    })
  }

  render() {
    const { classes, loginError, isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to="/home" />;
    } else {
      return (
        <Container maxWidth='md'>
          <Paper className={classes.paper} style={{ height: '450px' }}>
            <div style={{ float: 'left' }}>
              <img src={image} alt="im"></img>
              <Link href='/signup' style={{ textDecoration: 'underline' }}>
                <Typography component="h1" variant="h5" style={{ textAlign: 'center', marginTop: "20px" }} >
                  Create an Account
            </Typography>
              </Link>
            </div>

            <div style={{ float: 'right' }}>
              <Typography component="h1" variant="h5" >
                Login
            </Typography>
              <TextField
                margin="normal"
                fullWidth
                id="input-with-icon-textfield"
                placeholder="Email Address"
                name="email"
                onChange={this.handleEmailChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
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
                placeholder="Password"
                onChange={this.handlePasswordChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {loginError && (
                <Typography component="p" className={classes.errorText}>
                  Incorrect email or password.
                </Typography>
              )}
              <Button
                type="button"
                fullWidth
                variant="contained"
                style={{ width: '90px', marginTop: '40px' }}
                color="primary"
                className={classes.submit}
                onClick={this.handleSubmit}
              >
                Log in
            </Button>
              <div style={{ marginTop: "80px" }}>
                or login with&nbsp;<img src={google} alt="google" onClick={() => this.handleGoogle()} style={{ cursor: 'pointer' }}></img>
              </div>
            </div>
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
