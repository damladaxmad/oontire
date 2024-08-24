import Modal from "../../Modal/Modal";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import axios from "axios";
import { constants } from "../../Helpers/constantsFile";
import CustomButton from "../../reusables/CustomButton";
import { Typography } from "@material-ui/core";

const ChangeSMS = ({ user, logoutHandler, hideModal }) => {

    const [disabled, setDisabled] = useState(false)
    const { business } = useSelector((state) => state.login.activeUser);
    const token = useSelector(state => state.login.token)

    const changeSms = () => {
        axios.patch(`${constants.baseUrl}/businesses/${business._id}`, {
            smsMessage: "this is the new message"
        }, {
            headers: {
                authorization: token
            }
        }).then((res) => {
            setDisabled(false)
            alert("Waa la badalay Fariinta")
            logoutHandler()
            hideModal();
        }).catch((err) => {
            alert(err?.response?.data?.message);
            setDisabled(false)
        });
    }

    return (
        <Modal onClose={() => hideModal()} pwidth="450px" top="26%">
            <div
                style={{
                    display: "flex",
                    width: "410px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "15px",
                    padding: "10px"
                }}
            >
                <Typography style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "10px"
                }}>BEDEL FARIINTA </Typography>


                <CustomButton
                        onClick={changeSms}
                        disabled={disabled}
                        width="310px"
                        height="45px"
                        fontSize="16px"
                        bgColor={constants.pColor}
                        text="Bedel fariinta"
                    />

            </div>
        </Modal>
    );
};

export default ChangeSMS;
