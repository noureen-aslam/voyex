@WebServlet(name = "PaymentServlet", urlPatterns = "/api/payments/confirm")
public class PaymentServlet extends BaseJsonServlet {
    private final TripDao tripDao = new TripDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> body = GSON.fromJson(request.getReader(), Map.class);
        long bookingId = ((Number) body.get("bookingId")).longValue();

        try {
            // Logic to update status in DB
            boolean success = tripDao.updateTripStatus(bookingId, "CONFIRMED");
            if (success) {
                writeJson(response, HttpServletResponse.SC_OK, Map.of("success", true));
            }
        } catch (SQLException e) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Payment sync failed"));
        }
    }
}