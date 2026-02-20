package com.bookfair.service;

import com.bookfair.entity.*;
import com.bookfair.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.bookfair.constant.LayoutConstants;
import static com.bookfair.constant.PricingConstants.*;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Service dedicated to seeding the database with initial data.
 * Extracted from StallService to improve code quality and separation of concerns.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final BuildingRepository buildingRepository;
    private final HallRepository hallRepository;
    private final EventRepository eventRepository;
    private final StallTemplateRepository stallTemplateRepository;
    private final EventStallRepository eventStallRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.seed.admin.username}")
    private String adminUsername;

    @org.springframework.beans.factory.annotation.Value("${app.seed.admin.password}")
    private String adminPassword;

    @org.springframework.beans.factory.annotation.Value("${app.seed.vendor.username}")
    private String vendorUsername;

    @org.springframework.beans.factory.annotation.Value("${app.seed.vendor.password}")
    private String vendorPassword;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        if (stallTemplateRepository.count() > 0) {
            log.info(">>> Data already exists. Updating existing entities...");
            updateExistingLayouts(); // V4.5 logic
            updateExistingEvents();  // Inject sample images
            return;
        }

        log.info(">>> STARTING FRESH DATA SEEDING...");
        
        seedUsers();
        Venue bmich = seedVenueAndBuildings();
        Hall mainHall = seedHalls(bmich);
        Event event = seedEvent(bmich);
        seedStallsAndReservations(mainHall, event);
        
        seedComplexSLECC();

        log.info(">>> DATA SEEDING COMPLETED.");
    }

    private void seedUsers() {
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User u = new User();
            u.setUsername(adminUsername);
            u.setPassword(passwordEncoder.encode(adminPassword));
            u.setEmail("admin@bookfair.com");
            u.setRole(User.Role.ADMIN);
            u.setBusinessName("Bookfair Admin Team");
            userRepository.save(u);
        }

        if (userRepository.findByUsername(vendorUsername).isEmpty()) {
            User u = new User();
            u.setUsername(vendorUsername);
            u.setPassword(passwordEncoder.encode(vendorPassword));
            u.setEmail("vendor@publisher.com");
            u.setRole(User.Role.VENDOR);
            u.setBusinessName("Global Publishing House");
            u.setCategories(Set.of(PublisherCategory.FICTION, PublisherCategory.ACADEMIC));
            userRepository.save(u);
        }
    }

    private Venue seedVenueAndBuildings() {
        Venue bmich = new Venue();
        bmich.setName("BMICH");
        bmich.setAddress("Bauddhaloka Mawatha, Colombo 07");
        bmich = venueRepository.save(bmich);

        Building mainBuilding = new Building();
        mainBuilding.setName("Main Atrium");
        mainBuilding.setVenue(bmich);
        mainBuilding.setGpsCoordinates("7.2, 80.6");
        buildingRepository.save(mainBuilding);
        
        return bmich;
    }

    private Hall seedHalls(Venue venue) {
        Building mainBuilding = buildingRepository.findAll().stream()
            .filter(b -> b.getVenue().getId().equals(venue.getId()))
            .findFirst().orElseThrow();

        Hall mainHall = new Hall();
        mainHall.setName("Sirimavo Bandaranaike Memorial Exhibition Centre");
        mainHall.setBuilding(mainBuilding);
        mainHall.setMainCategory(PublisherCategory.FICTION);
        mainHall.setStaticLayout(LayoutConstants.SIRIMAVO_LAYOUT);
        return hallRepository.save(mainHall);
    }

    private Event seedEvent(Venue venue) {
        Event defaultEvent = new Event();
        defaultEvent.setName("Colombo Book Fair 2026");
        defaultEvent.setDescription("The largest annual book exhibition in South Asia.");
        defaultEvent.setStartDate(java.time.LocalDateTime.now().plusDays(30));
        defaultEvent.setEndDate(java.time.LocalDateTime.now().plusDays(35));
        defaultEvent.setLocation("BMICH");
        defaultEvent.setVenue(venue);
        defaultEvent.setStatus(Event.EventStatus.OPEN);
        defaultEvent.setImageUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop");
        return eventRepository.save(defaultEvent);
    }

    private void seedStallsAndReservations(Hall mainHall, Event event) {
        User vendorUser = userRepository.findByUsername(vendorUsername).orElseThrow();

        for (int row = 0; row < 10; row++) {
            for (int col = 0; col < 10; col++) {
                if (col == 3 || col == 7) continue;

                String name = (char)('A' + row) + String.format("%02d", col + 1);
                int proximity = 10 - Math.abs(5 - col) - Math.abs(4 - row);
                if (proximity < 1) proximity = 1;
                
                StallTemplate template = new StallTemplate();
                template.setName(name);
                template.setHall(mainHall);
                template.setDefaultProximityScore(proximity);
                template.setGeometry(String.format("{\"x\": %d, \"y\": %d, \"w\": 10, \"h\": 10}", col * 10, row * 10));

                if (proximity >= 9) {
                    template.setSize(StallSize.LARGE);
                    template.setType(StallType.PREMIUM);
                } else if (proximity >= 7) {
                    template.setSize(StallSize.MEDIUM);
                    template.setType(StallType.PREMIUM);
                } else if (proximity >= 5) {
                    template.setSize(StallSize.MEDIUM);
                    template.setType(StallType.STANDARD);
                } else {
                    template.setSize(StallSize.SMALL);
                    template.setType(StallType.STANDARD);
                }
                template = stallTemplateRepository.save(template);

                long basePrice = (template.getSize() == StallSize.SMALL) ? STALL_SMALL_PRICE : 
                                (template.getSize() == StallSize.MEDIUM) ? STALL_MEDIUM_PRICE : STALL_LARGE_PRICE;
                long proximityBonus = (basePrice * (proximity - 1) * 5 / 100);
                long finalPrice = basePrice + proximityBonus;

                EventStall eventStall = new EventStall();
                eventStall.setEvent(event);
                eventStall.setStallTemplate(template);
                eventStall.setBaseRateCents(basePrice);
                eventStall.setMultiplier(1.0);
                eventStall.setProximityBonusCents(proximityBonus);
                eventStall.setFinalPriceCents(finalPrice);
                eventStall = eventStallRepository.save(eventStall);

                if ((row == 4 || row == 5) && (col == 4 || col == 5)) {
                    createSampleReservation(eventStall, vendorUser, name);
                }
            }
        }
    }

    private void createSampleReservation(EventStall eventStall, User user, String stallName) {
        try {
            Reservation res = new Reservation();
            res.setUser(user);
            res.setEventStall(eventStall);
            res.setQrCode("SAMPLE-QR-" + stallName);
            res.setStatus(Reservation.ReservationStatus.PAID);
            res.setEmailSent(true);
            reservationRepository.save(res);
        } catch (Exception e) {
            log.warn("Failed to create sample reservation: " + e.getMessage());
        }
    }

    private void seedComplexSLECC() {
        if (eventRepository.findByName("International Stationery & Gift Fair 2026").isPresent()) {
            return;
        }
        
        log.info(">>> STARTING SLECC (COMPLEX) SEEDING...");
        
        Venue slecc = venueRepository.findByName("SLECC").orElseGet(() -> {
            Venue v = new Venue();
            v.setName("SLECC");
            v.setAddress("D. R. Wijewardena Mawatha, Colombo 10");
            return venueRepository.save(v);
        });

        Building sleccMain = buildingRepository.save(Building.builder()
            .name("Convention Hall A")
            .venue(slecc)
            .gpsCoordinates("6.9271, 79.8517")
            .build());

        Hall sleccHall1 = hallRepository.save(Hall.builder()
            .name("Main Exhibition Hall")
            .building(sleccMain)
            .mainCategory(PublisherCategory.ACADEMIC)
            .staticLayout(LayoutConstants.SLECC_MAIN_LAYOUT)
            .build());

        Hall sleccHall2 = hallRepository.save(Hall.builder()
            .name("Annex Wing")
            .building(sleccMain)
            .mainCategory(PublisherCategory.CHILDREN)
            .build());

        Event complexEvent = new Event();
        complexEvent.setName("International Stationery & Gift Fair 2026");
        complexEvent.setDescription("A non-trivial layout event at SLECC.");
        complexEvent.setStartDate(java.time.LocalDateTime.now().plusDays(45));
        complexEvent.setEndDate(java.time.LocalDateTime.now().plusDays(50));
        complexEvent.setLocation("SLECC, Colombo");
        complexEvent.setVenue(slecc);
        complexEvent.setStatus(Event.EventStatus.UPCOMING);
        complexEvent.setImageUrl("https://images.unsplash.com/photo-1596522354195-e84ae3c98731?q=80&w=2067&auto=format&fit=crop");
        complexEvent.setLayoutConfig("{\"mapUrl\": \"https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop\", \"width\": 1000, \"height\": 600}");
        complexEvent = eventRepository.save(complexEvent);

        // Circular Cluster
        double centerX = 50;
        double centerY = 50;
        double radius = 30;

        for (int i = 0; i < 12; i++) {
            double angle = Math.toRadians(i * (360.0 / 12.0));
            double x = centerX + radius * Math.cos(angle) - 5;
            double y = centerY + radius * Math.sin(angle) - 5;

            StallTemplate st = new StallTemplate();
            st.setName("S-" + (i + 1));
            st.setHall(sleccHall1);
            st.setDefaultProximityScore(8);
            st.setSize(StallSize.MEDIUM);
            st.setType(StallType.STANDARD);
            st = stallTemplateRepository.save(st);

            EventStall es = new EventStall();
            es.setEvent(complexEvent);
            es.setStallTemplate(st);
            es.setBaseRateCents(SLECC_MEDIUM_PRICE);
            es.setMultiplier(1.0);
            es.setProximityBonusCents(0L);
            es.setFinalPriceCents(SLECC_MEDIUM_PRICE);
            es.setGeometry(String.format("{\"x\": %.1f, \"y\": %.1f, \"w\": 10, \"h\": 10}", x, y));
            eventStallRepository.save(es);
        }

        // Central Premium
        StallTemplate centerTempl = new StallTemplate();
        centerTempl.setName("VIP-01");
        centerTempl.setHall(sleccHall1);
        centerTempl.setDefaultProximityScore(10);
        centerTempl.setSize(StallSize.LARGE);
        centerTempl.setType(StallType.PREMIUM);
        centerTempl = stallTemplateRepository.save(centerTempl);

        EventStall centerEs = new EventStall();
        centerEs.setEvent(complexEvent);
        centerEs.setStallTemplate(centerTempl);
        centerEs.setBaseRateCents(SLECC_VIP_PRICE);
        centerEs.setMultiplier(VIP_MULTIPLIER);
        centerEs.setProximityBonusCents(500000L);
        centerEs.setFinalPriceCents((long) (SLECC_VIP_PRICE * VIP_MULTIPLIER)); // Example logic
        centerEs.setGeometry("{\"x\": 42.5, \"y\": 42.5, \"w\": 15, \"h\": 15}");
        eventStallRepository.save(centerEs);
        
        seedAnnexWing(sleccHall2, complexEvent);
        
        log.info(">>> SLECC SEEDING COMPLETED.");
    }

    private void seedAnnexWing(Hall sleccHall2, Event complexEvent) {
        // Seed "Annex Wing" (SLECC) with a simpler staggered layout
        for (int i = 0; i < 6; i++) {
             StallTemplate st = new StallTemplate();
             st.setName("AX-" + (i + 1));
             st.setHall(sleccHall2);
             st.setDefaultProximityScore(5);
             st.setSize(StallSize.SMALL);
             st.setType(StallType.STANDARD);
             st = stallTemplateRepository.save(st);

             EventStall es = new EventStall();
             es.setEvent(complexEvent);
             es.setStallTemplate(st);
             es.setBaseRateCents(SLECC_ANNEX_PRICE);
             es.setMultiplier(1.0);
             es.setProximityBonusCents(0L);
             es.setFinalPriceCents(SLECC_ANNEX_PRICE);
             es.setGeometry(String.format("{\"x\": %d, \"y\": %d, \"w\": 8, \"h\": 8}", 10 + (i * 15), (i % 2 == 0) ? 20 : 60));
             eventStallRepository.save(es);
        }
    }

    private void updateExistingEvents() {
        eventRepository.findAll().forEach(event -> {
            boolean changed = false;
            // Banner for Book Fair
            if (event.getName().contains("Book Fair") && event.getImageUrl() == null) {
                event.setImageUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop");
                changed = true;
            }
            // Banner for SLECC Stationery
            if (event.getName().contains("Stationery") && event.getImageUrl() == null) {
                event.setImageUrl("https://images.unsplash.com/photo-1596522354195-e84ae3c98731?q=80&w=2067&auto=format&fit=crop");
                changed = true;
            }
            // Venue Layout Aerial View for SLECC event
            if (event.getName().contains("Stationery") && event.getLayoutConfig() == null) {
                event.setLayoutConfig("{\"mapUrl\": \"https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop\", \"width\": 1000, \"height\": 600}");
                changed = true;
            }
            if (changed) {
                eventRepository.save(event);
                log.info(">>> Updated event '{}' with sample imagery.", event.getName());
            }
        });
    }

    private void updateExistingLayouts() {
        hallRepository.findAll().forEach(hall -> {
            if ("Sirimavo Bandaranaike Memorial Exhibition Centre".equals(hall.getName())) {
                log.info(">>> REFRESHING BUILDING LAYOUT FOR: " + hall.getName());
                hall.setStaticLayout(LayoutConstants.SIRIMAVO_LAYOUT);
                hallRepository.save(hall);
            }
            if ("Main Exhibition Hall".equals(hall.getName())) {
                log.info(">>> REFRESHING BUILDING LAYOUT FOR: " + hall.getName());
                hall.setStaticLayout(LayoutConstants.MAIN_HALL_LAYOUT);
                hallRepository.save(hall);
            }
        });
    }

}
