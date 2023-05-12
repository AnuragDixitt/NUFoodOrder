import axios from '../extra/api'
import { useState, useEffect } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import getCookie from "../extra/getCookie";
import { InputAdornment } from '@mui/material';
import  {FormHelperText}  from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';


const VendorProfile = (props) => {
    const curr = JSON.parse(localStorage.getItem('user'));
    const [thisUser, setThisUser] = useState({ 
        _id: curr._id,
        Name: curr.Name,
        Email: curr.Email,
        userStatus: curr.userStatus,
        ContactNo: curr.ContactNo,
        Age: curr.Age,
        BatchName: curr.BatchName
    });
    
    const [buttonText, setButtonText] = useState('Edit');
    const [currPass, setCurrPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState("");


    useEffect( () => {
        (async function() {
            const token = getCookie('jwt')
            await axios.get('http://localhost:4000/user/protected',{headers: {'Authorization': `Bearer ${token}`}})
        })()
    }, [])

    // setInterval(preventManualUrlChange(), 100);
    const handleChange = (prop) => (event) => {
        setThisUser({ ...thisUser, [prop]: event.target.value });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    
    const onChangeCurrPass = (event) => {
        setCurrPass(event.target.value);
    }

    const onChangeNewPass = (event) => {
        let regularExpression = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/
        
        setNewPass(event.target.value);        
        
        if(!String(event.target.value).match(regularExpression)){
            setPasswordError('Please hover to icon for password requirements');
            return;
        }else{
            setPasswordError("");
        }
    }

    const onChangeConfirmNewPass = (event) => {
        setConfirmNewPass(event.target.value);
    }

    const [expand, setExpand] = useState(true);

    const [height, setHeight] = useState(500);

    const onSubmit = (props) => {
        var elements = document.getElementsByClassName("MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input");
        if (buttonText === 'Edit') {
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=false;}
            setButtonText('Submit');
            if (expand === true){
                setHeight(height+350);
                setExpand(false);
            }
        } else {
            axios
                .post('http://localhost:4000/user/edit', {user: thisUser, changePassword: false})
                .then((res)=>{
                    swal('Edited successfully', 'Your details have been updated.', 'success');
                })
                .catch((err)=>console.log(err.response.data));
            for (var i = 0; i < elements.length; i++) { elements[i].readOnly=true; }
            localStorage.setItem('user', JSON.stringify(thisUser));
            setButtonText('Edit');
            setHeight(height-350);
            setExpand(true);
        }
    };

    const onChangePasswordButton = () => {
        if (newPass === confirmNewPass) {
            if (currPass === '' || newPass === '' || confirmNewPass === ''){
                alert("Oops! This field is empty! Please fill all the fields to proceed.");
                // swal({title : 'Oops! ', text : ' This field is empty! Please fill all the field to proceed ', icon:  'warning'});
            }
            axios
                .post('http://localhost:4000/user/edit', {
                    _id: thisUser._id, 
                    currPass: currPass,
                    newPassword: newPass, 
                    changePassword: true
                }).then((response)=>{
                    swal('Password changed successfully', 'Your password has been changed.', 'success');
                })
                .catch((err) => {
                    swal({icon: 'error', text: err.response.data})
                });
        } else {
            swal('Passwords don\'t match', 'Please confirm your new password correctly.', 'error');
        }
        setCurrPass(''); setNewPass(''); setConfirmNewPass('');
    }

    return (<div>
        <Box sx={{ display: 'flex' }}>
            <Box
            component="main"
            sx={{

                backgroundColor:'#F5FEFD',    
                flexGrow: 1,
                height: '93.9vh',
                overflow: 'auto',
            }}
            >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
                <Grid container spacing={2} align={'center'}>
                <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 6,
                        display: 'flex',
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'column',
                        height: height,
                        width:600,
                        borderRadius:"20px 20px 20px 20px",
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    }}
                >
                    <Grid container align={'center'}>
                        <Grid item xs={buttonText === 'Edit' ? 24 : 12}>
                            <Grid container align={'center'} spacing={5}>

                                <Grid item xs={12}>
                                    <Typography gutterbottom sx={{ fontSize: '30px', fontWeight: 'bold' }}>
                                        Email: {thisUser.Email}    
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Name'
                                        variant='outlined'
                                        value={thisUser.Name}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('Name')}
                                        sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Contact number'
                                        variant='outlined'
                                        value={thisUser.ContactNo}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('ContactNo')}
                                        sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Age'
                                        variant='outlined'
                                        value={thisUser.Age}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('Age')}
                                        sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                    />
                                </Grid>
                                {buttonText === 'Edit' && (
                                    <><Grid item xs={12}>
                                        <TextField
                                            InputProps={{readOnly: true}}
                                            label='Batch'
                                            defaultValue={thisUser.BatchName}
                                            sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                        />
                                    </Grid></>)
                                }
                                {buttonText === 'Submit' && (
                                    <><Grid item xs={12}>
                                        <TextField
                                            select
                                            label='Batch'
                                            value={thisUser.BatchName}
                                            onChange={handleChange('BatchName')}
                                            >
                                            <MenuItem value={'UG1'}>UG1</MenuItem>
                                            <MenuItem value={'UG2'}>UG2</MenuItem>
                                            <MenuItem value={'UG3'}>UG3</MenuItem>
                                            <MenuItem value={'UG4'}>UG4</MenuItem>
                                            <MenuItem value={'PG1'}>PG1</MenuItem>
                                            <MenuItem value={'PG2'}>PG2</MenuItem>
                                        </TextField>
                                    </Grid></>)
                                }
                                <Grid item xs={12} align={'center'}>
                                    <Button variant='contained' onClick={onSubmit} sx={{ width: '120px', height: '50px', fontSize: '20px' }} style={{background:"black"}}>
                                        {buttonText}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        {buttonText === 'Submit' ?
                        <Grid align={'center'} sx={{mt:3}}>
                        <Grid item xs={6}>
                            <Grid container align={'center'} spacing={2}>
                            <Grid item xs={12}>
                            <Grid container align={'center'} spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Current password</InputLabel>
                                        <OutlinedInput 
                                            label="Current password"
                                            type={'password'}
                                            value={currPass}
                                            onChange={onChangeCurrPass}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">New password</InputLabel>
                                        <OutlinedInput 
                                            label="Enter new password"
                                            type={'password'}
                                            value={newPass}
                                            onChange={onChangeNewPass}
                                            endAdornment={
                                                <InputAdornment>
                                                     {passwordError && (
                                                        <Box ml={3}>
                                                            <Tooltip title="Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1 special character and length should be minimum 8" style={{color:"red"}}>
                                                                <Alert severity="error" sx={{ border: 0, padding:0, margin: -1 }}/>
                                                            </Tooltip>
                                                        </Box>
                                                        )}
                                                </InputAdornment>
                                            }
                                        />
                                        {passwordError && (
                                        <FormHelperText style={{color : "red"}}>
                                            {passwordError}
                                        </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Confirm new password</InputLabel>
                                        <OutlinedInput 
                                            label="Confirm new password"
                                            type={'password'}
                                            value={confirmNewPass}
                                            onChange={onChangeConfirmNewPass}
                                        />
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} align={'center'}>
                                    <Button variant='contained' onClick={onChangePasswordButton}  style={{background:"black"}}>
                                        Change Password
                                    </Button>
                                </Grid>
                            </Grid></Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                        : null}
                    </Grid>
                </Paper>

                </Grid>
                </Grid>
            </Container>
            </Box>
        </Box>
    </div>);
};

export default VendorProfile;
