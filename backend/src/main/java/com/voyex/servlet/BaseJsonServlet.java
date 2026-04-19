package com.voyex.servlet;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public abstract class BaseJsonServlet extends HttpServlet {
    protected static final Gson GSON = new Gson();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Dynamic Origin Handling for CORS
        String origin = req.getHeader("Origin");
        
        // You can add your Vercel URL here specifically for better security
        if (origin != null) {
            resp.setHeader("Access-Control-Allow-Origin", origin);
        }
        
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Max-Age", "3600");

        // Important: Handle the "Pre-flight" OPTIONS request immediately
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Proceed to doPost, doGet, etc.
        super.service(req, resp);
    }

    protected void writeJson(HttpServletResponse response, int status, Object data) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GSON.toJson(data));
    }
}