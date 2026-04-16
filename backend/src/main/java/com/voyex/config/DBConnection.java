package com.voyex.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class DBConnection {
    private static volatile DBConnection instance;
    private final String url;

    private DBConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found!");
        }

        // Railway provides MYSQL_PUBLIC_URL (e.g. mysql://user:pass@host:port/db)
        String publicUrl = readEnv("MYSQL_PUBLIC_URL",
            "mysql://root:password@localhost:3306/railway");

        // Convert to JDBC format (JDBC understands embedded user/pass)
        this.url = publicUrl.replace("mysql://", "jdbc:mysql://");
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
        // JDBC URL already contains user, password, host, port, and db
        return DriverManager.getConnection(url);
    }

    private String readEnv(String key, String fallback) {
        String value = System.getenv(key);
        return (value == null || value.isBlank()) ? fallback : value;
    }
}
