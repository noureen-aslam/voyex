package com.voyex.servlet;

import com.voyex.dao.TripDao;
import com.voyex.model.Trip;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "TripServlet", urlPatterns = "/api/trips")
public class TripServlet extends BaseJsonServlet {
    private final TripDao tripDao = new TripDao();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;

        if (userId == null) {
            String paramId = request.getParameter("userId");
            if (paramId != null) userId = Long.parseLong(paramId);
        }

        if (userId == null) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Login required."));
            return;
        }

        try {
            List<Trip> trips = tripDao.getTripsByUserId(userId);
            writeJson(response, HttpServletResponse.SC_OK, Map.of("trips", trips));
        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Error fetching trips."));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> body = GSON.fromJson(request.getReader(), Map.class);
        
        try {
            // ACTION CHECK: Handle Payment Confirmation
            if (body.containsKey("action") && "PAYMENT_SUCCESS".equals(body.get("action"))) {
                long bId = convertToLong(body.get("bookingId"));
                boolean updated = tripDao.updateTripStatus(bId, "CONFIRMED");
                writeJson(response, HttpServletResponse.SC_OK, Map.of("success", updated));
                return;
            }

            // DEFAULT: Create New Booking
            Trip trip = new Trip();
            trip.setUserId(convertToLong(body.get("userId")));
            trip.setDestination(asString(body.get("destination")));
            trip.setStartDate(asString(body.get("startDate")));
            trip.setEndDate(asString(body.get("endDate")));
            trip.setTravelers(convertToInt(body.get("travelers")));
            trip.setTotalPrice(new BigDecimal(asString(body.get("totalPrice"))));
            trip.setStatus("PENDING");
            
            // New Passenger Details
            trip.setGuestName(asString(body.get("guestName")));
            trip.setPhoneNumber(asString(body.get("phoneNumber")));
            trip.setAddress(asString(body.get("address")));

            long bookingId = tripDao.createBooking(trip);
            writeJson(response, HttpServletResponse.SC_CREATED, Map.of("bookingId", bookingId, "success", true));
            
        } catch (Exception ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", ex.getMessage()));
        }
    }

    private String asString(Object val) { return val == null ? "" : String.valueOf(val); }
    private Long convertToLong(Object val) { return ((Number) val).longValue(); }
    private int convertToInt(Object val) { return ((Number) val).intValue(); }
}