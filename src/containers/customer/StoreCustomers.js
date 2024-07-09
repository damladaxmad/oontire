import React, { useState } from 'react';
import CustomButton from '../../reusables/CustomButton';
import axios from 'axios';
import { constants } from '../../Helpers/constantsFile';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from '@material-ui/core';
import useReadData from '../../hooks/useReadData';
import { setAreaDataFetched, setAreas } from '../area/areaSlice';
import Select from "react-select"
import { addCustomer, updateCustomerAqrisHore } from './customerSlice';
import { handleAddCustomerBalance } from './customerUtils';
import { setZoneDataFetched, setZones } from '../zone/zoneSlice';

export default function ({ customers, hide }) {
    const [isChecked, setIsChecked] = useState(true);
    const [disabled, setDisabled] = useState(false)
    const { business, _id } = useSelector(state => state.login.activeUser)
    const token = useSelector(state => state.login.token)
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const areas = useSelector(state => state.areas.areas);
    const zones = useSelector(state => state.zones?.zones);
    const areaUrl = `${constants.baseUrl}/business-areas/get-business-areas/${business?._id}`
    const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`

    const dispatch = useDispatch()

    const calculateBalance = (transactions) => {
        console.log(transactions)
        let balance = 0;
        transactions?.forEach(transaction => {
            balance += transaction.debit - transaction.credit;
        });
        console.log(balance)
        return balance;
    };

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


    let updatedCustomers = []
    customers?.map(data => {
        updatedCustomers.push({
            business: business?._id,
            area: selectedArea?.value,
            zone: selectedZone?.value,
            name: data["Magaca"],
            phone: data["Number-ka"]?.toString() || "0000000000",
            aqrisHore: data["mt.hore"] || 0,
            houseNo: data["Guri Number"],
            balance: data["Deen Hore"] || 0,
            damiinName: data["Damiinka"] || "Empty",
            damiinPhone: data["Number-ka Damiinka"] || "0000000000"
        })
    })

    const loopAndUpload = async (element) => {
        let myElement = { ...element };
        const balance = myElement.balance;
        delete myElement.balance;

        let myCustomer = ""

        const response = await axios.post(
            `${constants.baseUrl}/customers`,
            myElement,
            {
                headers: {
                    "authorization": token
                }
            }
        ).then(res => {
            myCustomer = res?.data?.data?.customer
            dispatch(addCustomer(res?.data?.data?.customer))
        }).catch(err => {
            console.log(err)
        });

        if (isChecked) {
            const response2 = await axios.post(
                `${constants.baseUrl}/transactions`,
                {
                    business: business?._id,
                    customer: myCustomer?._id,
                    description: "Reesto",
                    transactionType: "charge",
                    aqrisHore:(myCustomer?.aqrisHore * 1.5 - balance ) / 1.5,
                    user: _id,
                    aqrisDanbe: myCustomer?.aqrisHore,
                    debit: balance,
                    date: new Date()
                },
                {
                    headers: {
                        "authorization": token
                    }
                }
            ).then(res => {
                console.log("sucess")
                let newAqrisHore = res?.data?.data?.transaction.aqrisDanbe
                let response = res?.data?.data?.transaction
                dispatch(updateCustomerAqrisHore({ customerId: myCustomer?._id, newAqrisHore }));
                handleAddCustomerBalance(dispatch, [], calculateBalance, response);
            }).catch(err => {
                alert(err?.response?.data?.message)
            });
        }
    };


    const createHandler = async () => {
        if (!selectedArea) return alert("Select Area!")
        setDisabled(true);
        for (const customer of updatedCustomers) {
            await loopAndUpload(customer);
        }
        setDisabled(false);
        alert("Succesfully Import Data from Excel")
    }

    console.log(updatedCustomers)

    return (
        <div style={{
            width: "95%", background: "white", borderRadius: "10px",
            margin: "auto", padding: "30px", display: "flex", flexDirection: "column",
            gap: "35px"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{
                    display: "flex", flexDirection: "row", gap: "0px",
                    alignItems: "center"
                }}>

                    <Select
                        placeholder="Select Area"
                        options={areas.map(area => ({ value: area._id, label: area.areaName }))}
                        onChange={selectedOption => setSelectedArea(selectedOption)} // Handle selected area
                        isClearable={true}
                        isSearchable={true}
                        styles={{
                            control: (styles, { isDisabled }) => ({
                                ...styles,
                                border: "1px solid lighGray",
                                height: "40px",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                width: "170px",
                                minHeight: "28px",
                                ...(isDisabled && { cursor: "not-allowed" }),
                            })
                        }}
                    />
                    <Select
                        placeholder="Select Zone"
                        options={zones?.map(zone => ({ value: zone._id, label: zone?.zoneName }))}
                        onChange={selectedOption => setSelectedZone(selectedOption)} // Handle selected area
                        isClearable={true}
                        isSearchable={true}
                        styles={{
                            control: (styles, { isDisabled }) => ({
                                ...styles,
                                border: "1px solid lighGray",
                                height: "40px",
                                borderRadius: "5px",
                                marginLeft:"14px",
                                fontWeight: "bold",
                                width: "170px",
                                minHeight: "28px",
                                ...(isDisabled && { cursor: "not-allowed" }),
                            })
                        }}
                    />
                    <Checkbox
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        style={{
                            color: '#6A03B6',
                            '&.Mui-checked': {
                                color: '#6A03B6'
                            },
                        }}
                    />
                    <label>Add balances</label>

                </div>

                <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>

                    <CustomButton
                        bgColor='white'
                        text="cancel"
                        fontSize="14px"
                        color="black"
                        width="120px"
                        height="35px"
                        onClick={hide}
                    />
                    <CustomButton
                        disabled={disabled}
                        text="CREATE"
                        fontSize="14px"
                        width="120px"
                        height="35px"
                        onClick={createHandler}
                    />

                </div>

            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {customers.map((customer, index) => (
                    <div key={index} style={{
                        display: "flex", justifyContent: "space-between",
                        border: "1px solid #ccc", padding: "10px", borderRadius: "5px"
                    }}>
                        <span style={{ flex: 0.2 }}>{index + 1}.</span>
                        <span style={{ flex: 2 }}>{customer.Magaca}</span>
                        <span style={{ flex: 1 }}>{customer['Number-ka']}</span>
                        <span style={{ flex: 1 }}>{customer['mt.hore']}</span>
                        <span style={{ flex: 1 }}>{customer['Guri Number']}</span>
                        <span style={{ flex: 1 }}>{isChecked ? `$${customer['Deen Hore'] || 0}` : 'Hidden'}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
