package com.oracle.cloud.demo.oe.web.util;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Enumeration;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Temporary workaround for JSF state replication issue.
 */
@WebFilter(value = "/*")
public class JsfFilter implements Filter {
    private static final Logger logger = Logger.getLogger(JsfFilter.class.getName());
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
        try {
            chain.doFilter(request, response);
        } catch (IOException | ServletException t) {
            logger.log(Level.SEVERE, "An exception occured on JSFFilter chain", t);
        }
        HttpSession session = ((HttpServletRequest) request).getSession();
        Enumeration<String> atts = session.getAttributeNames();
        while (atts.hasMoreElements()) {
            String att = atts.nextElement();
            Object value = session.getAttribute(att);
            session.setAttribute(att, value);
        }
    }
}
