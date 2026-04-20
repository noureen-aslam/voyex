package com.voyex.servlet;

import com.voyex.dao.TripDao;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

@WebServlet(name = "PaymentServlet", urlPatterns = "/api/payments/confirm")
public class PaymentServlet extends BaseJsonServlet {
    private final TripDao tripDao = new TripDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 1. Parse the JSON body using GSON from BaseJsonServlet
        Map<String, Object> body = null;
        try {
            body = GSON.fromJson(request.getReader(), Map.class);
        } catch (Exception e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid JSON format"));
            return;
        }
        
        // 2. Validate bookingId presence
        if (body == null || body.get("bookingId") == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Missing bookingId"));
            return;
        }

        try {
            // 3. Extract and convert bookingId safely
            Object idObj = body.get("bookingId");
            long bookingId;
            
            try {
                if (idObj instanceof Number) {
                    bookingId = ((Number) idObj).longValue();
                } else {
                    // This handles cases where ID comes as a String like "123"
                    bookingId = Long.parseLong(String.valueOf(idObj).trim());
                }
            } catch (NumberFormatException nfe) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid bookingId format"));
                return;
            }

            // 4. Generate a mock transaction ID for the database
            String mockTransactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // 5. Update the trip status and save transaction info
            // We use the confirmPayment method we added to your TripDao earlier
            boolean success = tripDao.confirmPayment(bookingId, mockTransactionId);
            
            if (success) {
                writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true, 
                    "message", "Payment confirmed and trip activated.",
                    "transactionId", mockTransactionId
                ));
            } else {
                // If updateTripStatus/confirmPayment returns false, the ID didn't exist
                writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of("message", "Booking not found in database."));
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Log for server debugging
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Database error: " + e.getMessage()));
        } catch (Exception e) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "An unexpected error occurred."));
        }
    }
}