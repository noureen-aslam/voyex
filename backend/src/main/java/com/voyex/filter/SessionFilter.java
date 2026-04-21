package com.voyex.filter;

import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

@WebFilter(urlPatterns = {"/api/trips", "/api/trips/*"})
public class SessionFilter implements Filter {
    private static final Gson GSON = new Gson();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Always let OPTIONS through with CORS headers
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setHeader("Access-Control-Allow-Origin", httpRequest.getHeader("Origin"));
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpResponse.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        HttpSession session = httpRequest.getSession(false);
        Object userId = session == null ? null : session.getAttribute("userId");
        if (userId == null) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.setContentType("application/json");
            httpResponse.setCharacterEncoding("UTF-8");
            httpResponse.getWriter().write(GSON.toJson(Map.of("message", "Unauthorized")));
            return;
        }

        chain.doFilter(request, response);
    }
}
