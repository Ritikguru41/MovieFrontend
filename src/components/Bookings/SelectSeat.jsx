import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, Box, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { bookSeats, getMovieDetails } from "../../api-helpers/api-helpers";

// Define seat layout and showtimes
const seatLayout = {
  premium: { rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], price: 250, seatsPerRow: 10 },
  executive: { rows: ["K"], price: 500, seatsPerRow: 18 },
};

const showtimes = ["9:00 AM", "12:30 PM", "4:00 PM", "6:30 PM", "8:30 PM"];

const places = [
  "PVR Kurla",
  "PVR Chakala",
  "Maxus Sakinaka",
  "PVR Bandra",
  "Galaxy Cinema Bandra",
  "INOX R-City Ghatkophar",
  "INOX R-Mall Thane",
  "Nexus Cinema Seawoods",
  "MovieMax Kalyan",
  "Gem Cinema Bandra",
  "Kasturba Cinema",
];

const SeatSelection = () => {
  const { id: movieId } = useParams(); // Rename id to movieId
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [movieTitle, setMovieTitle] = useState(""); // Add state for movie title
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await getMovieDetails(movieId);
        if (res && res.title) {
          setMovieTitle(res.title);
          localStorage.setItem("movieTitle", res.title); // Store title for later use
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  // Handle seat selection
  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Calculate total amount based on selected seats
  const totalAmount = selectedSeats.reduce((sum, seat) => {
    const category = Object.values(seatLayout).find(({ rows }) =>
      rows.some((row) => seat.startsWith(row))
    );
    return sum + (category ? category.price : 0);
  }, 0);

  const handleConfirmBooking = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to book seats.");
      return;
    }

    if (!selectedSeats.length || !selectedTime || !selectedDate || !selectedPlace) {
      alert("Please select place, seats, date, and time.");
      return;
    }

    setLoading(true);
    try {
      // Ensure movieTitle is set
      const currentMovieTitle = movieTitle || localStorage.getItem("movieTitle") || "Unknown Movie";

      // Prepare booking data
      const bookingData = {
        seats: selectedSeats,
        userId,
        movieTime: selectedTime, // Ensure this matches the backend schema
        date: selectedDate,
        movieTitle: currentMovieTitle, // Include movieTitle in the payload
        place: selectedPlace, // Include selected place in the payload
      };

      console.log("Booking Data:", bookingData); // Debugging

      // Call the bookSeats API
      const res = await bookSeats(movieId, bookingData);

      if (res) {
        console.log("Booking successful:", res);

        // Store booking details in localStorage
        const bookingDetails = {
          bookingId: res.bookingId,
          movieTitle: currentMovieTitle,
          seats: selectedSeats,
          timing: selectedTime,
          date: selectedDate,
          place: selectedPlace,
          totalAmount,
        };

        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
        console.log("Booking Details Stored:", bookingDetails); // Debugging

        // Navigate to confirmation page
        navigate("/booking-confirmation", { state: bookingDetails });
      } else {
        console.warn("Booking response was empty or unsuccessful");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={2} pb={10}>
      <Typography variant="h5" gutterBottom>Select Your Seats</Typography>

      {/* Place Selection */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Select Place</Typography>
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Place</InputLabel>
          <Select
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            label="Place"
          >
            {places.map((place) => (
              <MenuItem key={place} value={place}>
                {place}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Date Selection */}
      <Box mb={4}>
  <Typography variant="h6" gutterBottom>Select Date</Typography>
  <TextField
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    sx={{ width: "200px" }}
    inputProps={{ min: new Date().toISOString().split("T")[0] }} // Restricts past dates
  />
</Box>


      {/* Showtimes Selection */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Select Movie Time</Typography>
        <Grid container spacing={2} justifyContent="center">
          {showtimes.map((time) => (
            <Grid item key={time}>
              <Button
                variant={selectedTime === time ? "contained" : "outlined"}
                color={selectedTime === time ? "success" : "primary"}
                onClick={() => setSelectedTime(time)}
                sx={{ minWidth: "120px", borderRadius: "8px" }}
              >
                {time}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Seat Selection */}
      {Object.entries(seatLayout).map(([category, { rows, price, seatsPerRow }]) => (
        <Box key={category} mb={4} width="100%">
          <Typography variant="h6" gutterBottom>
            {category.charAt(0).toUpperCase() + category.slice(1)} (Rs. {price})
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {rows.map((row) => (
              <Grid key={row} container item justifyContent="center" spacing={1} mb={1}>
                {[...Array(seatsPerRow)].map((_, i) => {
                  const seat = `${row}${i + 1}`;
                  return (
                    <Grid item key={seat}>
                      <Button
                        variant={selectedSeats.includes(seat) ? "contained" : "outlined"}
                        color={selectedSeats.includes(seat) ? "success" : "primary"}
                        onClick={() => handleSeatClick(seat)}
                        sx={{ minWidth: "40px", borderRadius: "8px" }}
                      >
                        {seat}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Confirm Booking Button */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bgcolor="white"
        boxShadow={3}
        p={1}
        textAlign="center"
        zIndex={1000}
      >
        <Typography variant="h6" fontSize="1rem">Total: Rs. {totalAmount}</Typography>
        <Button
          variant="contained"
          color="error"
          disabled={!selectedSeats.length || !selectedTime || !selectedDate || !selectedPlace || loading}
          sx={{ mt: 0.5, width: "180px", height: "36px", fontSize: "0.9rem" }}
          onClick={handleConfirmBooking}
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </Button>
      </Box>
    </Box>
  );
};

export default SeatSelection;