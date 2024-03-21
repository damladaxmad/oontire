import React, { useState, useEffect } from 'react';
import CustomButton from '../reusables/CustomButton';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'; // Import react-select
import { Checkbox } from '@material-ui/core';
import { setCustomerDataFetched, setCustomers, updateCustomer } from '../containers/customer/customerSlice';
import useReadData from '../hooks/useReadData';
import { addArea, setAreaDataFetched, setAreas } from '../containers/area/areaSlice';
import { addZone, setZoneDataFetched, setZones } from '../containers/zone/zoneSlice';
import AreaAndZone from '../utils/AreaAndZone';

export default function CustomerList() {
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null); // Track selected area
    const [selectedZone, setSelectedZone] = useState(null); // Track selected zone
    const [disabled, setDisabled] = useState(false);
    const [showAreaAndZone, setShowAreaAndZone] = useState(false)
    const [showZone, setShowZone] = useState(false)
    const { business } = useSelector(state => state.login.activeUser);
    const token = useSelector(state => state.login.token);
    const customers = useSelector(state => state.customers.customers);
    const areas = useSelector(state => state.areas.areas); // Fetch areas from Redux store
    const zones = useSelector(state => state.zones.zones); // Fetch zones from Redux store
    const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`
    const customerUrl = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`
    const areaUrl = `${constants.baseUrl}/business-areas/get-business-areas/${business?._id}`

    const areaFields = [ { label: "Enter Name", type: "text", name: "areaName" }, ]
    const zoneFields = [ { label: "Enter Name", type: "text", name: "zoneName" }, ]
    
    useReadData(
      areaUrl,
      setAreas,
      setAreaDataFetched,
      state => state.users.isAreasDataFetched,
      "areas"
    );
  
    useReadData(
      zoneUrl,
      setZones,
      setZoneDataFetched,
      state => state.users.isZonesDataFetched,
      "zones"
    );
    useReadData(
      customerUrl,
      setCustomers,
      setCustomerDataFetched,
      state => state.users.isCustomerDataFetched,
      "customers"
    );
  

    const dispatch = useDispatch();


    const handleCheckboxChange = (customer) => {
        if (selectedCustomers.includes(customer)) {
            setSelectedCustomers(selectedCustomers.filter(c => c !== customer));
        } else {
            setSelectedCustomers([...selectedCustomers, customer]);
        }
    };

    const loopAndUpdate = async (element) => {
        const response = await axios.patch(
            `${constants.baseUrl}/customers/${element?._id}`,
            element,
            {
                headers: {
                    "authorization": token
                }
            }
        ).then(res => {
            dispatch(updateCustomer({
                _id: res.data?.data?.customer?._id,
                updatedCustomer: res.data?.data?.customer
              }));
        }).catch(err => {
            console.log(err)
        });
    };

    const createHandler = async () => {
        if (!selectedArea || !selectedZone) return alert("Select Area and Zone!")
        setDisabled(true);
        const updatedCustomers = selectedCustomers.map(customer => ({
            ...customer,
            zone: selectedZone?.value
        }));
        for (const customer of updatedCustomers) {
            await loopAndUpdate(customer);
        }
        setDisabled(false);
        console.log("Successfully updated customers:", updatedCustomers);
    };

    // Filter customers based on the selected area and zone
    const filteredCustomers = customers.filter(customer => {
        if (selectedArea) {
            return customer.area?.areaName === selectedArea.label;
        } else {
            return true;
        }
    });

    return (
        <div style={{
            width: "95%", background: "white", borderRadius: "10px",
            margin: "auto", padding: "30px", display: "flex", flexDirection: "column",
            gap: "35px"
        }}>
            {showAreaAndZone && <AreaAndZone url = "business-areas" fields = {areaFields} name = "Area"
            business = {business?._id} hideModal={()=> setShowAreaAndZone(false)}
            store = {(data)=> {dispatch(addArea(data?.createdArea))}}/>}

            {showZone && <AreaAndZone url = "business-zones" fields = {zoneFields} name = "Zone"
            business = {business?._id} hideModal={()=> setShowZone(false)}
            store = {(data)=> {dispatch(addZone(data?.createdZone))}}/>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Area and Zone selection */}

                <div style = {{display: "flex", gap:"15px"}}>

                <div style = {{display: "flex", gap: "5px"}}>
                <Select
                    placeholder="Select Area"
                    options={areas.map(area => ({ value: area._id, label: area.areaName }))}
                    onChange={selectedOption => setSelectedArea(selectedOption)} // Handle selected area
                    isClearable={true}
                    isSearchable={true}
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
                />
                  <CustomButton text = "ADD" style = {{fontSize: "14px"}} width = "45px" bgColor="black"
          onClick = {() => setShowAreaAndZone(true)}/>
          </div>

          <div style = {{display: "flex", gap: "5px"}}>
                <Select
                    placeholder="Select Zone"
                    options={zones.map(zone => ({ value: zone._id, label: zone.zoneName }))}
                    onChange={selectedOption => setSelectedZone(selectedOption)} // Handle selected zone
                    isClearable={true}
                    isSearchable={true}
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
                />
                <CustomButton text = "ADD" style = {{fontSize: "14px"}} width = "45px" bgColor="black"
          onClick = {() => setShowZone(true)}/>
          </div>

                </div>

                <CustomButton
                    disabled={disabled}
                    text="ASSIGN"
                    fontSize="14px"
                    width="120px"
                    height="35px"
                    onClick={createHandler}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredCustomers.map((customer, index) => (
                    <div key={index} style={{
                        display: "flex", justifyContent: "space-between",
                        border: "1px solid #ccc", padding: "10px", borderRadius: "5px",
                        alignItems: "center"
                    }}>
                       <Checkbox
                            checked={selectedCustomers.includes(customer)}
                            onChange={() => handleCheckboxChange(customer)}
                            style={{
                                flex: 0.2,
                                color: constants.pColor, 
                                '&.Mui-checked': {
                                    color: constants.pColor
                                },
                            }}
                        />
                        {/* <span style={{ flex: 0.2 }}>{index + 1}.</span> */}
                        <span style={{ flex: 2 }}>{customer.name}</span>
                        <span style={{ flex: 1 }}>{customer.phone}</span>
                        <span style={{ flex: 1 }}>{customer.area?.areaName}</span>
                        <span style={{ flex: 1 }}>{customer.zone?.zoneName}</span>
                        <span style={{ flex: 1 }}>{customer.houseNo}</span>
                        <span style={{ flex: 1 }}>${customer.balance}</span>
                   
                    </div>
                ))}
            </div>
        </div>
    )
}
