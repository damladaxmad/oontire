import { TextField, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import MyTable from "../../utils/MyTable";
import PrintableTableComponent from "./PintableTableComponent";
import { useReactToPrint } from "react-to-print";
import CustomButton from "../../reusables/CustomButton";
import Select from "react-select";
import useReadData from "../../hooks/useReadData";
import { constants } from "../../Helpers/constantsFile";
import { useEffect, useState } from "react";
import { setZoneDataFetched, setZones } from "../zone/zoneSlice";
import axios from "axios";
import moment from "moment";

const LacagQabasho = ({ name, type }) => {
  const { business } = useSelector((state) => state.login.activeUser);
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;
  let today = new Date();
  const [transactions, setTransaction] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null); // Track selected area
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.login?.token);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`;
  const zones = useSelector((state) => state.zones.zones);

  useReadData(
    zoneUrl,
    setZones,
    setZoneDataFetched,
    (state) => state.zones.isZoneDataFetched,
    "zones"
  );

  const fetchTransactions = () => {
    setLoading(true);
    axios
      .get(
        `${constants.baseUrl}/transactions/get-business-transactions/${business?._id}?customer=notnull&credit=notzero&startDate=${moment(
          startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        const transactionsData = res?.data?.data?.transactions || [];
        if (selectedZone) {
          const filteredTransactions = transactionsData.filter(
            (t) => t.customer.zone === selectedZone.value
          );
          setTransaction(filteredTransactions);
        } else {
          setTransaction(transactionsData);
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when data fetching completes
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedZone, startDate, endDate]); // Add selectedZone to dependencies

  const handleViewClick = () => {
    fetchTransactions();
  };

  let totalTransactions = 0;
  transactions?.map((t) => {
    totalTransactions += t.credit;
  });

  const columns = [
    {
      title: "Full Name",
      field: "name",
      cellStyle: {
        whiteSpace: "nowrap",
      },
      render: (data) => <p>{data?.customer.name}</p>,
    },
    {
      title: "Phone",
      field: "phone",
      width: "20%",
      render: (data) => <p>{data?.customer.phone}</p>,
    },
    {
      title: "Amount",
      field: "credit",
      width: "20%",
      render: (data) => <p>{data?.credit}</p>,
    },

    {
      title: "User",
      field: "user",
      render: (data) => <p>{data?.user?.username}</p>,
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => document.querySelector(".printable-table"),
  });

  return (
    <div
      style={{
        background: "white",
        borderRadius: "8px",
        padding: "30px 50px",
        display: "flex",
        gap: "30px",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <PrintableTableComponent columns={columns} data={transactions} imageUrl={imageUrl} 
            reportTitle = {`Lacag Qabasho Report (${moment(startDate).format('YYYY-MM-DD')} - 
            ${moment(endDate).format('YYYY-MM-DD')})`}> 
            <div style = {{marginTop: "10px"}}>  
                <Typography style = {{ fontSize: "16px"}}>  TOTAL: 
                <span  style = {{fontWeight: "bold", fontSize: "18px"}}> ${totalTransactions} </span></Typography>
            </div>
            </PrintableTableComponent>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Typography
            style={{
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            {" "}
            Lacag Qabasho Report
          </Typography>
          <Typography
            style={{
              fontSize: "18px",
              color: "#6C6C6C",
            }}
          >
            {" "}
            {loading
              ? "loading..."
              : `${transactions?.length} transactions`}
          </Typography>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <TextField
            size="small"
            variant="outlined"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: "20px", width: "130px" }}
          />
          <TextField
            size="small"
            variant="outlined"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: "20px", width: "130px" }}
          />
          <CustomButton
            text="View"
            height="37px"
            width="100px"
            fontSize="14px"
            onClick={handleViewClick}
            bgColor="black"
          />
        </div>

        <CustomButton
          text="Print"
          onClick={handlePrint}
          height="35px"
          fontSize="14px"
        />

        <Typography
          style={{
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          {" "}
          ${totalTransactions?.toFixed(2)}
        </Typography>
      </div>

      <Select
        placeholder="Select Zone"
        options={zones?.map((zone) => ({
          value: zone._id,
          label: zone.zoneName,
        }))}
        onChange={(selectedOption) => setSelectedZone(selectedOption)} // Handle selected area
        isClearable={true}
        isSearchable={true}
        style={{ width: "30%" }}
      />

      {name == "customers" && (
        <MyTable columns={columns} data={transactions} kind="Qabasho" />
      )}
    </div>
  );
};

export default LacagQabasho;
