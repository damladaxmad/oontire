import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { constants } from "../Helpers/constantsFile";
import { Typography } from "@material-ui/core";
import moment from "moment";
import CustomButton from "../reusables/CustomButton";
import { addTransaction } from "../containers/transaction/transactionSlice";
import { setCustomerDataFetched, setCustomers, updateCustomerAqrisHore, updateCustomerSocketBalance } from "../containers/customer/customerSlice";
import { handleAddCustomerBalance } from "../containers/customer/customerUtils";
import Select from 'react-select'; // Import react-select
import useReadData from "../hooks/useReadData";

const TransactionForm = () => {
    const [disabled, setDisabled] = useState(false);
    const token = useSelector(state => state.login.token);
    const mySocketId = useSelector(state => state?.login?.mySocketId);
    const activeUser = useSelector(state => state.login.activeUser);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const today = new Date();
    const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers.customers)));
    const { business } = useSelector(state => state.login.activeUser);
    const customerUrl = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;

    const dispatch = useDispatch();

    useReadData(
        customerUrl,
        setCustomers,
        setCustomerDataFetched,
        state => state.users.isCustomerDataFetched,
        "customers"
    );

    const calculateBalance = (transactions) => {
        let balance = 0;
        transactions?.forEach(transaction => {
            balance += transaction.debit - transaction.credit;
        });
        return balance;
    };

    let newCustomer;
    customers?.map(c => {
        if (c._id === selectedCustomer?.value) newCustomer = c;
    });

    useEffect(() => {
        if (selectedCustomer) {
            formik.setValues({
                ...formik.values,
                aqrisHore: newCustomer?.aqrisHore || "",
            });
        }
    }, [selectedCustomer]);

    const arr = [
        { label: "Geli A.HORE", type: "number", name: "aqrisHore" },
        { label: "Geli A.DAMBE", type: "number", name: "aqrisDanbe" },
        { label: "Total-ka", type: "number", name: "debit" },
        { label: "", type: "date", name: "date" },
    ];

    const validate = (values) => {
        const errors = {};
        if (!values.aqrisHore) {
            errors.aqrisHore = "Field is Required";
        }
        if (!values.aqrisDanbe) {
            errors.aqrisDanbe = "Field is Required";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            description: "",
            debit: "",
            aqrisHore: newCustomer?.aqrisHore,
            aqrisDanbe: "",
            credit: "",
            date: moment(today).format("YYYY-MM-DD")
        },
        validate,
        onSubmit: async (values, { resetForm }) => {
            values.credit = 0;
            values.debit = (values.aqrisDanbe - values.aqrisHore) * 1.5;
            values.description = `${values.aqrisDanbe} - ${values.aqrisHore}`;
            values.transactionType = "charge";
            values.customer = selectedCustomer?.value;
            values.user = activeUser._id;
            values.socketId = mySocketId;
            setDisabled(true);

            const res = await axios.post(`${constants.baseUrl}/transactions`, values, {
                headers: {
                    "authorization": token
                }
            }).then((res) => {
                setDisabled(false);
                let debit = res?.data?.data?.transaction?.debit;
                dispatch(updateCustomerSocketBalance({ _id: selectedCustomer?.value, transaction: debit }));
                let newAqrisHore = res?.data?.data?.transaction.aqrisDanbe;
                dispatch(updateCustomerAqrisHore({ customerId: selectedCustomer?.value, newAqrisHore }));
                resetForm(); // Reset the form
                setSelectedCustomer(null);
                let response = res?.data?.data?.transaction;
                alert("Successfully created invoice");
            }).catch((err) => {
                alert(err.response?.data?.message);
                setDisabled(false);
            });
        },
    });

    return (
        <div style={{ background: "white", display: "flex", padding: "20px", width: "50%", margin: "auto", borderRadius: "10px", alignItems: "center", justifyContent: "center" }}>
            <form
                onSubmit={formik.handleSubmit}
                style={{
                    display: "flex", gap: "12px", flexWrap: "wrap",
                    justifyContent: "center", flexDirection: "column", width: "380px",
                    padding: "16px 0px",
                    alignItems: "center"
                }}
            >
                <Typography style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px" }}>Invoices Form</Typography>
                <Select
                    placeholder="Select Customer"
                    options={customers.map(customer => ({ value: customer._id, label: `${customer.name} (${customer?.phone})` }))}
                    onChange={selectedOption => setSelectedCustomer(selectedOption)}
                    isClearable={true}
                    isSearchable={true}
                    filterOption={(option, inputValue) => {
                        const label = option.label.toLowerCase();
                        const value = option.value.toLowerCase();
                        const input = inputValue.toLowerCase();
                        return label.includes(input) || value.includes(input);
                    }}
                    styles={{
                        control: (styles, { isDisabled }) => ({
                            ...styles,
                            border: "1px solid grey",
                            height: "45px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            width: "340px",
                            minHeight: "28px",
                            ...(isDisabled && { cursor: "not-allowed" }),
                        })
                    }}
                />
                {arr.map((a, index) => (
                    <div key={index}>
                        <input
                            disabled={a.name === "debit"}
                            placeholder={a.label}
                            id={a.name}
                            name={a.name}
                            type={a.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[a.name]}
                            style={{
                                width: "340px",
                                height: "45px",
                                padding: "15px",
                                fontSize: "16px",
                                fontWeight: a.name === "debit" && "bold",
                                border: "1px solid grey",
                                borderRadius: "5px",
                            }}
                            key={index}
                        />
                        {formik.touched[a.name] && formik.errors[a.name] ? (
                            <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
                        ) : null}
                    </div>
                ))}
                <CustomButton bgColor={constants.pColor}
                    disabled={disabled}
                    text="XAREY"
                    type="submit" width="340px"
                    style={{ marginTop: "8px" }}
                />
            </form>
        </div>
    );
};

export default TransactionForm;
