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
    // const [addMoney, setAddMoney] = useState(0);

    useEffect( () => {
        (async function() {
            const token = getCookie('jwt')
            console.log("trying refresh")
            await axios.get('http://localhost:4000/user/protected',{headers: {'Authorization': `Bearer ${token}`}})
        })()
    }, [])

    // const onChangeMoney = (e) => {
    //     setAddMoney(e.target.value);
    //     let tmp = curr; tmp.Wallet = tmp.Wallet + addMoney;
    // }

    // const onAddMoney = (e) => {
    //     if (addMoney < 0) {
    //         swal({text: 'Please enter a valid amount to add money', icon: 'warning'})
    //         .then((resp) => {if (resp) {setAddMoney(0); return;}});
    //     }
    //     // e.preventDefault();
    //     if (addMoney === 0) {return;}
    //     axios
    //         .post('http://localhost:4000/user/edit', {
    //             updateWallet: true, 
    //             _id: curr._id, 
    //             increment: Number(addMoney)
    //         }).then((resp) => {
    //             console.log(resp);
    //             let tmp = curr; tmp.Wallet = Number(tmp.Wallet) + Number(addMoney);
    //             localStorage.setItem('user', JSON.stringify(tmp));
    //             window.location.reload();
    //         }).catch((err) => {console.log(err);});
    // }

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
        setNewPass(event.target.value);
    }

    const onChangeConfirmNewPass = (event) => {
        setConfirmNewPass(event.target.value);
    }

    const onSubmit = (props) => {
        var elements = document.getElementsByClassName("MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input");
        if (buttonText === 'Edit') {
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=false;}
            setButtonText('Submit');
        } else {
            console.log("User: ", curr);
            console.log("thisUser: ", thisUser);
            axios
                .post('http://localhost:4000/user/edit', {user: thisUser, changePassword: false})
                .then((res)=>{
                    console.log("Edited: ", res.data);
                    swal('Edited successfully', 'Your details have been updated.', 'success');
                })
                .catch((err)=>console.log(err.response.data));
            for (var i = 0; i < elements.length; i++) { elements[i].readOnly=true; }
            localStorage.setItem('user', JSON.stringify(thisUser));
            setButtonText('Edit');
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
                    console.log("Password changed!")
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
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                backgroundColor:'lightBlue',    
                //backgroundImage: 'url(https://media.licdn.com/dms/image/C4E16AQG3mVEcQH0oBw/profile-displaybackgroundimage-shrink_350_1400/0/1538140195496?e=1687996800&v=beta&t=cza0kwZWYjlIHsRT39L8QWsD9ajqo76RdoRXFAdxHfU)', // replace with your image URL
                //backgroundPosition: 'center',
                //backgroundRepeat: 'no-repeat',
                //backgroundSize: 'cover',
                //boxShadow: '50 50 10px rgba(0.5, 0.5, 0.5, 0.2)', // add shadow    
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
                        height: 500,
                        width:600,
                        borderRadius:"20px 20px 20px 20px",
                        boxShadow: '10px 10px 10px 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Grid container align={'center'}>
                        <Grid item xs={buttonText === 'Edit' ? 12 : 6}>
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
                                            <MenuItem value={'PG1'}>PG1</MenuItem>
                                            <MenuItem value={'PG2'}>PG2</MenuItem>
                                        </TextField>
                                    </Grid></>)
                                }
                                <Grid item xs={12} align={'center'}>
                                    <Button variant='contained' onClick={onSubmit}>
                                        {buttonText}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        {buttonText === 'Submit' ?
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
                                    <Button variant='contained' onClick={onChangePasswordButton}>
                                        Change Password
                                    </Button>
                                </Grid>
                            </Grid></Grid>
                            {/* <Grid item xs={12}>
                            <Grid container align={'center'} spacing={2}>
                                <Grid item xs={12}>
                                    <TextField 
                                        variant='outlined'
                                        value={addMoney}
                                        onChange={onChangeMoney}
                                    />                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' onClick={onAddMoney}>
                                        Add money
                                    </Button>
                                </Grid>
                            </Grid></Grid> */}
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
