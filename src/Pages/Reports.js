import { useState } from "react"
import { constants } from "../Helpers/constantsFile";
import { Typography } from "@material-ui/core";
import PersonalReport from "../containers/reports/PersonalReports";
import InvoicingReport from "../containers/reports/ByAreaReport";
import ByZoneReport from "../containers/reports/ByZoneReport";
import LacagQabasho from "../containers/reports/LacagQabasho";
import ZoneSummary from "../containers/reports/ZoneSummary";
import { useSelector } from "react-redux";
import { setCustomerDataFetched, setCustomers } from "../containers/customer/customerSlice";
import useReadData from "../hooks/useReadData";
import Discounts from "../containers/reports/Discounts";

export default function Reports() {
  const [currentTab, setCurrentTab] = useState(0)
  const { business } = useSelector((state) => state.login.activeUser);
  const customerUrl = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;

  useReadData(
    customerUrl,
    setCustomers,
    setCustomerDataFetched,
    (state) => state.customers.isCustomersDataFetched,
    "customers"
  );

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

    return (
      <div style={{width: "95%", margin: "auto"}}>
        {/* <h2> Reports</h2> */}

        <div style={{
        display: 'flex',
        marginBottom: '20px',
        gap: "10px"
      }}>
        <div
          onClick={() => handleTabChange(0)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 0 ? constants.pColor : 'transparent',
            color: currentTab === 0 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
           <Typography>Customers </Typography>
        </div>
        <div
          onClick={() => handleTabChange(1)}
          style={{
           padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 1 ? constants.pColor : 'transparent',
            color: currentTab === 1 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
        By Area
        </div>
        <div
          onClick={() => handleTabChange(2)}
          style={{
           padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 2 ? constants.pColor : 'transparent',
            color: currentTab === 2 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
        By Zone
        </div>
        <div
          onClick={() => handleTabChange(3)}
          style={{
           padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 3 ? constants.pColor : 'transparent',
            color: currentTab === 3 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
        Qabasho
        </div>
        <div
          onClick={() => handleTabChange(5)}
          style={{
           padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 5 ? constants.pColor : 'transparent',
            color: currentTab === 5 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
        Discounts
        </div>
        <div
          onClick={() => handleTabChange(4)}
          style={{
           padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 4 ? constants.pColor : 'transparent',
            color: currentTab === 4 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
        Summary
        </div>
       
      </div>

      {currentTab == 0 && <PersonalReport name = "customers" type = "Customers"/>}
      {currentTab == 1 && <InvoicingReport name = "customers" type = "Invoicing"/>}
      {currentTab == 2 && <ByZoneReport name = "customers" type = "Invoicing"/>}
      {currentTab == 3 && <LacagQabasho name = "customers" type = "Invoicing"/>}
      {currentTab == 4 && <ZoneSummary name = "customers" type = "Invoicing"/>}
      {currentTab == 5 && <Discounts name = "customers" type = "Invoicing"/>}
      </div>
    )
  }