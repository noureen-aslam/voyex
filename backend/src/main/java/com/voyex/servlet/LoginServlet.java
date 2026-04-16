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
        String email = loginRequest == null ? null : loginRequest.get("email");
        String password = loginRequest == null ? null : loginRequest.get("password");

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Email and password are required."));
            return;
        }

        try {
            Optional<User> user = userDao.validateLogin(email, password);
            if (user.isEmpty()) {
                writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Invalid credentials."));
                return;
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.get().getId());
            session.setAttribute("userEmail", user.get().getEmail());

            writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true,
                    "message", "Login successful.",
                    "user", user.get()
            ));
        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    Map.of("message", "Database error during login."));
        }
    }
}
