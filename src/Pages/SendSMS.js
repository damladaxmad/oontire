import { Button, CircularProgress, TextField, TextareaAutosize, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { constants } from "../Helpers/constantsFile";
import axios from "axios";
import SmsSuccess from "../containers/sms/SmsSuccess";
import Loading from "../containers/sms/Loading";
import CustomButton from "../reusables/CustomButton";
import Select from "react-select"

const SendSMS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const token = useSelector((state) => state.login?.token);
  const activeUser = useSelector((state) => state.login?.activeUser);
  const customers = useSelector((state) => state.customers.customers);
  const [smsType, setSmsType] = useState("all")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successData, setSuccessData] = useState()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("") 
  const [message, setMessage] = useState("") 
  const [customCheck, setCustomCheck] = useState(true)
  const [text, setText] = useState('');
  const maxLength = 110;

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxLength) {
      setText(inputText);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  
  const saleTypeOptions = [
    { value: 'all', label: 'All' },
    { value: 'unpaid', label: 'Unpaid' }
  ];

  const handleSelectCustomer = (customerId) => {
    const updatedSelectedCustomers = [...selectedCustomers];
    const index = updatedSelectedCustomers.indexOf(customerId);

    if (index > -1) {
      updatedSelectedCustomers.splice(index, 1);
    } else {
      updatedSelectedCustomers.push(customerId);
    }

    setSelectedCustomers(updatedSelectedCustomers);
  };

  const handleSelectAllCustomers = () => {
    const allCustomerIds = customers.map((customer) => customer._id);
    setSelectedCustomers(
      selectedCustomers.length === allCustomerIds.length ? [] : allCustomerIds
    );
  };

  const handleCustomCheck = () => {
    setCustomCheck(state => !state)
  }

  const handleSendSMS = () => {
    setLoading(true)
    const customersToSendSMS = customers.filter((customer) =>
      selectedCustomers.includes(customer._id)
    );

    const updatedCustomers = customersToSendSMS.map((customer) => ({
      ...customer,
      customerType: 'deynle',
    }));

    axios
      .post(
        `${constants.baseUrl}/sms/send-custom-business-sms`,
        {
          "businessId": activeUser?.business?._id,
          "customers": updatedCustomers,
          "message": message
          },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        setSuccessData(res.data?.data)
        setLoading(false)
        setSelectedCustomers([])
        setShowSuccess(true)
      })
      .catch((err) => {
        setLoading(false)
        alert(err?.response?.data?.message);
        setSelectedCustomers([])
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "92%",
        margin: "20px auto",
      }}
    >
    {loading && <Loading /> }

      {showSuccess && <SmsSuccess successData = {successData} hideModal = {()=> {
        setShowSuccess(false)
      }}/>}
      <div
        style={{
          background: "white",
          padding: "20px",
          width: "100%",
          borderRadius: "10px 10px 0px 0px",
          alignItems: "center",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "50px",
        }}
      >

{/* <Select
        value={saleTypeOptions.find(option => option.value === smsType)}
        options={saleTypeOptions}
        onChange={(selectedOption) => setSmsType(selectedOption.value)}
        styles={{
          control: (styles, { isDisabled }) => ({
            ...styles,
            border: "1px solid grey",
            height: "40px",
            borderRadius: "5px",
            width: "140px",
            minHeight: "28px",
            ...(isDisabled && { cursor: "not-allowed" }),
          })
        }}
      /> */}
        <input
          type="text"
          placeholder="Search customers"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "330px",
            height: "45px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            background: "#EFF0F6",
            border: "none",
          }}
        />

        <label>
          <input
            type="checkbox"
            onChange={handleSelectAllCustomers}
            checked={selectedCustomers.length === customers.length}
            id="smsCheck"
            style={{
              transform: "scale(1.5)",
              cursor: "pointer",
              marginRight: "15px",
            }}
          />
          Select All{" "}
          {selectedCustomers.length > 0 && `(${selectedCustomers.length})`}
        </label>

        <label>
          <input
            type="checkbox"
            onChange={handleCustomCheck}
            checked={customCheck}
            id="customCheck"
            style={{
              transform: "scale(1.5)",
              cursor: "pointer",
              marginRight: "15px",
            }}
          />
          Custom
        </label>



        <CustomButton
          onClick={handleSendSMS}
          text = "Send Sms"
        />
      </div>

     {customCheck && <TextField
        label={`${text.length}/${maxLength}`}
        variant="outlined"
        multiline
        value={text}
        onChange={handleChange}
        style = {{fontSize: "16px", marginTop: "20px"}}
        inputProps={{ maxLength: maxLength }}
      />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {customers
          .filter(
            (customer) =>
              customer.name.toLowerCase().includes(searchTerm) ||
              customer.phone.toLowerCase().includes(searchTerm) ||
              customer.balance.toString().includes(searchTerm)
          )
          .map((customer) => (
            <div
              key={customer._id}
              style={{
                backgroundColor: selectedCustomers.includes(customer?._id)
                  ? "#C8DAFD"
                  : null,
                border: "1px solid grey",
                display: "flex",
                cursor: "pointer",
                flexDirection: "row",
                gap: "30px",
                padding: "15px 25px",
                borderRadius: "10px",
              }}
              onClick={() => handleSelectCustomer(customer._id)}
            >
              <input
                type="checkbox"
                checked={selectedCustomers.includes(customer._id)}
                onChange={() => handleSelectCustomer(customer._id)}
                id="smsCheck"
                style={{ transform: "scale(1.5)", cursor: "pointer", color: constants.pColor }}
              />
              <Typography style={{ fontSize: "16px", flex: 1 }}>
                {customer.name}
              </Typography>
              <Typography style={{ fontSize: "16px", flex: 1 }}>
                {customer.phone}
              </Typography>
              <Typography
                style={{ fontSize: "16px", flex: 1, marginLeft: "auto" }}
              >
                {/* ${customer.balance?.toFixed(2)} */}
                {customer.balance >= 0 ? `$${customer.balance.toFixed(2)}` : `-$${Math.abs(customer.balance).toFixed(2)}`}
              </Typography>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SendSMS;
