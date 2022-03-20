import React, {useState} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MailOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {db, auth} from './firebase';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { findByLabelText } from '@testing-library/dom';
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
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


function UserProfile({currentUser, anchorEl2, open2, handleClose2, handleLogout}){
  // change password variables
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // fun to change logged in user password:
  const handlePasswordChange = ()=>{
    currentUser.updatePassword(newPassword).then(()=>{
      handleClose6(false)
      setNewPassword('')
      setConfirmPassword('')
      auth.signOut()
    }).catch((err)=>{
      handleClose6(false)
      alert(err.message)
      setNewPassword('')
      setConfirmPassword('')
    })
  }

  // func to delte user account
  const handleDeleteAccount = ()=>{
    db.collection('users').doc(currentUser.uid).delete()
    return currentUser.delete()
    .then(()=>{
      setOpen7(false)
      alert('account deleted successfully')
    }).catch((err)=> alert(err.message))
  }

  // password change dialog
  const [open6, setOpen6] = useState(false);
  const handleOpen6 = () => setOpen6(true);
  const handleClose6 = () => setOpen6(false);

  // delete account confirmation dialog
  const [open7, setOpen7] = useState(false);

  const handleClickOpen7 = () => {
    setOpen7(true);
  };

  const handleClose7 = () => {
    setOpen7(false);
  };

    return(
      <div>
      <Menu
        style={{marginTop: -515 + "px"}}
        anchorEl={anchorEl2}
        getContentAnchorEl={null}
        open={open2}
        onClose={handleClose2}          
        onClick={handleClose2}
        PaperProps={{
          elevation: 2,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar style={{marginRight: 14 + "px"}} /> {currentUser?.displayName}
        </MenuItem>
        <Divider style={{marginBottom: 10 + "px", marginTop: 7 + "px"}} />
        <MenuItem onClick={handleOpen6}>
          <ListItemIcon>
            <LockOutlinedIcon style={{marginLeft: 10 + "px"}} />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleClickOpen7}>
          <ListItemIcon>
            <DeleteOutlinedIcon style={{marginLeft: 10 + "px"}} />
          </ListItemIcon>
          Delete Account 
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon style={{marginLeft: 10 + "px"}} />
          </ListItemIcon>
          logout
        </MenuItem>
      </Menu>

      <Modal
        open={open6}
        onClose={handleClose6}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p>Change Password</p>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div>
            <Box
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '30ch' },
                    mt: 2
                    }}
                    noValidate
                    autoComplete="off"
                    >
                  <TextField
                  type='password'
                  id="input-with-icon-textfield"
                  label="new password"
                  variant="standard"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                />
                <TextField
                type='password'
                  style={{marginTop: 10 + "px"}}
                  id="input-with-icon-textfield"
                  label="confirm password"
                  variant="standard"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                />
              </Box>
              <div>
              <Button variant="contained" onClick={handlePasswordChange} style={{width: 270 + "px", marginTop: 25 + "px", backgroundColor: "#1565C0", color: "#FFF"}}>
                submit
              </Button>
              </div>
            </div>
          </Typography>
        </Box>
      </Modal>
      <Dialog
        open={open7}
        onClose={handleClose7}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <p style={{color: "#FF0000"}}>Account Deletion</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Note: </strong>your account will be deleted instantly and you
            won't be able to retrive your data all your information will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose7} style={{color: "#1565C0"}}>
            Cancel
          </Button>
          <Button style={{color: "#FF0000"}} onClick={handleDeleteAccount}>Delete Account</Button>
        </DialogActions>
      </Dialog>
      </div>
    )
}

export default UserProfile