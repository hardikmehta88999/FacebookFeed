import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import '../App.css'
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import firebase from '../firebase/firebase';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { logoutUser } from "../actions";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    color: 'secondary'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    maxWidth: 550,
    marginTop: '30px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  // avatar: {
  //   backgroundColor: pink[500],
  // },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Home(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setdescription] = React.useState('')
  const [name, setname] = React.useState('')
  const [post, setposts] = React.useState([])
  const [opendialog, setOpendialog] = React.useState(false);
  const [imageuploaded, setimageuploaded] = React.useState('')
  const [value, setvalue] = React.useState('')
  const [search, setsearch] = React.useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleLogout = () => {
    const { dispatch } = props;
    dispatch(logoutUser());
  };
  const handleClickOpendialog = () => {
    setOpendialog(true);
  };

  const handleimgUpload = () => {
    const uploadTask = firebase.storage().ref(`images/${imageuploaded.name}`).put(imageuploaded);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      error => {

      },
      () => {

        firebase.storage()
          .ref("images")
          .child(imageuploaded.name)
          .getDownloadURL()
          .then(url => {
            setimageuploaded(url)
            handleShareImage(url)
          });
      }
    );
  }
  const handleCloseDialog = () => {
    setOpendialog(false);
    handleimgUpload()
  };

  const handleClosedDialog = () => {
    setOpendialog(false);
  };

  useEffect(() => {
    const id = firebase.auth().currentUser.uid;
    firebase.firestore().collection('user').doc(id).onSnapshot(snap => {
      setname(snap.data().name)
      firebase.firestore().collection('post').orderBy('timeStamp', 'desc').onSnapshot(snap => {
        let arr = []
        snap.forEach(value => {
          if (value.data().uid !== id) {
            arr.push(value.data())

          }

        })
        setposts(arr)
      })
    })

  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleShare = () => {
    setOpen(false);
    if (description.length > 0) {
      const id = firebase.auth().currentUser.uid;
      firebase.firestore().collection('post').add({
        uid: id,
        description: description,
        name: name,
        timeStamp: new Date(),
        type: 'post'
      })
    }

  }
  const handleShareImage = (url) => {
    if (url) {
      const id = firebase.auth().currentUser.uid;
      firebase.firestore().collection('post').add({
        uid: id,
        name: name,
        description: url,
        timeStamp: new Date(),
        type: value
      })
    }

  }

  const handleChange = e => {
    if (e.target.files[0]) {
      const banner = e.target.files[0];
      setimageuploaded(banner)
    }
  };
  const renderVideo = (type, data) => {
    if (type === "video") {
      return (<video style={{ maxWidth: '100%', width: '500px' }}
        controls
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
  const renderCards = (post) => {

    if (post.length > 0) {
      for (var i = 0; i < post.length; i++) {
        let arr = post;
        if (search.length > 0) {
          arr = post.filter(user => {
            if (user.name != null && user.name.toLowerCase().startsWith(search.toLowerCase())) {
              return true;
            } else {
              return false;
            }
          })
        }
        return arr.map(data => {
          return (
            <Card className={classes.root}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" >
                    {data.name[0]}
                  </Avatar>
                }

                title={data.name}
              />
              <CardContent>

                <Typography variant="body2" color="textSecondary" component="p" style={{ textAlign: 'center', marginLeft: '40px', marginTop: '-20px', marginRight: '20px' }}>
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
    }
    else {
      return (<div style={{ marginTop: '30px' }}>No Post Yet</div>)
    }


  }
  return (
    < div >
      <header className='navbar'>
        <div className='navbar__title'> Feed App</div>
        <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 1 ? '#0000FF' : '#D3D3D3' }}>
          Feed
          </Link>{' '}</div>
        <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? '#0000FF' : '#D3D3D3' }}>Profile</Link></div>
        <Button variant="contained"
          color="primary" onClick={
            handleLogout
          }>Logout</Button>

      </header>
      <Container maxWidth="sm">
        <input type="text" placeholder="Search.." className="myInput"
          onChange={(e) => { setsearch(e.target.value) }} title="Type in a name" value={search}></input>
        <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={() => handleClickOpen()}>Write Post</Button>&nbsp;
        <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={() => { setvalue("image"); handleClickOpendialog() }}>Upload Image</Button>
        <Dialog open={opendialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" >
          <DialogContent>
            <DialogContentText>
              Select {value}
            </DialogContentText>
            <input type="file" accept={value === "image" ? "image/*" : "video/*"} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              OK
          </Button>
            <Button onClick={handleClosedDialog} color="primary">
              Cancel
          </Button>
          </DialogActions>
        </Dialog>&nbsp;
        <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={() => { setvalue("video"); handleClickOpendialog() }}>
          Upload Video</Button>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Write Something to Post
            </Typography>
              <Button autoFocus color="inherit" onClick={handleShare}>
                Share
            </Button>
            </Toolbar>
          </AppBar>
          <TextareaAutosize
            style={{ width: '100%', height: '200px' }}
            variant="outlined"
            margin="normal"
            fullWidth
            name="description"
            placeholder="Description"
            type="textarea"
            id="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
        </Dialog>
        {renderCards(post)}
      </Container>
    </div >
  );
}
function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
    isAuthenticated: state.auth.isAuthenticated

  };
}

export default connect(mapStateToProps)(Home)