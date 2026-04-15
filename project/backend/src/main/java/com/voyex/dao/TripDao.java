package com.voyex.dao;

import com.voyex.config.DBConnection;
import com.voyex.model.Trip;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class TripDao {
    private static final String INSERT_TRIP_SQL =
            "INSERT INTO trips(user_id, package_id, destination, start_date, end_date, travelers, total_price, status) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String GET_TRIPS_BY_USER_SQL =
            "SELECT id, user_id, package_id, destination, start_date, end_date, travelers, total_price, status " +
            "FROM trips WHERE user_id = ? ORDER BY created_at DESC";

    public long createBooking(Trip trip) throws SQLException {
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(INSERT_TRIP_SQL, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, trip.getUserId());
            if (trip.getPackageId() == null) {
                stmt.setNull(2, java.sql.Types.BIGINT);
            } else {
                stmt.setLong(2, trip.getPackageId());
            }
            stmt.setString(3, trip.getDestination());
            stmt.setDate(4, Date.valueOf(trip.getStartDate()));
            stmt.setDate(5, Date.valueOf(trip.getEndDate()));
            stmt.setInt(6, trip.getTravelers());
            stmt.setBigDecimal(7, trip.getTotalPrice());
            stmt.setString(8, trip.getStatus() == null ? "BOOKED" : trip.getStatus());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
                throw new SQLException("Trip booking created but no ID returned.");
            }
        }
    }

    public List<Trip> getTripsByUserId(long userId) throws SQLException {
        List<Trip> trips = new ArrayList<>();
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(GET_TRIPS_BY_USER_SQL)) {
            stmt.setLong(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Trip trip = new Trip();
                    trip.setId(rs.getLong("id"));
                    trip.setUserId(rs.getLong("user_id"));
                    long packageId = rs.getLong("package_id");
                    trip.setPackageId(rs.wasNull() ? null : packageId);
                    trip.setDestination(rs.getString("destination"));
                    trip.setStartDate(rs.getDate("start_date").toString());
                    trip.setEndDate(rs.getDate("end_date").toString());
                    trip.setTravelers(rs.getInt("travelers"));
                    trip.setTotalPrice(rs.getBigDecimal("total_price"));
                    trip.setStatus(rs.getString("status"));
                    trips.add(trip);
                }
            }
        }
        return trips;
    }
}
