package com.voyex.servlet;

import com.voyex.dao.TravelPackageDao;
import com.voyex.model.TravelPackage;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "PackageServlet", urlPatterns = "/api/packages")
public class PackageServlet extends BaseJsonServlet {
    private final TravelPackageDao travelPackageDao = new TravelPackageDao();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            List<TravelPackage> packages = travelPackageDao.getAllPackages();
            writeJson(response, HttpServletResponse.SC_OK, Map.of("packages", packages));
        } catch (SQLException ex) {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    Map.of("message", "Unable to load travel packages."));
        }
    }
}
