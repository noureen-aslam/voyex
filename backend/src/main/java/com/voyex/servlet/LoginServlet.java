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
        // Read JSON from request body using GSON from BaseJsonServlet
        Map<String, String> loginRequest = GSON.fromJson(request.getReader(), Map.class);
        
        if (loginRequest == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid request body."));
            return;
        }

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // Basic Validation
        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Email and password are required."));
            return;
        }

        try {
            // Check database for user
            Optional<User> userOptional = userDao.validateLogin(email, password);
            
            if (userOptional.isEmpty()) {
                writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Invalid credentials."));
                return;
            }

            User user = userOptional.get();

            // Handle Session Logic
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userEmail", user.getEmail());

            // Send successful response with user data for React to store in localStorage
            writeJson(response, HttpServletResponse.SC_OK, Map.of(
                "success", true,
                "message", "Login successful.",
                "user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName()
                )
            ));

        } catch (SQLException ex) {
            System.err.println("Login DB Error: " + ex.getMessage());
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                Map.of("message", "Database error during login."));
        }
    }
}