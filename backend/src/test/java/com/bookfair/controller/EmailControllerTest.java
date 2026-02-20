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

@WebMvcTest(EmailController.class)
public class EmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;

    @Test
    void sendTest_shouldReturnOkAndInvokeService() throws Exception {
        String address = "foo@bar.com";
        doNothing().when(emailService).sendTestEmail(address);

        mockMvc.perform(get("/api/email/test").param("to", address))
                .andExpect(status().isOk())
                .andExpect(content().string("Test email sent to " + address));
    }
}
