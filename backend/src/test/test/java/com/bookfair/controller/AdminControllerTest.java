package com.bookfair.controller;

import com.bookfair.dto.request.EventStallUpdateRequest;
import com.bookfair.service.AdminService;
import com.bookfair.service.AdminHallService;
import com.bookfair.service.AdminStallService;
import com.bookfair.service.UserService;
import com.bookfair.repository.VenueRepository;
import com.bookfair.repository.BuildingRepository;
import com.bookfair.repository.HallRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    @MockBean
    private AdminHallService adminHallService;

    @MockBean
    private AdminStallService adminStallService;

    @MockBean
    private UserService userService;

    @MockBean
    private VenueRepository venueRepository;

    @MockBean
    private BuildingRepository buildingRepository;

    @MockBean
    private HallRepository hallRepository;

    @MockBean
    private com.bookfair.security.JwtUtils jwtUtils;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void saveEventLayout_ShouldReturnOk() throws Exception {
        EventStallUpdateRequest request = new EventStallUpdateRequest();
        request.setName("Test Stall");

        mockMvc.perform(post("/api/v1/admin/events/1/stalls")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(request))))
                .andExpect(status().isOk());

        verify(adminService).saveEventLayout(eq(1L), anyList());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateHallLayout_ShouldReturnOk() throws Exception {
        Map<String, String> payload = Map.of("staticLayout", "{\"data\":1}");

        mockMvc.perform(post("/api/v1/admin/halls/1/static-layout")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.updated").value(true));

        verify(adminService).updateHallLayout(eq(1L), eq("{\"data\":1}"));
    }
}
