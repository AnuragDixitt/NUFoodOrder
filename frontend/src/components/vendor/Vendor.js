// import axios from "axios";
import axios from '../extra/api'
import { useState, useEffect, useRef } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import swal from 'sweetalert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import getCookie from "../extra/getCookie";

const VendorProfile = (props) => {
    const curr = JSON.parse(localStorage.getItem('user'));
    const [thisUser, setThisUser] = useState({ 
        _id: curr._id,
        Name: curr.Name,
        Email: curr.Email,
        userStatus: curr.userStatus,
        ContactNo: curr.ContactNo,
        ShopName: curr.ShopName,
        OpeningTime: new Date(curr.OpeningTime), 
        ClosingTime: new Date(curr.ClosingTime)
    });
    
    

    useEffect( () => {
        (async function() {
            const token = getCookie('jwt')
            await axios.get('http://localhost:4000/user/protected',{headers: {'Authorization': `Bearer ${token}`}})
        })()
    }, [])
    

    const [buttonText, setButtonText] = useState('Edit');
    const [currPass, setCurrPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');

    const handleChange = (prop) => (event) => {
        setThisUser({ ...thisUser, [prop]: event.target.value });
    };
    
    const onChangeCurrPass = (event) => {
        setCurrPass(event.target.value);
    }

    const onChangeNewPass = (event) => {
        setNewPass(event.target.value);
    }

    const onChangeConfirmNewPass = (event) => {
        setConfirmNewPass(event.target.value);
    }
    const [expand, setExpand] = useState(true);

    const [height, setHeight] = useState(450);

    const onSubmit = (props) => {
        var elements = document.getElementsByClassName("MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input");
        if (buttonText === 'Edit') {
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=false;}
            setButtonText('Submit');
            if (expand === true){
                setHeight(height+300);
                setExpand(false);
            }
        } else {
            axios
                .post('http://localhost:4000/user/edit', {user: thisUser, changePassword: false})
                .then((res)=>{
                    axios
                        .post('http://localhost:4000/food/edit-item', {
                            vendorEdited: true,
                            VendorID: thisUser._id,
                            COT: thisUser.OpeningTime,
                            CCT: thisUser.ClosingTime,
                            VendorName: thisUser.Name, 
                            ShopName: thisUser.ShopName  
                        }).then(() => {
                            swal('Edited successfully', 'Your details have been updated.', 'success');
                        });
                })
                .catch((err)=>console.log(err.response.data));
            for (var i = 0; i < elements.length; i++) { elements[i].readOnly=true; }
            localStorage.setItem('user', JSON.stringify(thisUser));
            setButtonText('Edit');
            setHeight(height-300);
            setExpand(true);
        }
    };

    const onChangePasswordButton = () => {
        if (newPass === confirmNewPass) {
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
                    console.log(err.response.data);
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
                
                backgroundColor:'lightBlue',    
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
                        flexDirection: 'column',
                        height: height,
                        width:600,
                        borderRadius:"20px 20px 20px 20px",
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    }}
                >
                    <Grid container align={'center'}>
                        <Grid item xs={buttonText === 'Edit' ? 24 : 12}>
                            <Grid container align={'center'} spacing={2}>
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
                                        label='Shop Name'
                                        variant='outlined'
                                        value={thisUser.ShopName}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('ContactNo')}
                                        sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                    />
                                </Grid>

                                {buttonText === 'Edit' && (
                                    <><Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                readOnly
                                                label='Opening time'
                                                value={thisUser.OpeningTime}
                                                renderInput={(params) => <TextField {...params} />}
                                                sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                readOnly
                                                label='Closing time'
                                                value={thisUser.ClosingTime}
                                                renderInput={(params) => <TextField {...params} />}
                                                sx={{ width: '60%', height: '50px', fontSize: '30px'}}
                                            />
                                        </LocalizationProvider>
                                    </Grid></>)
                                }
                                {buttonText === 'Submit' && (
                                    <><Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                label='Opening time'
                                                value={thisUser.OpeningTime}
                                                onChange={(newTime) => {setThisUser({...thisUser, ['OpeningTime'] : new Date(newTime)}); console.log(thisUser.OpeningTime)}}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                label='Closing time'
                                                value={thisUser.ClosingTime}
                                                onChange={(newTime) => setThisUser({...thisUser, ['ClosingTime'] : new Date(newTime)})}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid></>)
                                }
                                <Grid item xs={12} align={'center'}>
                                    <Button variant='contained' onClick={onSubmit}  style={{backgroundColor:"black"}}>
                                        {buttonText === 'Edit' ? 'Edit' : 'Save Edited Changes'}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        {buttonText === 'Submit' ?
                        <Grid align={'center'} sx={{mt:3}}>
                        <Grid item xs={6}>
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
                                        />
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
                                    <Button variant='contained' onClick={onChangePasswordButton} style={{backgroundColor:"black"}}>
                                        Change Password
                                    </Button>
                                </Grid>
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
