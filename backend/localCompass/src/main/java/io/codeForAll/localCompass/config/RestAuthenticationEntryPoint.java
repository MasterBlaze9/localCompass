package io.codeForAll.localCompass.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Returns a simple JSON 401 response instead of sending the WWW-Authenticate header
 * which triggers the browser's native login prompt.
 */
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        String body = String.format("{\"message\":\"%s\"}", "Unauthorized");
        response.getOutputStream().write(body.getBytes(StandardCharsets.UTF_8));
    }
}
