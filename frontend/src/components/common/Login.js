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


const Login = (props) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onChangeEmail = (event) => {
		setEmail(event.target.value);
	};

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const resetInputs = () => {
		setEmail('');
        setPassword('');
    };

    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        if (Email === '' || Password === '') {
            swal('Error', 'Please fill all the fields', 'error');
            resetInputs(); return;
        }
        const thisUser = {
            Email: Email,
            Password: Password
        };
        console.log(thisUser);
        axios                               
            .post('http://localhost:4000/user/login', thisUser)
            .then((response) => {
                const res = response.data;
                if (res.code === -1) {
                    console.log('Router error');
                    console.log(res);
                } else if (res.code === 0) {
                    swal('Incorrect email', 'There is no user registered by this email. Please check the entered email.', 'warning'); 
                    resetInputs();
                } else if (res.code === 2) {
                    swal('Incorrect password', 'Please enter the correct password', 'error');
                    setPassword('');
                } else {
                    console.log('Successfully logged in!!');
                    console.log(res.user);
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    console.log(localStorage);
                    resetInputs();
                    if (res.type === 'Vendor') {
                        localStorage.setItem('page', '/vendor');
                        window.location='/vendor';
                    } else {
                        localStorage.setItem('page', '/buyer');
                        window.location='/buyer';
                    }
                }
            })
            .catch((err) => {
                console.log(err.response.data.errMsg);
            })

        resetInputs();
    }

    return (
        <Grid container  align={'center'}  spacing={2}>
            <Grid item xs={12}>
                <TextField
                    label='Email'
                    variant='outlined'
                    value={Email}
                    onChange={onChangeEmail}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined">
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
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button variant='contained' onClick={onSubmit}>
                    Login
                </Button>
            </Grid>
        </Grid>
        
    );
};

export default Login;