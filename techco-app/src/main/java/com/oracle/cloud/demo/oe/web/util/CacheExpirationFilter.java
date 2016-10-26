package com.oracle.cloud.demo.oe.web.util;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * Set cache expiration for static resources. Used because "com.sun.faces.defaultResourceMaxAge"
 * doesn't seem to work in WebLogic.
 */
@WebFilter(value = "/javax.faces.resource/*")
public class CacheExpirationFilter implements Filter {
    private static final Logger logger = Logger.getLogger(CacheExpirationFilter.class.getName());
    private static final String CACHE_CONTROL = "Cache-Control";
    private static final String EXPIRES = "Expires";
    private static final String PRAGMA = "Pragma";
    private FilterConfig filterConfig;

    @Override
    public void init(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // future date by 12 hours
        long expiration = 12*60*60*1000;
        httpResponse.setHeader(CACHE_CONTROL, "public, max-age="+expiration);
        httpResponse.setDateHeader(EXPIRES, System.currentTimeMillis()+expiration);

        // get rid of pragma
        chain.doFilter(request, new HttpServletResponseWrapper(httpResponse) {
            @Override
            public void addHeader(String name, String value) {
                if (!PRAGMA.equalsIgnoreCase(name)) {
                    super.addHeader(name, value);
                }
            }
            @Override
            public void setHeader(String name, String value) {
                if (!PRAGMA.equalsIgnoreCase(name)) {
                    super.setHeader(name, value);
                }
            }
        });
    }
}
