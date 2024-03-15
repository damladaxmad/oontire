import { useState } from "react"
import { constants } from "../Helpers/constantsFile";
import { Typography } from "@material-ui/core";
import PersonalReport from "../containers/reports/PersonalReports";
import StockSummary from "../containers/reports/StockSummary";

export default function Reports() {
  const [currentTab, setCurrentTab] = useState(0)

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
          Stuff
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
          Unpaid
        </div>
      </div>

      {currentTab == 0 && <PersonalReport name = "customers" type = "Customers"/>}
      </div>
    )
  }