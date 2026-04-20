package com.voyex.servlet;

import com.voyex.dao.UserDao;
import com.voyex.model.User;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;
import java.util.Optional;

@WebServlet(name = "LoginServlet", urlPatterns = "/api/auth/login")
public class LoginServlet extends BaseJsonServlet {
    private final UserDao userDao = new UserDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> loginRequest = GSON.fromJson(request.getReader(), Map.class);
        
        if (loginRequest == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid request body."));
            return;
        }

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Email and password are required."));
            return;
        }

        try {
            Optional<User> userOptional = userDao.validateLogin(email, password);
            
            if (userOptional.isEmpty()) {
                writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Invalid credentials."));
                return;
            }

            User user = userOptional.get();

            // Handle Session Logic
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());

            // FIX: Generate a simple token (or use Session ID) so the frontend has something to store
            String token = session.getId(); 

            // Send successful response
            writeJson(response, HttpServletResponse.SC_OK, Map.of(
                "success", true,
                "token", token, // CRITICAL: React needs this field!
                "message", "Login successful.",
                "user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName()
                )
            ));

        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                Map.of("message", "Database error."));
        }
    }
}