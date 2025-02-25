import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BrowserSheet = () => {
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (location.state) {
      localStorage.setItem("bookingDetails", JSON.stringify(location.state));
      setBookingDetails(location.state);
    } else {
      const savedDetails = localStorage.getItem("bookingDetails");
      if (savedDetails) {
        setBookingDetails(JSON.parse(savedDetails));
      }
    }
  }, [location.state]);

  if (!bookingDetails) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No booking details found.</Typography>
      </Box>
    );
  }

  const { 
    bookingId = "N/A", 
    movieTitle = "Unknown Movie", 
    seats = [], 
    timing = "Not Available", 
    date = "", 
    place = "Not Available", 
    totalAmount = "0.00" 
  } = bookingDetails;

  const formattedDate = date ? new Date(date).toDateString() : "Invalid Date";

  const qrData = JSON.stringify({
    movieTitle,
    place,
    seats,
    date: formattedDate,
  });

  const downloadTicket = () => {
    const input = document.getElementById("ticket");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF
      const imgWidth = 190; // Adjust based on your layout
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("ticket.pdf");
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" textAlign="center" p={3}>
      <Box
        id="ticket"
        bgcolor="white"
        p={4}
        borderRadius={2}
        boxShadow={3}
        width="350px" // Fixed width for better PDF rendering
        sx={{
          border: "1px solid #ddd",
          textAlign: "left",
        }}
      >
        {/* Header */}
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          FindYourSeat
        </Typography>
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Booking Details
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Booking Information */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body1"><strong>Movie:</strong> {movieTitle}</Typography>
          <Typography variant="body1"><strong>Place:</strong> {place}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {formattedDate !== "Invalid Date" ? formattedDate : "Not Available"}</Typography>
          <Typography variant="body1"><strong>Time:</strong> {timing}</Typography>
          <Typography variant="body1"><strong>Seats:</strong> {Array.isArray(seats) && seats.length > 0 ? seats.join(", ") : "No seats selected"}</Typography>
          <Typography variant="body1"><strong>Total Amount:</strong> Rs. {totalAmount}</Typography>
        </Box>

        {/* QR Code */}
        <Box mt={3} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            QR Code
          </Typography>
          <Box bgcolor="white" p={1} borderRadius={2} boxShadow={2}>
            <QRCodeCanvas value={qrData} size={120} level="H" includeMargin={true} />
          </Box>
        </Box>
      </Box>

      {/* Download Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={downloadTicket}
        sx={{ mt: 4, width: "200px", fontSize: "16px", fontWeight: "bold" }}
      >
        Download Ticket
      </Button>
    </Box>
  );
};

export default BrowserSheet;