import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { constants } from '../../Helpers/constantsFile';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setActiveUser, setBusiness } from '../../SignupAndLogin/loginSlice';

const UpdateSmsAndNumber = ({ open, handleClose, user }) => {
    const business = useSelector((state) => state.login.business);
    const [phone, setPhone] = useState(business?.businessNumber);
    const [smsText, setSmsText] = useState(business?.smsMessage);
    const [disabled, setDisabled] = useState(false);
    const token = useSelector(state => state.login.token);

    const dispatch = useDispatch()

    const handleUpdate = () => {
        setDisabled(true);
        axios.patch(`${constants.baseUrl}/users/update-business/${user?._id}`, {
            smsMessage: smsText || business?.smsMessage,
            businessNumber: phone || business?.businessNumber
        }, {
            headers: {
                authorization: token
            }
        }).then((res) => {
            setDisabled(false);
            dispatch(setBusiness(res?.data?.data?.updatedBusiness))
            alert("Successfully updated business");
            handleClose();
        }).catch((err) => {
            alert(err?.response?.data?.message);
            setDisabled(false);
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="update-sms-modal"
            aria-describedby="update-phone-sms"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '52%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: '20px',
                }}
            >
                <Typography style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
                    Update SMS and Phone Number
                </Typography>
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="SMS Text"
                    variant="outlined"
                    style = {{marginTop: "5px"}}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value.length <= 100 ? e.target.value : smsText)}
                    multiline
                    rows={4}
                    fullWidth
                    helperText={`${smsText?.length}/100`} // Shows character count
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                    }}
                >
                    <Button
                        disabled={disabled}
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        style={{ background: disabled ? "grey" : constants.pColor, color: "white" }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        style={{ color: constants.pColor}}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UpdateSmsAndNumber;
