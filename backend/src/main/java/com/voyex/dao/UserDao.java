package com.voyex.dao;

import com.voyex.config.DBConnection;
import com.voyex.model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.mindrot.jbcrypt.BCrypt;

public class UserDao {
    // SQL Queries
    private static final String LOGIN_SQL =
    "SELECT id, full_name, email, password_hash FROM users WHERE email = ?";
private static final String REGISTER_SQL =
    "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";

public boolean registerUser(User user) throws SQLException {
    try (Connection connection = DBConnection.getInstance().getConnection();
         PreparedStatement stmt = connection.prepareStatement(REGISTER_SQL)) {

        stmt.setString(1, user.getFullName());
        stmt.setString(2, user.getEmail());
        stmt.setString(3, BCrypt.hashpw(user.getPassword(), BCrypt.gensalt())); // hash before saving

        int rowsAffected = stmt.executeUpdate();
        return rowsAffected > 0;
    } catch (SQLException e) {
        if (e.getSQLState() != null && e.getSQLState().startsWith("23")) {
            return false; // duplicate email
        }
        throw e;
    }
}

public Optional<User> validateLogin(String email, String password) throws SQLException {
    try (Connection connection = DBConnection.getInstance().getConnection();
         PreparedStatement stmt = connection.prepareStatement(LOGIN_SQL)) {

        stmt.setString(1, email);
        ResultSet rs = stmt.executeQuery();

        if (rs.next()) {
            String storedHash = rs.getString("password_hash");
            if (BCrypt.checkpw(password, storedHash)) {
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
}