package com.bookfair.service;

import com.bookfair.dto.request.EventStallUpdateRequest;
import com.bookfair.entity.*;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private EventStallRepository eventStallRepository;
    @Mock
    private StallTemplateRepository stallTemplateRepository;
    @Mock
    private HallRepository hallRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AdminService adminService;

    private Event testEvent;
    private Hall testHall;

    @BeforeEach
    void setUp() {
        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setName("Test Event");

        testHall = new Hall();
        testHall.setId(1L);
        testHall.setName("Main Hall");
    }

    @Test
    void saveEventLayout_ShouldUpdateExistingStall() {
        // Arrange
        EventStall existingStall = new EventStall();
        existingStall.setId(10L);
        existingStall.setStallTemplate(new StallTemplate());
        existingStall.getStallTemplate().setName("Old Name");

        EventStallUpdateRequest updateReq = new EventStallUpdateRequest();
        updateReq.setId(10L);
        updateReq.setName("New Name");
        updateReq.setGeometry("{\"x\":10}");

        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(eventStallRepository.findById(10L)).thenReturn(Optional.of(existingStall));

        // Act
        adminService.saveEventLayout(1L, List.of(updateReq));

        // Assert
        assertThat(existingStall.getGeometry()).isEqualTo("{\"x\":10}");
        assertThat(existingStall.getStallTemplate().getName()).isEqualTo("New Name");
        verify(eventStallRepository).saveAll(any());
    }

    @Test
    void saveEventLayout_ShouldCreateNewStall() {
        // Arrange
        EventStallUpdateRequest createReq = new EventStallUpdateRequest();
        createReq.setName("New Stall");
        createReq.setHallName("Main Hall");
        createReq.setGeometry("{\"x\":20}");

        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(hallRepository.findByName("Main Hall")).thenReturn(Optional.of(testHall));
        when(stallTemplateRepository.save(any(StallTemplate.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        adminService.saveEventLayout(1L, List.of(createReq));

        // Assert
        verify(stallTemplateRepository).save(any(StallTemplate.class));
        verify(eventStallRepository).saveAll(any());
    }

    @Test
    void saveEventLayout_ShouldThrowIfEventNotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminService.saveEventLayout(1L, List.of()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Event not found");
    }

    @Test
    void updateHallLayout_ShouldUpdateStaticLayout() {
        // Arrange
        when(hallRepository.findById(1L)).thenReturn(Optional.of(testHall));

        // Act
        adminService.updateHallLayout(1L, "{\"layout\":\"data\"}");

        // Assert
        assertThat(testHall.getStaticLayout()).isEqualTo("{\"layout\":\"data\"}");
        verify(hallRepository).save(testHall);
    }
}
