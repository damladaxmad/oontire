import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, setCustomerDataFetched, setCustomers, updateCustomer, updateCustomerAqrisHore, updateCustomerSocketBalance } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/customer/customerModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/transaction/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import useEventHandler from "../hooks/useEventHandler";
import { handleAddCustomerBalance, handleDeleteCustomerBalance, handleUpdateCustomerBalance } from "../containers/customer/customerUtils";
import axios from "axios";
import Select from "react-select";
import { setZoneDataFetched, setZones } from "../containers/zone/zoneSlice";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

export default function Customers() {
  const [query, setQuery] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [instance, setInstance] = useState(null);
  const { business, privileges, _id } = useSelector(state => state.login.activeUser);
  const mySocketId = useSelector(state => state?.login?.mySocketId);
  const [selectedZone, setSelectedZone] = useState(null);
  const token = useSelector(state => state.login.token);
  const url = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;
  const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers?.customers || [])));
  const transactions = JSON.parse(JSON.stringify(useSelector(state => state.transactions.transactions)));
  const zones = useSelector((state) => state.zones.zones);
  const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`;

  useReadData(
    zoneUrl,
    setZones,
    setZoneDataFetched,
    (state) => state.zones.isZoneDataFetched,
    "zones"
  );
  const dispatch = useDispatch();

  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm();

  const { loading, error } = useReadData(
    url,
    setCustomers,
    setCustomerDataFetched,
    state => state.customers.isCustomerDataFetched,
    "customers"
  );

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });

  const columns = [
    { title: "Full Name", field: "name", width: "84%" },
    { title: "Phone Number", field: "phone" },
    { title: "Area", field: "area", render: (data) => <p>{data?.area?.areaName}</p> },
    { title: "Zone", field: "area", render: (data) => <p>{data?.zone?.zoneName}</p> },
    { title: "House NO.", field: "houseNo" },
    {
      title: "Balance",
      field: "balance",
      editable: "never",
      render: (data) => <p> {data?.balance.toFixed(2)}</p>,
    },
  ];

  const handler = (data) => {
    return data.filter(instance => {
      if (instance?.status === "closed") return false;
      if (!instance?.type || instance?.type === "deynle") {
        const matchesQuery = query === "" || instance?.name.toLowerCase().includes(query.toLowerCase()) || instance?.phone?.toLowerCase().includes(query.toLowerCase());
        const matchesZone = !selectedZone || instance?.zone?._id === selectedZone.value;
        return matchesQuery && matchesZone;
      }
      return false;
    });
  };

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  const calculateBalanceForCustomer = (transactions) => {
    let balance = 0;
    transactions.forEach(transaction => {
      balance += transaction.debit - transaction.credit;
    });
    return balance;
  };

  const { handleEvent } = useEventHandler();

  useEffect(() => {
    const socket = io.connect('https://oontire-api.onrender.com');
    socket.on('customerEvent', (data) => {
      handleEvent(data, mySocketId, business?._id, "customerEvent");
    });

    socket.on('transactionEvent', (data) => {
      handleTransactionEvent(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTransactionEvent = (data) => {
    const { socketId, businessId, transaction, eventType } = data;
    if (mySocketId === socketId) return;
    if (business?._id !== businessId) return;
    if (eventType === 'add') {
      let newTransaction = transaction?.debit === 0 ? -transaction?.credit : transaction?.debit;
      let newAqrisHore = transaction?.aqrisDanbe;
      dispatch(updateCustomerSocketBalance({ _id: transaction?.customer?._id, transaction: newTransaction }));
      dispatch(updateCustomerAqrisHore({ customerId: transaction?.customer?._id, newAqrisHore }));
    } else if (eventType === 'delete') {
      let newTransaction = transaction?.debit === 0 ? transaction?.credit : -transaction?.debit;
      dispatch(updateCustomerSocketBalance({ _id: transaction?.customer, transaction: newTransaction }));
    }
  };

  const calculateBalance = (transactions) => {
    let balance = 0;
    transactions?.forEach(transaction => {
      balance += transaction.debit - transaction.credit;
    });
    return balance;
  };

  const createReesto = (customer, reesto) => {
    if (!reesto || reesto === 0) return;
    axios.post(
      `${constants.baseUrl}/transactions`,
      {
        business: business?._id,
        customer: customer?._id,
        description: "Reesto",
        transactionType: "charge",
        aqrisHore: (customer?.aqrisHore * 1.5 - reesto) / 1.5,
        user: _id,
        aqrisDanbe: customer?.aqrisHore,
        debit: reesto,
        date: new Date()
      },
      {
        headers: {
          "authorization": token
        }
      }
    ).then(res => {
      let newAqrisHore = res?.data?.data?.transaction.aqrisDanbe;
      let response = res?.data?.data?.transaction;
      dispatch(updateCustomerAqrisHore({ customerId: customer?._id, newAqrisHore }));
      handleAddCustomerBalance(dispatch, [], calculateBalance, response);
    }).catch(err => {
      alert(err?.response?.data?.message);
    });
  };

  return (
    <div style={parentDivStyle}>

      {!showTransactions && <TitleComponent title="Customers"
        btnName="Abuur Macaamiil" onClick={handleShowRegister} />}

      {!showTransactions && <CustomRibbon query={query}
        setQuery={handleSearchChange} >
        {/* Zone Select Dropdown */}
        {!showTransactions && (
          <div>
            <Select
              placeholder="Select Zone"
              options={zones?.map((zone) => ({
                value: zone._id,
                label: zone.zoneName,
              }))}
              onChange={(selectedOption) => setSelectedZone(selectedOption)} // Handle selected zone
              isClearable={true}
              isSearchable={true}
              style={{ width: "30%" }}
            />
          </div>
        )}
      </CustomRibbon>}

      {!showTransactions && <Table
        data={handler(customers)} columns={columns}
        name="Customer"
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onSeeTransactions={(data) => {
          setInstance(data);
          setShowTransactions(true);
        }}

        onDelete={(data) => {
          deleteFunction(false, "Customer Deletion",
            data.name,
            `${constants.baseUrl}/customers/close-customer-statement/${data?._id}`,
            token,
            () => { dispatch(deleteCustomer(data)) });
        }}

        onClickRow={(data) => {
          setInstance(data);
          setShowTransactions(true);
        }}
      />}

{showRegister && <Register
        instance={toBeUpdatedCustomer}
        update={update}
        name="Customer"
        fields={fields}
        url="customers"
        business={business?._id}
        hideModal={() => { handleHide() }}
        store={(data, reesto) => {
          dispatch(addCustomer(data?.customer))
          notify("Customer created successfully")
          createReesto(data?.customer, reesto)
        }}
        onUpdate={
          (data) => {
            dispatch(updateCustomer({
              _id: data?.customer?._id,
              updatedCustomer: data?.customer
            }));
            notify("Customer updated successfully")
          }
        } />}


     {showTransactions && <Transactions
        instance={instance}
        client= "customer"
        url={`${constants.baseUrl}/transactions/get-customer-transactions/${instance?._id}`}
        hideTransactions={() => setShowTransactions(false)} />}
      <ToastContainer />
    </div>
  );
}
