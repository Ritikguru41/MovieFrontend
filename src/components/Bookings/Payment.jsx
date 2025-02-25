import React, { useState } from "react";
import { Box, Typography, Button, TextField, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [upiApp, setUpiApp] = useState("gpay");
  const [upiID, setUpiID] = useState("");

  const handlePayment = () => {
    if (paymentMethod === "upi" && !upiID.includes("@")) {
      alert("Please enter a valid UPI ID.");
      return;
    }
    if (paymentMethod === "card" && cardNumber.length < 14) {
      alert("Please enter a valid 12-digit Card Number.");
      return;
    }
    localStorage.setItem("bookingDetails", JSON.stringify(bookingData));
    navigate("/browser-sheet", { state: bookingData });
  };

  const handleCardInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    value = value.replace(/(.{4})/g, "$1 ").trim().substring(0, 14);
    setCardNumber(value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" textAlign="center" p={3}>
      <Typography variant="h4" fontWeight="bold">Payment</Typography>
      <Box bgcolor="#f5f5f5" p={4} borderRadius={2} boxShadow={3} maxWidth="400px" width="100%">
        <Typography variant="h6" fontWeight="bold">Total Amount: Rs. {bookingData.totalAmount || "0.00"}</Typography>
        
        <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} row sx={{ mt: 2 }}>
          <FormControlLabel value="card" control={<Radio />} label="Card" />
          <FormControlLabel value="upi" control={<Radio />} label="UPI" />
        </RadioGroup>
        
        {paymentMethod === "card" && (
          <TextField
            fullWidth
            label="Card Number"
            variant="outlined"
            value={cardNumber}
            onChange={handleCardInput}
            placeholder="XXXX XXXX XXXX"
            inputProps={{ maxLength: 14 }}
            sx={{ mt: 2 }}
          />
        )}
        
        {paymentMethod === "upi" && (
          <>
            <Select fullWidth value={upiApp} onChange={(e) => setUpiApp(e.target.value)} sx={{ mt: 2 }}>
              <MenuItem value="gpay">Google Pay</MenuItem>
              <MenuItem value="phonepe">PhonePe</MenuItem>
              <MenuItem value="paytm">Paytm</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Enter UPI ID"
              variant="outlined"
              margin="normal"
              placeholder="example@upi"
              value={upiID}
              onChange={(e) => setUpiID(e.target.value)}
            />
          </>
        )}
        
        <Button variant="contained" color="primary" onClick={handlePayment} sx={{ mt: 4 }}>
          Pay Now
        </Button>
      </Box>
    </Box>
  );
};

export default Payment;