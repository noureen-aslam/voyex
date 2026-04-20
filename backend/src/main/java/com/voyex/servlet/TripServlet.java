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
        // 1. Try to get userId from the Session first (set during Login)
        HttpSession session = request.getSession(false);
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;

        // 2. Fallback: Check for ?userId= query parameter
        if (userId == null) {
            String paramId = request.getParameter("userId");
            if (paramId != null) {
                userId = Long.parseLong(paramId);
            }
        }

        // 3. If still no user, we can't show trips
        if (userId == null) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Please log in to view trips."));
            return;
        }

        try {
            List<Trip> trips = tripDao.getTripsByUserId(userId);
            // Wrap in an object so React can easily map it
            writeJson(response, HttpServletResponse.SC_OK, Map.of("trips", trips));
        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Error fetching trips."));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> body = GSON.fromJson(request.getReader(), Map.class);
        
        // Attempt to get user ID from session if missing in body
        HttpSession session = request.getSession(false);
        Object userIdObj = (body != null) ? body.get("userId") : null;
        
        if (userIdObj == null && session != null) {
            userIdObj = session.getAttribute("userId");
        }

        if (userIdObj == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "User identification missing."));
            return;
        }

        try {
            Trip trip = new Trip();
            trip.setUserId(convertToLong(userIdObj));
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
            writeJson(response, HttpServletResponse.SC_CREATED, Map.of("bookingId", bookingId, "success", true));
            
        } catch (Exception ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Save failed: " + ex.getMessage()));
        }
    }

    private String asString(Object val) { return val == null ? null : String.valueOf(val); }
    private Long convertToLong(Object val) { return ((Number) val).longValue(); }
    private int convertToInt(Object val) { return ((Number) val).intValue(); }
}