package com.voyex.servlet;

import com.voyex.dao.UserDao;
import com.voyex.model.User;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@WebServlet(name = "RegisterServlet", urlPatterns = "/api/auth/register")
public class RegisterServlet extends BaseJsonServlet {
    private final UserDao userDao = new UserDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            // Parse Request Body
            Map<String, String> regRequest = GSON.fromJson(request.getReader(), Map.class);
            
            if (regRequest == null) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid request body."));
                return;
            }

            String email = regRequest.get("email");
            String password = regRequest.get("password");
            String fullName = regRequest.get("fullName");

            // Validation
            if (email == null || password == null || fullName == null || email.isBlank()) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "All fields are required."));
                return;
            }

            // Map to User Model
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(password); 
            newUser.setFullName(fullName);

            // Database Operation
            boolean success = userDao.registerUser(newUser);

            if (success) {
                writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true,
                    "message", "Registration successful!"
                ));
            } else {
                writeJson(response, HttpServletResponse.SC_CONFLICT, Map.of("message", "Email already exists."));
            }
            
        } catch (Exception e) {
            // Logs to Render's terminal for debugging
            System.err.println("Registration Error: " + e.getMessage());
            e.printStackTrace(); 
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Internal Server Error."));
        }
    }
}