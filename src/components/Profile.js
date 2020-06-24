import React, { useEffect } from 'react';
import { Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import firebase from '../firebase/firebase'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { logoutUser } from "../actions";
import { pink } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 550,
        marginTop: '30px'
    },
    inline: {
        display: 'inline',
    },
    avatar: {
        backgroundColor: pink[500],
    },
}));
function Profile(props) {
    const classes = useStyles();
    const [user, setuserdata] = React.useState([]);
    const [userPost, setposts] = React.useState([]);


    const handleLogout = () => {
        const { dispatch } = props;
        dispatch(logoutUser());
    };
    useEffect(() => {
        const id = firebase.auth().currentUser.uid;
        firebase.firestore().collection('user').doc(id).onSnapshot(snap => {
            let arr = []
            arr.push(snap.data())
            setuserdata(arr)
        })
        firebase.firestore().collection('post').where('uid', '==', id).orderBy('timeStamp', "desc").onSnapshot(snap => {
            let userpost = []
            snap.forEach(value => userpost.push(value.data()))
            setposts(userpost)
        })


    }, []);
    console.clear()
    const renderVideo = (type, data) => {
        if (type === "video") {
            return (<video style={{ maxWidth: '100%', width: '500px' }} controls

                src={data} />

            )
        }
    }
    const renderImage = (type, data) => {
        if (type === "image") {
            return (
                <img src={data} style={{ width: '100%', height: '250px' }} />
            )
        }
    }
    const handlePosts = () => {
        if (userPost.length > 0) {
            return userPost.map(data => {
                return (
                    <Card className={classes.root} key={data.description}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" >
                                    {data.name[0]}
                                </Avatar>
                            }
                            title={data.name}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p" style={{ marginLeft: '40px', marginRight: '28px', marginTop: '-15px' }}>
                                {data.type === "post" ? data.description : " "}
                            </Typography>
                            {
                                renderVideo(data.type, data.description)
                            }{renderImage(data.type, data.description)}
                        </CardContent>
                    </Card>
                )
            })
        }
        else {
            return (
                <div style={{ marginTop: '150px' }}>
                    No Post Yet
                </div>
            )
        }

    }

    return (<div> <header className='navbar'>
        <div className='navbar__title'> Feed App</div>
        <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 2 ? '#0000FF' : '#D3D3D3' }}>
            Feed
          </Link>{' '}</div>
        <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? '#0000FF' : '#D3D3D3' }}>Profile</Link></div>
        <Button variant="contained"
            color="primary" onClick={
                handleLogout
            }>Logout</Button>
    </header>
        <Container maxWidth="sm">
            {user.map(data => {
                return (
                    <List className={classes.root} key={data.uid}>
                        <ListItem alignItems="flex-start" >
                            <ListItemAvatar>
                                {(<Avatar style={{ width: '70px', height: '70px' }}>{data.name[0]}</Avatar>)}
                            </ListItemAvatar>
                            <ListItemText
                                primary={<React.Fragment><Typography style={{ marginLeft: '40px', marginTop: '20px' }}>{data.name}</Typography></React.Fragment>}
                                secondary={<React.Fragment>
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            style={{ color: '#D3D3D3', marginLeft: '20px', marginTop: '20px' }}
                                            color="textPrimary"
                                        >
                                            {
                                                data.email
                                            }
                                        </Typography>
                                    </React.Fragment>
                                </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                )
            })}

            {
                handlePosts()
            }

        </Container >
    </div>
    );
}
function mapStateToProps(state) {
    return {
        isLoggingOut: state.auth.isLoggingOut,
        logoutError: state.auth.logoutError,
        isAuthenticated: state.auth.isAuthenticated

    };
}

export default connect(mapStateToProps)(Profile)