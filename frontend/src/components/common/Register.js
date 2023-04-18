import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import MenuItem from '@mui/material/MenuItem';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Register = (props) => {
	const [Name, setName] = useState('');
	const [Email, setEmail] = useState('');
	const [date, setDate] = useState(null);
    const [Money, setMoney] = useState(0);
	const [Password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
	const [ContactNo, setContactNo] = useState(null);

    const [Status, setStatus] = useState('');

	const [Age, setAge] = useState(null);
	const [BatchName, setBatchName] = useState('');

	const [ShopName, setShopName] = useState('');
	const [OpeningTime, setOpeningTime] = useState(new Date());
	const [ClosingTime, setClosingTime] = useState(new Date());

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);

    const onChangeMoney = (e) => {
        setMoney(e.target.value);
    };

    const handleClickShowConfPass = () => {
        setShowConfPass(!showConfPass);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

	const onChangeUsername = (event) => {
		setName(event.target.value);
	};

	const onChangeEmail = (event) => {
		setEmail(event.target.value);
	};

    const onChangeDate = (event) => {
        setDate(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const onChangeConfirmPass = (event) => {
        setConfirmPass(event.target.value);
    };

    const onChangeContactNo = (event) => {
        setContactNo(event.target.value);
    };

    const onChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const onChangeAge = (event) => {
        setAge(event.target.value);
    };

    const onChangeBatchName = (event) => {
        setBatchName(event.target.value);
    };

    const onChangeShopName = (event) => {
        setShopName(event.target.value);
    };

    const navigate = useNavigate();


	const resetInputs = () => {
		setName('');
		setEmail('');
		setDate(null);
        setPassword('');
        setConfirmPass('');
        setContactNo(null);
        setStatus('');
        setAge(null);
        setBatchName('');
        setShopName('');
        setOpeningTime(null);
        setClosingTime(null);
        setMoney(null);
	};

	const onSubmit = (event) => {
		event.preventDefault();
        console.log(OpeningTime);
        if (Password === confirmPass) {
            const bad = Boolean(ContactNo === null || ContactNo === 0 || Number(ContactNo) === NaN);
            if (Name === '' || Email === '' || Password === '' || bad || Status === '') {
                swal("Oops!", "Please fill all the fields!", "error");
                return;
            }
                
            if (Status === 'Vendor') {
                if (ShopName === '' || OpeningTime === null || ClosingTime === null) {
                    swal("Oops!", "Please fill all the fields!", "error");
                    return;
                }

                const newUser = {
                    Name: Name,
                    Email: Email,
                    date: new Date(),
                    Password: Password,
                    ContactNo: ContactNo,
                    userStatus: Status,
                    ShopName: ShopName,
                    OpeningTime: OpeningTime,
                    ClosingTime: ClosingTime
                };
                console.log(newUser);
                axios
                    .post('http://localhost:4000/user/register', newUser)
                    .then((response) => {
                        console.log(response.data);
                        swal('Account registered', response.data.Name + ', please enter your credentials to login.', 'success');
                        navigate('/login');
                    })
                    .catch((err) => console.log(err));
            
            } else {

                if (Age === null || BatchName === '' || Money === null) {
                    swal("Oops!", "Please fill all the fields!", "error");
                    return;
                }
                const newUser = {
                    Name: Name,
                    Email: Email,
                    date: new Date(),
                    Password: Password,
                    ContactNo: ContactNo,
                    userStatus: Status,
                    Age: Age,
                    BatchName: BatchName,
                    Wallet: Money
                };
                console.log(newUser);
                axios
                    .post('http://localhost:4000/user/register', newUser)
                    .then((response) => {
                        console.log(response.data);
                        swal('Account registered', response.data.Name + ', please enter your credentials to login.', 'success');
                        navigate('/login');
                    })
                    .catch((err) => console.log(err));

            }
            resetInputs();
        } else {
            swal('Invalid', 'Please confirm your password correctly.', 'warning');
        } 
	};

	return (
        <>
            <Grid container align={'center'} spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label='Name'
                        variant='outlined'
                        value={Name}
                        onChange={onChangeUsername}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Email'
                        variant='outlined'
                        value={Email}
                        onChange={onChangeEmail}
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
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Contact Number'
                        variant='outlined'
                        value={ContactNo}
                        onChange={onChangeContactNo}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        label='Vendor or Buyer?'
                        value={Status}
                        onChange={onChangeStatus}
                        helperText='Please select your status'
                        >
                        <MenuItem value={'Vendor'}>Vendor</MenuItem>
                        <MenuItem value={'Buyer'}>Buyer</MenuItem>
                    </TextField>
                </Grid>
                </Grid>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete='off'
                    >
                    <div align={'center'}>
                {Status === 'Vendor' && 
                <>
                    <Grid item xs={12}>
                        <TextField
                            label='Shop name'
                            variant='outlined'
                            value={ShopName}
                            onChange={onChangeShopName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker 
                                label='Opening time'
                                value={OpeningTime}
                                onChange={(newTime) => {
                                    setOpeningTime(newTime);
                                  }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker 
                                label='Closing time'
                                value={ClosingTime}
                                onChange={(newTime) => {
                                    setClosingTime(newTime);
                                    console.log(OpeningTime);
                                  }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </>
                }
                {Status === 'Buyer' && 
                    <>
                    <Grid item xs={12}>
                        <TextField
                            label='Add money  '
                            variant='outlined'
                            value={Money}
                            onChange={onChangeMoney}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Age'
                            variant='outlined'
                            value={Age}
                            onChange={onChangeAge}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label='Batch'
                            value={BatchName}
                            onChange={onChangeBatchName}
                            helperText='Please select your batch'
                            >
                            <MenuItem value={'UG1'}>UG1</MenuItem>
                            <MenuItem value={'UG2'}>UG2</MenuItem>
                            <MenuItem value={'UG3'}>UG3</MenuItem>
                            <MenuItem value={'UG4'}>UG4</MenuItem>
                            <MenuItem value={'PG1'}>PG1</MenuItem>
                            <MenuItem value={'PG2'}>PG2</MenuItem>
                        </TextField>
                    </Grid>
                    </>
                }
                    </div>
                </Box>
                <Grid item xs={12} align={'center'}>
                    <Button variant='contained' onClick={onSubmit}>
                        Register
                    </Button>
                </Grid>
        </>
	);
};

export default Register;
