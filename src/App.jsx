import React, {useState, useEffect} from "react";
import "./App.css";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import ViewAgendaOutlinedIcon from "@material-ui/icons/ViewAgendaOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import NoteAltOutlinedIcon from '@material-ui/icons/NoteOutlined';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Note from './Note';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Settings from './Settings'
import UserProfile from './UserProfile'
import {db, auth} from './firebase';
import firebase from 'firebase'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();

function App() {
  // user credential variables
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
  const [checkbox, setChecked] = useState()

  const [user, setUser] = useState(null)

  // Note variables heading, body
  const [noteBody, setNoteBody] = useState('')
  const [noteHead, setNoteHead] = useState('')

  // saving note to database
  const submitNote = ()=>{
    if(user){
      if(noteBody == "" && noteHead == ""){
        alert('Both fields cannot be empty!')
      }
      else{
        db.collection('users').doc(user.uid).collection('posts')
        .add({
          title: noteHead,
          body: noteBody,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(()=>{
          setNoteBody('')
          setNoteHead('')
        })
        .catch((err)=>err.message) 
      }
    }
    else{
      alert('Login required!')
    }
  }  

  const [note, setNote] = useState([])

  // getting notes data from database
  useEffect(()=>{
    
    // running once component loads
    if(user){
      db.collection('users').doc(user.uid).collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot)=>{
        setNote(snapshot.docs.map(doc=>({
          id: doc.id,
          notes: doc.data()
        })))
      })
    }
    else{
      setNote([])
    }
  }, [user])

  // search note variables
  const [searchNote, setSearchNote] = useState('')

  // searching note function
  useEffect(()=>{
    let notesCard = document.getElementsByClassName('note-box')
    Array.from(notesCard).forEach(function(element){
      let cardText = element.getElementsByClassName('note-box-body')[0].innerHTML;
      
      // checking if card body includes use input string
      if(cardText.includes(searchNote)){
        element.style.display = "block"
      }
      else{
        element.style.display = "none"
      }
    })
  }, [searchNote])

  // deleting note
  const deleteNoteItem = (id)=>{
    db.collection('users').doc(user.uid)
    .collection('posts').doc(id.id).delete()
  }

  //userEffect
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        setUser(authUser)
      }
      else{
        setUser(null)
      }
    })

    return ()=>{
      unsubscribe()
    }
  }, [user, firstName, lastName])

  // account registration on db

  const AccountRegistration = (e)=>{
    e.preventDefault()
    if(checkbox){
      auth.createUserWithEmailAndPassword(email, password).then(cred=>{
        cred.user.updateProfile({
          displayName: firstName + "" + lastName
        })
        return db.collection('users').doc(cred.user.uid).set({
          firstName: firstName,
          LastName: lastName,
          Subscribed: false
        })
      }).then(()=>{
        setOpen3(false)
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
  
      }).catch((err)=>alert(err.message))
    }
    else{
      alert('Agree to terms and conditions')
    }
  }

  const userLogin = ()=>{
    auth.signInWithEmailAndPassword(email, password).catch((err)=> alert(err.message))
    setEmail('')
    setPassword('')
    setOpen3(false)
  }

  // logging user out
  const handleLogout = ()=>{
    auth.signOut()
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //account modal
  const [login, setLogin] = useState(false)

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleNavMenu = ()=>{
    document.querySelector('.side-menu').classList.toggle('sideMenuWidth');
  } 

  const handleOpenForm = ()=>{
    document.querySelector('.note-title').style.display = 'block'
    document.querySelector('.note-icons').style.display = 'block'
  }

  const handleCloseForm = ()=>{
    document.querySelector('.note-title').style.display = 'none'
    document.querySelector('.note-icons').style.display = 'none'
  }

  // signup modal and login modal
  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  border: 0,
  zIndex: 1500
};

  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);

  // note flex direction variables
  const [noteDirection, setNoteDirection] = useState(false)

  // making column view for notes:
  const handleFlexView = ()=>{
    if(noteDirection === false){
      setNoteDirection(true)
    }
    else{
      setNoteDirection(false)
    }
  }

  return (
    <>

      <Settings Open={open} handleClose={handleClose} anchor={anchorEl} currentUser={user}/>

      <section>
        <nav className="navbar">
          <div className="navbar-left">
            <a className="nav-main-menu" onClick={handleNavMenu}>
              <MenuRoundedIcon />
            </a>
            <img
              src="09-10C-valentines-Envelope.png"
              alt=""
              width="60px"
              height="60px"
            />
            <h3 className="navbar-heading">Notes</h3>
          </div>
          <div className="mid-container">
            <input
              type="text"
              className="search-box"
              placeholder="Search"
              autocomplete="off"
              value = {searchNote}
              onChange = {(e)=> setSearchNote(e.target.value)}
            />
            <a className="nav-search-mid">
              <SearchOutlinedIcon />
            </a>
          </div>
          <div className="right-container">
            <a className="nav-search-right">
              <SearchOutlinedIcon />
            </a>
            <a className="nav-list-view" onClick={handleFlexView}>
              <ViewAgendaOutlinedIcon />
            </a>
            <a className="nav-setting" onClick={handleClick}>
              <SettingsOutlinedIcon />
            </a>
          {user ? (
                        <Tooltip title="Account settings">
                        <IconButton onClick={handleClick2} size="small" sx={{ ml: 2 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>{user && user.displayName[0].toUpperCase()}</Avatar>
                        </IconButton>
                      </Tooltip>
          ) : (<Button variant="text" onClick={handleOpen3} style={{color: '#007FFF'}}>SIGNUP</Button>)}
          <UserProfile anchor2={anchorEl2} open2={open2} handleClose2={handleClose2} handleLogout={handleLogout} currentUser={user} />
          </div>
        </nav>
      </section>

      <section className="side-menu">
        <div className="side-box">
        <ul>
        <li class="side-list-item active"><a><NoteAltOutlinedIcon /><span>Notes</span></a></li>
        <li class="side-list-item"><a><StarBorderOutlinedIcon /><span>Important</span></a></li>
        <li class="side-list-item"><a><ArchiveOutlinedIcon /><span>Archieve</span></a></li>
      </ul>
        </div>
      </section>

      <section class="container-note-box">
    <div class="container-note">
      <input type="text" class="note-title" placeholder="Title" id="note-title" autoComplete="off" value={noteHead} onChange={(e)=>setNoteHead(e.target.value)} />
      <textarea class="note-body" onClick={handleOpenForm} rows="1" placeholder="Add a note..." value={noteBody} onChange={(e)=> setNoteBody(e.target.value)}/>
      <div class="note-icons">
        <ul class="note-icons-box">
          <li style={{paddingRight: 20 + "px"}}><a><PaletteOutlinedIcon className="input-box-icons" /></a></li>
          <li> <a><ArchiveOutlinedIcon className="input-box-icons" /></a></li>
          <div className="note-submit-box">
          <li><a class="note-add" onClick={submitNote}>Add</a></li>
          <li onClick={handleCloseForm}><a class="note-close">close</a></li>
          </div>
        </ul>
      </div>
    </div>
  </section>


        <Modal
        open={open3}
        onClose={handleClose3}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1}} style={{backgroundColor: "#9C27B0"}}>
            <LockOutlinedIcon />
          </Avatar>
		  <Typography component="h1" variant="h5">
            {!login ? (<h4>Signup</h4>) : (<h4>login</h4>) }
          </Typography>
		  {!login ? (
			  <div style={{marginTop: 18 + "px"}}>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
				  variant="outlined"
				  value={firstName}
				  onChange={(e)=>setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="lname"
				  variant="outlined"
				  value={lastName}
				  onChange={(e)=>setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
				  variant="outlined"
				  value={email}
				  onChange={(e)=>setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
				  variant="outlined"
				  value={password}
				  onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox onChange={(e)=>setChecked(e.target.checked)} color="primary" />}
                  label="By Signing in you accept our Terms and Conditions"
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
			  type="submit"
        onClick={AccountRegistration}
			  style={{marginBottom: 10 + "px", marginTop: 10 + "px", backgroundColor: "#1976D2", color: "#FFF"}}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" onClick={()=>setLogin(true)}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
			  </div>
		  ) : (
			  <div>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
				          variant="outlined"
				          autoFocus
                  value={email}
				          onChange={(e)=>setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
				          variant="outlined"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
			        style={{marginBottom: 10 + "px", marginTop: 10 + "px", backgroundColor: "#1976D2", color: "#FFF"}}
              onClick={userLogin}
            >
              LOGIN
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" onClick={()=>setLogin(false)}>
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
			  </div>
		  )}
        </Box>
        <Copyright style={{marginTop: 7 + "px"}}/>
      </Container>
    </ThemeProvider>
        </Box>
      </Modal>

  <section class="display-note-box">
            <div class="display-note-container" style={!noteDirection ? ({flexDirection: "row"}) : ({flexDirection: "column", alignItems: "center"})}>
              {
                note.map(({id, notes})=>(
                  <Note key={id} noteId={id} title={notes.title} body={notes.body} deleteNote={()=>deleteNoteItem({id})} />
                ))
              }
            </div>
  </section>
    </>
  );
}

export default App;
