package com.voyex.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class DBConnection {
    private static volatile DBConnection instance;
    private final String url;
    private final String username;
    private final String password;

    private DBConnection() {
        // Fix for "No suitable driver found"
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("CRITICAL: MySQL Driver not found!");
        }

        // Matching your Render keys exactly
        this.url = readEnv("DB_URL", "jdbc:mysql://root:CxbIrLxJvzPtWpgtulMSBzBzPydphPTA@mysql.railway.internal:3306/railway");
        this.username = readEnv("DB_USERNAME", "root"); 
        this.password = readEnv("DB_PASSWORD", "");
    }

    public static DBConnection getInstance() {
        if (instance == null) {
            synchronized (DBConnection.class) {
                if (instance == null) {
                    instance = new DBConnection();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    private String readEnv(String key, String fallback) {
        String value = System.getenv(key);
        return (value == null || value.isBlank()) ? fallback : value;
    }
}