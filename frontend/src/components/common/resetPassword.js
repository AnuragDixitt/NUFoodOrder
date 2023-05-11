import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import swal from 'sweetalert';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import  {FormHelperText}  from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';



const ResetPassword = (props) => {
    // const EmailContext = createContext();

    const [Otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [Confirm, setConfirm] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [status, setStatus] = useState(false);
    const [Email, setEmail] = useState('');
    const [temp, setTemp] = useState('');
    const [emailError, setEmailError] = useState('');

    // =======================================================
    const [Password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);

    const onChangeConfirmPass = (event) => {
        setConfirmPass(event.target.value);
    };
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfPass = () => {
        setShowConfPass(!showConfPass);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // =======================================================
    const onChangeOtp = (event) => {
		setOtp(event.target.value);
	};

    const onChangePassword = (event) => {
		setPassword(event.target.value);
	};

    const resetInputsLater = () => {
		setOtp('');
        setPassword('');
        setConfirm('')
    };

    
    const onChangeEmail = (event) => {
		setEmail(event.target.value);
        setTemp(event.target.value)
	};


    const resetInputs = () => {
		setEmail('');
    };

    const navigate = useNavigate();

    
    

    const onSubmit = (event) => {
        event.preventDefault();

        if (Email === '') {
            setEmailError('Email is required');
            resetInputs(); return;
        }
        else if(!String(Email).toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ))
        {
            setEmailError('Invalid Email Id');
            return;
        }        
        else{
            setEmailError('');
        }
        
    
        const thisUserForget = {
            Email: Email,
            
        };

        

        axios                               
            .post('http://localhost:4000/user/email-send', thisUserForget)
            .then((response) => {
                const res = response.data;
                if(res.status === 0){
                    swal({title:'Email not registered', text:'Please register first', type:'error'}).then(
                    function(){
                        navigate('/register')
                    });
                    
                    
                }
                else if (res.status === 2) {
                    swal({title:'Mail Service down', text:'Retry Later', type:'error'}).then(
                    function(){
                        navigate('/login')
                    });
                    
                }
                else if(res.status === 1){
                    swal({title:'Email Sent!', text:'Please check your email', type:'success'}).then(
                    function(){
                        setStatus(true);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })


        resetInputs();
    }

    const onSubmitReset = (event) => {
        event.preventDefault();
        let regularExpression = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/

        
        if (Otp === '') {
            setOtpError('OTP is required');
            resetInputsLater(); 
            return;
        }
        else if(Otp.length != 4)
        {
            setOtpError('Enter OTP of 4 digits');
            return;
        }
        else if (Password === '') {
            setOtpError('');
            setPasswordError('Password is required');
            return;
        }
        else if(!String(Password).match(regularExpression)){
            setPasswordError('Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1 special character and length should be minimum 8');
            return;
        }
        else if(confirmPass === ''){
            setPasswordError('');
            setConfirmError('Confirm Password is required');
            return;
        }
        else if(Password !== confirmPass){

            setConfirmError('Password does not match');
            return;
        }
                
        else{
            setOtpError('');
            setPasswordError('');
            setConfirmError('')
        }

        const thisUser = {
            Email: temp,
            OTP: Otp,
            Password: Password,
            ConfirmPassword: Confirm
            
        };

        axios                               
            .post('http://localhost:4000/user/reset-password', thisUser)
            .then((response) => {
                
                const res = response.data;
                if(res.status === 3){
                    swal({title:'Invalid OTP', text:'Enter correct OTP', type:'warning'}).then(
                    function(){
                        resetInputsLater()
                    });
                    
                    
                }
                else if (res.status === 0) {
                    console.log('Router error');
                    swal({title:'OTP Expired', text:'Please try again', type:'warning'}).then(
                    function(){
                        navigate('/login')
                    });
                    
                }
                else if(res.status === 1){
                    swal({title:'Password Changed Successfully', text:'Please login with new password', type:'success'}).then(
                    function(){
                        navigate('/login')
                    });
                    
                    
                }
                else if(res.status === 2){
                    swal({title:'Something went wrong', text:'Please try again', type:'error'}).then(
                        function(){
                            navigate('/reset-password')
                        })
                }
            })
            .catch((err) => {
                console.log(err);
            })

        resetInputs();
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="main"
                sx={{
                    
                    backgroundColor:'lightblue',     
                    flexGrow: 1,
                    height: '93.9vh',
                    overflow: 'auto',
                }}
            >
            <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
                <div align="center">
                <Paper
                        sx={{
                            p: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 350,
                            width:400,
                            borderRadius:"20px 20px 20px 20px",
                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        }}
                    >
            
            <Grid container align={'center'} spacing={2} >
                
                {!status &&
                <>
                <Grid item xs={12} sx={{ marginTop: '8rem' }}>
                    <TextField
                        label='Email'
                        variant='outlined'
                        value={Email}
                        FormHelperTextProps={{
                            style: { color: 'red' }
                        }}
                        onChange={onChangeEmail}
                        helperText={emailError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant='contained' onClick={onSubmit} >
                        Send OTP
                    </Button>
                    
                </Grid>
                </>}
                
                {status &&
                <>
                    <Grid item xs={12}>
                    <TextField
                        label='OTP'
                        variant='outlined'
                        value={Otp}
                        FormHelperTextProps={{
                            style: { color: 'red' }
                        }}
                        onChange={onChangeOtp}
                        helperText={otpError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={Password}
                            onChange={onChangePassword}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Password"
                        />
                        <FormHelperText style={{color : "red"}}>
                                {passwordError}
                        </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Confirm password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showConfPass ? 'text' : 'password'}
                            value={confirmPass}
                            onChange={onChangeConfirmPass}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfPass}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showConfPass ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Password"
                        />
                        <FormHelperText style={{color : "red"}}>
                                {confirmError}
                        </FormHelperText>
                        </FormControl>
                        
                    </Grid>
                <Grid item xs={12}>
                    <Button variant='contained' onClick={onSubmitReset} >
                        Change Password
                    </Button>
                    
                </Grid> 
                
                </>}
                
            
        </Grid>
        </Paper>
        </div>
        </Container>
        </Box>
        </Box>
        
    );
};

export default ResetPassword;