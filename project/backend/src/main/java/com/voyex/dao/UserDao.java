package com.voyex.dao;

import com.voyex.config.DBConnection;
import com.voyex.model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UserDao {
    private static final String INSERT_USER_SQL = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";

    public boolean registerUser(User user) throws SQLException {
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(INSERT_USER_SQL)) {
            
            stmt.setString(1, user.getFullName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPassword());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            // Handle unique constraint for email
            if (e.getSQLState().startsWith("23")) {
                return false;
            }
            throw e;
        }
    }
}