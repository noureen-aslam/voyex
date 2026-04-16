package com.voyex.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@WebServlet(name = "FrontendServlet", urlPatterns = "/")
public class FrontendServlet extends HttpServlet {
    private Path frontendRoot;

    @Override
    public void init() throws ServletException {
        String distDir = System.getenv("FRONTEND_DIST_DIR");
        if (distDir == null || distDir.isBlank()) {
            distDir = "../dist";
        }
        frontendRoot = Paths.get(distDir).toAbsolutePath().normalize();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String relativePath = request.getRequestURI().substring(request.getContextPath().length());
        if (relativePath.isBlank() || "/".equals(relativePath)) {
            relativePath = "/index.html";
        }

        Path filePath = frontendRoot.resolve(relativePath.substring(1)).normalize();
        if (!filePath.startsWith(frontendRoot) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
            filePath = frontendRoot.resolve("index.html");
        }

        if (!Files.exists(filePath)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "React build not found.");
            return;
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = getServletContext().getMimeType(filePath.getFileName().toString());
        }
        response.setContentType(contentType == null ? "application/octet-stream" : contentType);

        try (InputStream input = Files.newInputStream(filePath)) {
            input.transferTo(response.getOutputStream());
        }
    }
}
