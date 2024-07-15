import { Button, CircularProgress, TextField, TextareaAutosize, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { constants } from "../Helpers/constantsFile";
import axios from "axios";
import SmsSuccess from "../containers/sms/SmsSuccess";
import Loading from "../containers/sms/Loading";
import CustomButton from "../reusables/CustomButton";
import Select from "react-select";
import { setZoneDataFetched, setZones } from "../containers/zone/zoneSlice";
import useReadData from "../hooks/useReadData";
import { setCustomerDataFetched, setCustomers } from "../containers/customer/customerSlice";

const SendSMS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const { business } = useSelector((state) => state.login.activeUser);
  const token = useSelector((state) => state.login?.token);
  const activeUser = useSelector((state) => state.login?.activeUser);
  const [showSuccess, setShowSuccess] = useState(false)
  const [successData, setSuccessData] = useState()
  const [loading, setLoading] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null);
  const [customCheck, setCustomCheck] = useState(true)
  const [text, setText] = useState('');
  const maxLength = 110;
  const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`;
  const zones = useSelector((state) => state.zones.zones);
  const customers = useSelector((state) => state.customers.customers);
  const customerUrl = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;

  useReadData(
    customerUrl,
    setCustomers,
    setCustomerDataFetched,
    (state) => state.customers.isCustomersDataFetched,
    "customers"
  );

  useReadData(
    zoneUrl,
    setZones,
    setZoneDataFetched,
    (state) => state.zones.isZoneDataFetched,
    "zones"
  );

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxLength) {
      setText(inputText);
    }
  };


  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
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

  let filteredCustomers = []
  customers?.map(customer => {
    console.log(customer)
    if (customer?.balance <= 0) return
    if (selectedZone && customer?.zone?._id != selectedZone?.value) return 
    filteredCustomers.push(customer)
  })

  const handleSelectAllCustomers = () => {
    const allCustomerIds = filteredCustomers?.map((customer) => customer._id);
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
          "message": customCheck && text
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
        }}
      >

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

<Select
        placeholder="Select Zone"
        options={zones?.map((zone) => ({
          value: zone._id,
          label: zone.zoneName,
        }))}
        onChange={(selectedOption) => setSelectedZone(selectedOption)} 
        isClearable={true}
        isSearchable={true}
        style={{ width: "30%" }}
      />

        <label>
          <input
            type="checkbox"
            onChange={handleSelectAllCustomers}
            checked={selectedCustomers.length === filteredCustomers?.length}
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
        {filteredCustomers
          .filter(
            (customer) =>
              customer.name.toLowerCase().includes(searchTerm) ||
              customer.phone.toLowerCase().includes(searchTerm) 
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
                borderRadius: "5px",
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
              <Typography style={{ fontSize: "16px", flex: 1.5 }}>
                {customer.name}
              </Typography>
              <Typography style={{ fontSize: "16px", flex: 0.8 }}>
                {customer.phone}
              </Typography>
              <Typography style={{ fontSize: "16px", flex: 0.5 }}>
                {customer.zone?.zoneName}
              </Typography>
              <Typography
                style={{ fontSize: "16px", flex: 0.5, marginLeft: "auto" }}
              >
                {customer.balance >= 0 ? `$${customer.balance.toFixed(2)}` : `-$${Math.abs(customer.balance).toFixed(2)}`}
              </Typography>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SendSMS;
