import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const CreateCustomer = () => {
  const [details, setDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    preferredBank: "",
    country: "NG",
    accountNumber: "",
    bvn: "",
    bankCode: "",
  });
  const [banks, setBanks] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchBanks();
    availableProviders();
  }, []);

  useEffect(() => {
    const requiredFields = ["email", "firstName", "lastName", "phone", "bankCode", "accountNumber", "bvn", "preferredBank"];
    const isDisabled = requiredFields.some(field => !details[field]);
    setIsSubmitDisabled(isDisabled);
  }, [details]);

  const fetchBanks = async () => {
    try {
      const response = await axios.get("https://p-gate-2.onrender.com/banks");
      const data = await response.data.data;
      setBanks(data);
    } catch (error) {
      showSuccessModal(true);
      setModalMessage(error.response.data.message)
    }
  };

  const availableProviders = async () => {
    try {
      const response = await axios.get("https://p-gate-2.onrender.com/available-providers");
      const data = await response.data.data;
      setProviders(data);
    } catch (error) {
      showSuccessModal(true);
      setModalMessage(error.response.data.message)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("https://p-gate-2.onrender.com/dedicated-account/assign", details); 
      setModalMessage(response.data.message)
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage(error.response.data.message)
      setShowSuccessModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };


  return (
    <>
      <h3>Create customer virtual account</h3>
      <div className="container">
        <h3>Provide customer details</h3>
        <form onSubmit={handleSubmit}>
        <div>
          <label>Enter email: </label>
          <input
            type="email"
            value={details.email}
            onChange={handleChange}
            name="email"
            required
          />
        </div>
        <div>
          <label>First name: </label>
          <input
            type="text"
            value={details.firstName}
            onChange={handleChange}
            name="firstName"
            required
          />
        </div>
        <div>
          <label>Last name: </label>
          <input
            type="text"
            value={details.lastName}
            onChange={handleChange}
            name="lastName"
            required
          />
        </div>
        <div>
          <label>Phone number: </label>
          <input
            type="tel"
            value={details.phone}
            onChange={handleChange}
            name="phone"
            required
          />
        </div>
        <div>
          <label>Bank name: </label>
          <select
            required
            onChange={handleChange}
            name="bankCode"
            value={details.bankCode}
          >
            <option selected>Select a bank</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Account number: </label>
          <input
            type="number"
            value={details.accountNumber}
            onChange={handleChange}
            name="accountNumber"
            required
          />
        </div>
        <div>
          <label>BVN: </label>
          <input
            type="number"
            value={details.bvn}
            onChange={handleChange}
            name="bvn"
            required
          />
        </div>
        <div>
          <label>Preferred Bank</label>
          <select
            required
            onChange={handleChange}
            name="preferredBank"
            value={details.preferredBank}
          >
            <option selected>Select a provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.provider_slug}>
                {provider.bank_name}
              </option>
            ))}
          </select>
        </div>
        <div>
            <button type="submit" disabled={isSubmitDisabled}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      {showSuccessModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <p className="close" onClick={closeModal}>close</p>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCustomer;
