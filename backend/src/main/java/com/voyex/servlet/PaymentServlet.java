package com.voyex.servlet;

// Necessary Imports to fix "cannot find symbol"
import com.voyex.dao.TripDao;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

@WebServlet(name = "PaymentServlet", urlPatterns = "/api/payments/confirm")
public class PaymentServlet extends BaseJsonServlet {
    private final TripDao tripDao = new TripDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // GSON and writeJson are inherited from BaseJsonServlet
        Map<String, Object> body = GSON.fromJson(request.getReader(), Map.class);
        
        if (body == null || body.get("bookingId") == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Missing bookingId"));
            return;
        }

        try {
            // Safe conversion of ID from the JSON body
            Object idObj = body.get("bookingId");
            long bookingId;
            
            if (idObj instanceof Number) {
                bookingId = ((Number) idObj).longValue();
            } else {
                bookingId = Long.parseLong(String.valueOf(idObj));
            }

            // Update status in database to CONFIRMED
            boolean success = tripDao.updateTripStatus(bookingId, "CONFIRMED");
            
            if (success) {
                writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true, 
                    "message", "Payment confirmed and trip activated."
                ));
            } else {
                writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of("message", "Booking ID not found."));
            }

        } catch (SQLException e) {
            e.printStackTrace();
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Database error during payment sync."));
        } catch (Exception e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid data format."));
        }
    }
}