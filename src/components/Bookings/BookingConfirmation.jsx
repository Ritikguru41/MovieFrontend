import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (location.state) {
      setBookingDetails(location.state);
      localStorage.setItem("bookingDetails", JSON.stringify(location.state)); // Store in localStorage
    } else {
      const storedDetails = localStorage.getItem("bookingDetails");
      if (storedDetails) {
        const parsedDetails = JSON.parse(storedDetails);
        setBookingDetails(parsedDetails);
        console.log("Booking Details Retrieved:", parsedDetails); // Debugging
      }
    }
  }, [location.state]);

  if (!bookingDetails) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No booking details found.</Typography>
        <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Box>
    );
  }

  const { bookingId, movieTitle, seats, timing, date, place, totalAmount } = bookingDetails;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" textAlign="center" p={3}>
      <Typography variant="h4" fontWeight="bold">Booking Confirmation</Typography>
      <Box bgcolor="#f5f5f5" p={4} borderRadius={2} boxShadow={3} maxWidth="400px" width="100%">
        <Typography variant="h6" fontWeight="bold">Movie: {movieTitle}</Typography>
        <Typography variant="body1">Place: {place}</Typography>
        <Typography variant="body1">Date: {date ? new Date(date).toDateString() : "Not Available"}</Typography>
        <Typography variant="body1">Time: {timing}</Typography>
        <Typography variant="body1">Seats: {Array.isArray(seats) ? seats.join(", ") : "No seats selected"}</Typography>
        <Typography variant="body1">Total Amount: Rs. {totalAmount}</Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/payment", { state: { bookingId, totalAmount, movieTitle, seats, timing, date, place } })}
        sx={{ mt: 4 }}
      >
        Proceed to Payment
      </Button>
    </Box>
  );
};

export default BookingConfirmation;