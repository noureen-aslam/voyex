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
            // Read JSON from request body
            Map<String, String> regRequest = GSON.fromJson(request.getReader(), Map.class);
            
            String email = regRequest.get("email");
            String password = regRequest.get("password");
            String fullName = regRequest.get("fullName");

            // Validation
            if (email == null || password == null || fullName == null) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "All fields are required."));
                return;
            }

            // Create User Object
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(password); // Matches the 'setPassword' method in User model
            newUser.setFullName(fullName);

            // Execute Database Logic
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
            e.printStackTrace(); // Good for debugging Render logs
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("message", "Server error."));
        }
    }
}