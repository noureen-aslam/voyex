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
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        Long userId = session == null ? null : (Long) session.getAttribute("userId");
        if (userId == null) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Login required."));
            return;
        }

        Map<String, Object> body = GSON.fromJson(request.getReader(), Map.class);
        if (body == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid request body."));
            return;
        }

        try {
            Trip trip = new Trip();
            trip.setUserId(userId);
            trip.setDestination(asString(body.get("destination")));
            trip.setStartDate(asString(body.get("startDate")));
            trip.setEndDate(asString(body.get("endDate")));
            trip.setTravelers(asInt(body.get("travelers")));
            trip.setTotalPrice(new BigDecimal(asString(body.get("totalPrice"))));
            trip.setStatus("BOOKED");
            String packageIdValue = asString(body.get("packageId"));
            trip.setPackageId(packageIdValue == null || packageIdValue.isBlank() ? null : Long.valueOf(packageIdValue));

            long bookingId = tripDao.createBooking(trip);
            writeJson(response, HttpServletResponse.SC_CREATED, Map.of("bookingId", bookingId, "message", "Trip booked."));
        } catch (RuntimeException | SQLException ex) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Unable to book trip."));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        Long userId = session == null ? null : (Long) session.getAttribute("userId");
        if (userId == null) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Login required."));
            return;
        }

        try {
            List<Trip> trips = tripDao.getTripsByUserId(userId);
            writeJson(response, HttpServletResponse.SC_OK, Map.of("trips", trips));
        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Unable to load trips."));
        }
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private int asInt(Object value) {
        return Integer.parseInt(asString(value));
    }
}
