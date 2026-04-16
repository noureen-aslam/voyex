package com.voyex.dao;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.voyex.config.DBConnection;
import com.voyex.model.TravelPackage;

import java.lang.reflect.Type;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TravelPackageDao {
    private static final String GET_PACKAGES_SQL =
            "SELECT id, name, destination, price, duration, image_url, includes_json, highlights_json " +
            "FROM travel_packages ORDER BY id DESC";
    private static final Gson GSON = new Gson();
    private static final Type STRING_LIST = new TypeToken<List<String>>() {}.getType();

    public List<TravelPackage> getAllPackages() throws SQLException {
        List<TravelPackage> packages = new ArrayList<>();
        try (Connection connection = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = connection.prepareStatement(GET_PACKAGES_SQL);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                TravelPackage travelPackage = new TravelPackage();
                travelPackage.setId(rs.getLong("id"));
                travelPackage.setName(rs.getString("name"));
                travelPackage.setDestination(rs.getString("destination"));
                travelPackage.setPrice(rs.getBigDecimal("price"));
                travelPackage.setDuration(rs.getString("duration"));
                travelPackage.setImageUrl(rs.getString("image_url"));
                travelPackage.setIncludes(parseList(rs.getString("includes_json")));
                travelPackage.setHighlights(parseList(rs.getString("highlights_json")));
                packages.add(travelPackage);
            }
        }
        return packages;
    }

    private List<String> parseList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        List<String> values = GSON.fromJson(json, STRING_LIST);
        return values == null ? Collections.emptyList() : values;
    }
}
