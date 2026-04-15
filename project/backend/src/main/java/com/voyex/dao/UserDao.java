package com.voyex.dao;

import com.voyex.config.DBConnection;
import com.voyex.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class UserDao {
    private static final String LOGIN_SQL = "SELECT id, full_name, email FROM users WHERE email = ? AND password_hash = ?";

    public Optional<User> validateLogin(String email, String password) throws SQLException {
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(LOGIN_SQL)) {
            stmt.setString(1, email);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setFullName(rs.getString("full_name"));
                user.setEmail(rs.getString("email"));
                return Optional.of(user);
            }
        }
    }
}
