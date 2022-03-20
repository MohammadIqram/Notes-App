import React,{useState} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import './Settings.css';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import {db} from './firebase';
import firebase from 'firebase'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '3px',
  boxShadow: 24,
  p: 4,
};

function Settings({Open, handleClose, anchor, currentUser}){
  // account feedback variables
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [feedbackQuery, setFeedbackQuery] = useState('')
  const [feedbackProgress, setFeedbackProgress] = useState(false)

  // function to submit feedback
  const sendFeedback = ()=>{
    
    // sending data to database
    if(currentUser){
      db.collection('users').doc(currentUser.uid).collection('feedback')
      .add({
        Query: feedbackQuery,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(()=>{
        setFeedbackEmail('')
        setFeedbackQuery('')
        setFeedbackProgress(true)
      }).catch((err)=> err.message)
    }
    else{
      if(feedbackEmail === '' || feedbackQuery === ''){
        alert('fields empty')
      }
      else{
        db.collection('AnonymousFeedback').add({
          User: feedbackEmail,
          Query: feedbackQuery,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>{
          setFeedbackEmail('')
          setFeedbackQuery('')
          setFeedbackProgress(true)
        }).catch((err)=> alert(err.message))
      }
    }
  }


  // modal for app version
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);

  // modal for feedback
    const [open3, setOpen3] = useState(false);
    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);

    const [open4, setOpen4] = useState(false);

    const handleClickOpen4 = () => {
      setOpen4(true);
    };
  
    const handleClose4 = () => {
      setOpen4(false);
    };

    return (
      <div>
        <Menu style={{marginTop: 2 + "rem"}}
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchor}
        open={Open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem style={{fontSize: 15 + "px"}}>Enable dark theme</MenuItem>
        <MenuItem style={{fontSize: 15 + "px"}} onClick={handleOpen3}>Send feedback</MenuItem>
        <MenuItem style={{fontSize: 15 + "px"}} onClick={handleClickOpen4}>Subscribe</MenuItem>
        <MenuItem style={{fontSize: 15 + "px"}} onClick={handleOpen2}>App version</MenuItem>
      </Menu>

            <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h5" component="h7">
                Version 0.9.1 (beta version)
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <ul className="modal2-ul">
                  <li>Bug fixes</li>
                  <li>Responsive</li>
                </ul>
                <p className="modal2-para"><strong>Note:</strong> The app is under development. You might see some bugs and issues please report to the team 
                  in the feedback section.
                </p>
              </Typography>
            </Box>
          </Modal>

      <Modal
        open={open3}
        onClose={handleClose3}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{color: "#1E90FF"}}>
            Feedback!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="feedback-box">
              <p className="feedback-para"><strong>Note:</strong> feedback waiting time 24hrs.</p>
              {currentUser ? (<div className="feedback-logged-email"><AccountCircle /> &nbsp; {currentUser.email}</div>) : (
                  <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '30ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  id="input-with-icon-textfield"
                  value={feedbackEmail}
                  onChange={(e)=>setFeedbackEmail(e.target.value)}
                  label="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
              </Box>
              )}
                  <Box
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '30ch' },
                    mt: 3
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField
                      id="filled-multiline-static"
                      label="feedback!!!"
                      multiline
                      rows={4}
                      variant="filled"
                      value={feedbackQuery}
                      onChange={(e)=>setFeedbackQuery(e.target.value)}
                    />  
              </Box>
                <div className="feedback-button-container">
                <Button variant="contained" endIcon={!feedbackProgress && (<SendIcon />)} disabled={feedbackProgress ? (true) : (false)} className="feedback-button" onClick={sendFeedback}>
                {feedbackProgress ? ('pending...') : ('Send')}
              </Button>
                </div>
            </div>
          </Typography>
        </Box>
      </Modal>
      <Dialog
            open={open4}
            onClose={handleClose4}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Subscribe
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose4} className="subButton">
                Cancel
              </Button>
              <Button className="subButton">Subscribe</Button>
            </DialogActions>
          </Dialog>
      </div>
    )
}

export default Settings;