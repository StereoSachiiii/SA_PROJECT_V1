package com.bookfair.service;

import com.bookfair.entity.Event;
import com.bookfair.entity.EventStall;
import com.bookfair.entity.StallTemplate;
import com.bookfair.repository.EventStallRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.anyList;

class PricingServiceTest {

    @Mock
    private EventStallRepository eventStallRepository;

    @Mock
    private com.bookfair.repository.MapInfluenceRepository mapInfluenceRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private PricingService pricingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        pricingService = new PricingService(eventStallRepository, mapInfluenceRepository, objectMapper);
    }

    @Test
    void calculatePriceBreakdown_ShouldApplyProximityBonus() throws Exception {
        // Arrange
        StallTemplate template = StallTemplate.builder()
                .defaultProximityScore(5)
                .posX(10.0).posY(10.0).width(10.0).height(10.0)
                .build();
        
        EventStall stall = EventStall.builder()
                .id(1L)
                .stallTemplate(template)
                .baseRateCents(100000L)
                .posX(10.0).posY(10.0).width(10.0).height(10.0)
                .build();

        List<com.bookfair.entity.MapInfluence> influences = List.of(
            com.bookfair.entity.MapInfluence.builder().type(com.bookfair.entity.MapInfluenceType.TRAFFIC).posX(10.0).posY(10.0).radius(20.0).intensity(80).falloff("linear").build()
        );

        // Act
        Map<String, Object> breakdown = pricingService.calculatePriceBreakdown(stall, influences);

        // Assert
        assertTrue(breakdown.containsKey("Visibility Score"));
        int score = (int) breakdown.get("calculatedScore");
        assertTrue(score > 5, "Score should be higher than minimum due to proximity");
        
        List<Map<String, Object>> drivers = (List<Map<String, Object>>) breakdown.get("Value Drivers");
        assertFalse(drivers.isEmpty());
        assertEquals("TRAFFIC Proximity", drivers.get(0).get("label"));
    }

    @Test
    void calculatePriceBreakdown_ShouldApplyEdgePenalty() throws Exception {
        // Arrange
        StallTemplate template = StallTemplate.builder().defaultProximityScore(5).build();
        EventStall stall = EventStall.builder()
                .id(1L)
                .stallTemplate(template)
                .baseRateCents(100000L)
                .posX(0.0).posY(10.0).width(10.0).height(10.0) // At edge
                .build();

        List<com.bookfair.entity.MapInfluence> influences = List.of();

        // Act
        Map<String, Object> breakdown = pricingService.calculatePriceBreakdown(stall, influences);

        // Assert
        List<Map<String, Object>> drivers = (List<Map<String, Object>>) breakdown.get("Value Drivers");
        boolean hasEdgePenalty = drivers.stream().anyMatch(d -> "Edge Distance".equals(d.get("label")));
        assertTrue(hasEdgePenalty);
    }

    @Test
    void recalculateEventPrices_ShouldUpdateStalls() throws Exception {
        // Arrange
        Long eventId = 101L;
        Event event = Event.builder().id(eventId).build();
        
        StallTemplate template = StallTemplate.builder().defaultProximityScore(5).id(1L).build();
        EventStall stall = EventStall.builder()
                .event(event)
                .stallTemplate(template)
                .baseRateCents(100000L)
                .multiplier(1.0)
                .posX(50.0).posY(50.0).width(10.0).height(10.0)
                .build();

        when(eventStallRepository.findByEvent_Id(eventId)).thenReturn(List.of(stall));

        // Act
        pricingService.recalculateEventPrices(eventId);

        // Assert
        verify(eventStallRepository, times(1)).saveAll(anyList());
        assertNotNull(stall.getPricingVersion());
        assertTrue(stall.getPricingVersion().startsWith("AUTO_V2_"));
    }
}
