import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Modal from "../Modal/Modal";
import { constants } from "../Helpers/constantsFile";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import CustomButton from "../reusables/CustomButton";
import { setAreaDataFetched, setAreas } from "../containers/area/areaSlice";
import useReadData from "../hooks/useReadData";

const AreaAndZone = ({instance, store, name, fields, update, url, business,
hideModal, onUpdate}) => {

  const filteredFields = fields.filter(field => !(update && name === "User" && field.name === "password"));
  const [disabled, setDisabled] = useState(false)
  const token = useSelector(state => state.login.token)
  const { business: business2 } = useSelector(state => state.login.activeUser)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const areas = JSON.parse(JSON.stringify(useSelector(state => state.areas?.areas || [])))
  const zones = JSON.parse(JSON.stringify(useSelector(state => state.zones?.zones || [])))
  const areaUrl = `${constants.baseUrl}/business-areas/get-business-areas/${business2?._id}`
  
  useReadData(
    areaUrl,
    setAreas,
    setAreaDataFetched,
    state => state.users.isAreasDataFetched,
    "areas"
  );

  const dispatch = useDispatch()

  const validate = (values) => {
    const errors = {};

    //  if ( name !== "Category" && !values.name) {
    //    errors.name = "Field is Required";
    //  }
  

    return errors;
  };

  const formik = useFormik({
    initialValues: {
        name: update ? instance?.name : "",
    },
    validate,
    onSubmit: (values,  ) => {
      setDisabled(true)
      values.business = business
      values.socketId = mySocketId
      if (typeof values.area === 'object') {
        values.area = values.area?._id;
      }

        axios.post(`${constants.baseUrl}/${url}`, values,
        {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          setDisabled(false)
          hideModal()
          store(res?.data?.data)
        }).catch((err) => {
          setDisabled(false)
          alert(err?.response?.data?.message);
        });
    
    },
  });

 
  return (
    <Modal onClose = {hideModal} pwidth = {"350px"}
    left = {"44%"} top = "32%">
       <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <h2>{update ? `${name} Update` : `${name} Creation`}</h2>
     

        <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", gap: "16px", justifyContent: "center",
      flexDirection: "column", alignItems: "center",
    flexWrap: "wrap", marginBottom: "12px"}}
      >
        {filteredFields?.map((a, index) => (
          <div key = {index}>
            <input
              // variant="outlined"
              label={a.label}
              placeholder={a.label}
              id={a.name}
              name={a.name}
              type={a.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[a.name]}
              style={{ width: "250px", color: "black",
              padding: "10px", borderRadius: "5px", height: "40px",
              border: "1px solid lightGrey", }}
              key={index}
            />
            {formik.touched[a.name] && formik.errors[a.name] ? (
              <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
            ) : null}
          </div>
        ))}

        {name == "Zone" && <Select
            placeholder='Select area'
            styles={{
              control: (styles, { isDisabled }) => ({
                ...styles,
                border: "1px solid lightGrey",
                height: "40px",
                borderRadius: "5px",
                width: "250px",
                minHeight: "28px",
                ...(isDisabled && { cursor: "not-allowed" }),
              }),
              menu: (provided, state) => ({
                ...provided,
                zIndex: 9999 
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "black" : "inherit", // Keep text black for selected option
                backgroundColor: state.isSelected ? constants.pColor + "1A" : "inherit",
                "&:hover": {
                  backgroundColor: constants.pColor + "33",
                }
              }),
              singleValue: (provided, state) => ({
                ...provided,
                color: "black",
              }),
              input: (provided, state) => ({
                ...provided,
                color: "black", 
                "&:focus": {
                  borderColor: constants.pColor,
                  boxShadow: `0 0 0 1px ${constants.pColor}`,
                }
              }),
            }}
            menuPlacement="top" 
            value={formik.values.area ? { value: formik.values.area, label: formik.values.area.areaName } : null}
            options={areas?.map(area => ({ value: area, label: area?.areaName }))}
            onChange={(selectedOption) => formik.setFieldValue("area", selectedOption ? selectedOption.value : null)}
            isClearable={true} 
            isDisabled={disabled}
          />}

       <CustomButton 
       disabled={disabled}
       type = "submit"
       width = "250px"
       bgColor={constants.pColor}
       text = {update ? `Update ${name}` : `Create ${name}`}
      //  style = {{marginBottom: "8px"}}
       />
      </form>

      </div>
    </Modal>
  );
};

export default AreaAndZone;
