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
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found!");
        }

        // Railway provides MYSQL_PUBLIC_URL (e.g. mysql://user:pass@host:port/db)
        String publicUrl = readEnv("MYSQL_PUBLIC_URL",
            "mysql://root:password@localhost:3306/railway");

        // Convert to JDBC format
        this.url = publicUrl.replace("mysql://", "jdbc:mysql://");

        // Extract credentials from the URL
        this.username = extractUser(publicUrl);
        this.password = extractPassword(publicUrl);
    }

    public static DBConnection getInstance() {
        if (instance == null) {
            synchronized (DBConnection.class) {
                if (instance == null) instance = new DBConnection();
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

    private String extractUser(String url) {
        // mysql://user:pass@host:port/db
        String creds = url.split("@")[0].replace("mysql://", "");
        return creds.split(":")[0];
    }

    private String extractPassword(String url) {
        String creds = url.split("@")[0].replace("mysql://", "");
        return creds.split(":")[1];
    }
}
