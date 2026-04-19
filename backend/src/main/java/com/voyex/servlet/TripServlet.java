package com.voyex.servlet;

import com.voyex.dao.TripDao;
import com.voyex.model.Trip;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "TripServlet", urlPatterns = "/api/trips")
public class TripServlet extends BaseJsonServlet {
    private final TripDao tripDao = new TripDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> body = GSON.fromJson(request.getReader(), Map.class);
        
        if (body == null || body.get("userId") == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid trip data or missing User ID."));
            return;
        }

        try {
            Trip trip = new Trip();
            
            // Safe conversion from GSON Double to Long/Integer
            trip.setUserId(convertToLong(body.get("userId")));
            trip.setDestination(asString(body.get("destination")));
            trip.setStartDate(asString(body.get("startDate")));
            trip.setEndDate(asString(body.get("endDate")));
            trip.setTravelers(convertToInt(body.get("travelers")));
            
            String priceStr = asString(body.get("totalPrice"));
            trip.setTotalPrice(new BigDecimal(priceStr != null ? priceStr : "0"));
            
            trip.setStatus(asString(body.get("status")));
            
            Object pId = body.get("packageId");
            trip.setPackageId(pId != null ? convertToLong(pId) : null);

            long bookingId = tripDao.createBooking(trip);
            
            writeJson(response, HttpServletResponse.SC_CREATED, Map.of(
                "bookingId", bookingId, 
                "message", "Trip stored in MySQL."
            ));
            
        } catch (Exception ex) {
            ex.printStackTrace();
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Database Error: " + ex.getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // For GET, we still try to use the query param ?userId=X if session fails
        String userIdStr = request.getParameter("userId");
        if (userIdStr == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "User ID required."));
            return;
        }

        try {
            List<Trip> trips = tripDao.getTripsByUserId(Long.parseLong(userIdStr));
            writeJson(response, HttpServletResponse.SC_OK, Map.of("trips", trips));
        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Could not fetch trips."));
        }
    }

    // Helper methods for safe type conversion from GSON
    private String asString(Object val) { return val == null ? null : String.valueOf(val); }
    
    private Long convertToLong(Object val) {
        if (val instanceof Number) return ((Number) val).longValue();
        return Long.parseLong(asString(val));
    }

    private int convertToInt(Object val) {
        if (val instanceof Number) return ((Number) val).intValue();
        return Integer.parseInt(asString(val));
    }
}