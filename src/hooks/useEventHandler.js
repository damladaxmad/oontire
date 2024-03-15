import { useDispatch } from 'react-redux';
import { addCustomer, deleteCustomer, updateCustomer } from "../containers/customer/customerSlice";
// import { addVendor, deleteVendor, updateVendor } from "../containers/vendor/vendorSlice";

const useEventHandler = () => {
  const dispatch = useDispatch();

  const handleEvent = (data, mySocketId, businessId, eventType) => {
    const { socketId} = data;

    if (mySocketId === socketId || data?.businessId !== businessId) return;

    switch (eventType) {
      case 'customerEvent':
        handleCustomerEvent(data);
        break;
      default:
        break;
    }
  };

  const handleCustomerEvent = (data) => {
    const { eventType, customer } = data;

    switch (eventType) {
      case 'add':
        dispatch(addCustomer(customer));
        break;
      case 'delete':
        dispatch(deleteCustomer(customer)); 
        break;
      case 'update':
        dispatch(updateCustomer({
            _id: customer?._id,
            updatedCustomer: customer
          }));
        break;
      default:
        break;
    }
  };


  return { handleEvent };
};

export default useEventHandler;
