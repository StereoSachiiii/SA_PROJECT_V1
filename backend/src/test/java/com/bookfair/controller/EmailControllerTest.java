package com.bookfair.controller;

import com.bookfair.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.security.test.context.support.WithMockUser;

@WebMvcTest(EmailController.class)
public class EmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;

    @MockBean
    private com.bookfair.security.JwtUtils jwtUtils;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void sendTest_shouldReturnOkAndInvokeService() throws Exception {
        String address = "foo@bar.com";
        doNothing().when(emailService).sendTestEmail(address);

        mockMvc.perform(get("/api/email/test").param("to", address))
                .andExpect(status().isOk())
                .andExpect(content().string("Test email sent to " + address));
    }
}
