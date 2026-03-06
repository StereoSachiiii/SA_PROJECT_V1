package com.bookfair.service;

import com.bookfair.entity.*;
import com.bookfair.repository.*;
import com.bookfair.repository.MapInfluenceRepository;
import com.bookfair.features.reservation.Reservation;
import com.bookfair.features.reservation.ReservationRepository;
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
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

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
    private final PhysicalConstraintRepository physicalConstraintRepository;
    private final MapInfluenceRepository mapInfluenceRepository;

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
        mainBuilding.setGpsLocation("7.2, 80.6");
        buildingRepository.save(mainBuilding);
        
        return bmich;
    }

    private Hall seedHalls(Venue venue) {
        Building mainBuilding = buildingRepository.findAll().stream()
            .filter(b -> b.getVenue().getId().equals(venue.getId()))
            .findFirst().orElseThrow();


        Hall mainHall = Hall.builder()
            .name("Sirimavo Bandaranaike Hall")
            .building(mainBuilding)
            .totalSqFt(15000.0)
            .capacity(100)
            .tier(HallTier.FLAGSHIP)
            .floorLevel(1)
            .status(HallStatus.PUBLISHED)
            .build();
        mainHall.setMainCategory(PublisherCategory.FICTION);
        mainHall = hallRepository.save(mainHall);
        
        seedPhysicalConstraints(mainHall, LayoutConstants.SIRIMAVO_CONSTRAINTS);
        return mainHall;
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
        defaultEvent = eventRepository.save(defaultEvent);

        seedMapInfluences(defaultEvent, "Sirimavo Bandaranaike Hall");
        
        return defaultEvent;
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
                template.setPosX((double)(col * 10));
                template.setPosY((double)(row * 10));
                template.setWidth(10.0);
                template.setHeight(10.0);

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
            .gpsLocation("6.9271, 79.8517")
            .build());

        Hall sleccHall1 = hallRepository.save(Hall.builder()
            .name("Main Exhibition Hall")
            .building(sleccMain)
            .mainCategory(PublisherCategory.ACADEMIC)
            .build());
            
        seedPhysicalConstraints(sleccHall1, LayoutConstants.SLECC_CONSTRAINTS);

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
        complexEvent.setMapUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop");
        complexEvent.setMapWidth(1000.0);
        complexEvent.setMapHeight(600.0);
        complexEvent = eventRepository.save(complexEvent);

        seedMapInfluences(complexEvent, "Main Exhibition Hall");

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
            es.setPosX(x);
            es.setPosY(y);
            es.setWidth(10.0);
            es.setHeight(10.0);
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
        centerEs.setPosX(42.5);
        centerEs.setPosY(42.5);
        centerEs.setWidth(15.0);
        centerEs.setHeight(15.0);
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
             es.setPosX((double)(10 + (i * 15)));
             es.setPosY((double)((i % 2 == 0) ? 20 : 60));
             es.setWidth(8.0);
             es.setHeight(8.0);
             eventStallRepository.save(es);
        }
        
        seedPhysicalConstraints(sleccHall2, java.util.Arrays.asList(
            PhysicalConstraint.builder().type(PhysicalConstraintType.ENTRANCE).posX(45.0).posY(0.0).width(10.0).height(4.0).label("ANNEX ENTRY").build(),
            PhysicalConstraint.builder().type(PhysicalConstraintType.FIRE_EXIT).posX(98.0).posY(50.0).width(2.0).height(8.0).label("EXIT").build()
        ));
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
            if (event.getName().contains("Stationery") && event.getMapUrl() == null) {
                event.setMapUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop");
                event.setMapWidth(1000.0);
                event.setMapHeight(600.0);
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
            if ("Sirimavo Bandaranaike Memorial Exhibition Centre".equals(hall.getName()) && hall.getConstraints().isEmpty()) {
                seedPhysicalConstraints(hall, LayoutConstants.SIRIMAVO_CONSTRAINTS);
            }
            if ("Main Exhibition Hall".equals(hall.getName()) && hall.getConstraints().isEmpty()) {
                seedPhysicalConstraints(hall, LayoutConstants.SLECC_CONSTRAINTS);
            }
            if ("Annex Wing".equals(hall.getName()) && hall.getConstraints().isEmpty()) {
                seedPhysicalConstraints(hall, java.util.Arrays.asList(
                    PhysicalConstraint.builder().type(PhysicalConstraintType.ENTRANCE).posX(45.0).posY(0.0).width(10.0).height(4.0).label("ANNEX ENTRY").build(),
                    PhysicalConstraint.builder().type(PhysicalConstraintType.FIRE_EXIT).posX(98.0).posY(50.0).width(2.0).height(8.0).label("EXIT").build()
                ));
            }
        });

        eventRepository.findAll().forEach(event -> {
            // Find a representing hall name for this event to seed influences
            eventStallRepository.findByEvent_Id(event.getId()).stream()
                .findFirst()
                .map(es -> es.getStallTemplate().getHall().getName())
                .ifPresent(hallName -> seedMapInfluences(event, hallName));
        });

        migrateStallCoordinates();
    }

    private void migrateStallCoordinates() {
        log.info(">>> Checking for stall templates needing coordinate migration...");
        
        java.util.Map<Long, List<StallTemplate>> missingByHall = stallTemplateRepository.findAll().stream()
            .filter(t -> t.getPosX() == null || t.getPosY() == null)
            .collect(Collectors.groupingBy(t -> t.getHall().getId()));

        if (missingByHall.isEmpty()) {
            log.info(">>> No stalls need coordinate migration.");
            return;
        }

        missingByHall.forEach((hallId, stalls) -> {
            log.info(">>> Migrating {} stalls for hall ID {} to grid layout...", stalls.size(), hallId);
            for (int i = 0; i < stalls.size(); i++) {
                StallTemplate t = stalls.get(i);
                int row = i / 10; 
                int col = i % 10;
                
                // Simple 10x10% grid placement
                t.setPosX((double)(col * 10));
                t.setPosY((double)(row * 10));
                t.setWidth(9.0);
                t.setHeight(9.0);
                stallTemplateRepository.save(t);
            }
        });
    }

    private void seedPhysicalConstraints(Hall hall, List<PhysicalConstraint> constraints) {
        if (constraints == null) return;
        constraints.forEach(c -> {
            c.setHall(hall);
            physicalConstraintRepository.save(c);
        });
    }

    private void seedMapInfluences(Event event, String hallName) {
        if (mapInfluenceRepository.findByEvent_Id(event.getId()).isEmpty()) {
            log.info(">>> Seeding Map Influences for event: {}", event.getName());
            
            // Influence 1: Main Entrance (High Traffic)
            mapInfluenceRepository.save(MapInfluence.builder()
                    .event(event)
                    .hallName(hallName)
                    .type(MapInfluenceType.TRAFFIC)
                    .posX(45.0)
                    .posY(5.0)
                    .radius(25.0)
                    .intensity(80)
                    .falloff("LINEAR")
                    .build());

            // Influence 2: Food Court (Medium Traffic / Noise)
            mapInfluenceRepository.save(MapInfluence.builder()
                    .event(event)
                    .hallName(hallName)
                    .type(MapInfluenceType.TRAFFIC)
                    .posX(90.0)
                    .posY(50.0)
                    .radius(20.0)
                    .intensity(60)
                    .falloff("LINEAR")
                    .build());

            // Influence 3: Information Desk (Service Facility)
            mapInfluenceRepository.save(MapInfluence.builder()
                    .event(event)
                    .hallName(hallName)
                    .type(MapInfluenceType.FACILITY)
                    .posX(10.0)
                    .posY(10.0)
                    .radius(15.0)
                    .intensity(50)
                    .falloff("LINEAR")
                    .build());
        }
    }

}
