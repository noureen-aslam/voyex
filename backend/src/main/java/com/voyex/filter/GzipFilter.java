package com.voyex.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.WriteListener;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPOutputStream;

@WebFilter("/*")
public class GzipFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String acceptsEncoding = httpRequest.getHeader("Accept-Encoding");
        if (acceptsEncoding == null || !acceptsEncoding.contains("gzip")) {
            chain.doFilter(request, response);
            return;
        }

        GzipResponseWrapper gzipResponseWrapper = new GzipResponseWrapper(httpResponse);
        gzipResponseWrapper.setHeader("Content-Encoding", "gzip");
        gzipResponseWrapper.addHeader("Vary", "Accept-Encoding");
        chain.doFilter(request, gzipResponseWrapper);
        gzipResponseWrapper.finish();
    }

    private static class GzipResponseWrapper extends HttpServletResponseWrapper {
        private GzipServletOutputStream gzipOutputStream;
        private PrintWriter writer;

        GzipResponseWrapper(HttpServletResponse response) {
            super(response);
        }

        @Override
        public ServletOutputStream getOutputStream() throws IOException {
            if (writer != null) {
                throw new IllegalStateException("Writer already in use");
            }
            if (gzipOutputStream == null) {
                gzipOutputStream = new GzipServletOutputStream(getResponse().getOutputStream());
            }
            return gzipOutputStream;
        }

        @Override
        public PrintWriter getWriter() throws IOException {
            if (gzipOutputStream != null) {
                throw new IllegalStateException("OutputStream already in use");
            }
            if (writer == null) {
                gzipOutputStream = new GzipServletOutputStream(getResponse().getOutputStream());
                writer = new PrintWriter(new OutputStreamWriter(gzipOutputStream, StandardCharsets.UTF_8));
            }
            return writer;
        }

        void finish() throws IOException {
            if (writer != null) {
                writer.close();
            } else if (gzipOutputStream != null) {
                gzipOutputStream.close();
            }
        }
    }

    private static class GzipServletOutputStream extends ServletOutputStream {
        private final GZIPOutputStream gzipOutputStream;

        GzipServletOutputStream(ServletOutputStream outputStream) throws IOException {
            this.gzipOutputStream = new GZIPOutputStream(outputStream, true);
        }

        @Override
        public void write(int b) throws IOException {
            gzipOutputStream.write(b);
        }

        @Override
        public void flush() throws IOException {
            gzipOutputStream.flush();
        }

        @Override
        public void close() throws IOException {
            gzipOutputStream.finish();
            gzipOutputStream.close();
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setWriteListener(WriteListener writeListener) {
        }
    }
}
