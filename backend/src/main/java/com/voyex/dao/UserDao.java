package com.voyex.dao;

import com.voyex.config.DBConnection;
import com.voyex.model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class UserDao {
    // SQL Queries
    private static final String LOGIN_SQL = "SELECT id, full_name, email FROM users WHERE email = ? AND password_hash = ?";
    private static final String REGISTER_SQL = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";

    /**
     * Validates user credentials for Login
     */
    public Optional<User> validateLogin(String email, String password) throws SQLException {
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(LOGIN_SQL)) {
            
            stmt.setString(1, email);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getLong("id"));
                    user.setFullName(rs.getString("full_name"));
                    user.setEmail(rs.getString("email"));
                    return Optional.of(user);
                }
            }
        }
        return Optional.empty();
    }

    /**
     * Creates a new user in the database
     */
    public boolean registerUser(User user) throws SQLException {
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(REGISTER_SQL)) {
            
            stmt.setString(1, user.getFullName());
            stmt.setString(2, user.getEmail());
            // Using getPassword() from your model - make sure it's set in the Servlet
            stmt.setString(3, user.getPassword());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            // Check for duplicate email (Unique Constraint violation)
            if (e.getSQLState().startsWith("23")) {
                return false;
            }
            throw e;
        }
    }
}