package com.bookfair.repository;

import com.bookfair.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Reservation r JOIN FETCH r.stall JOIN FETCH r.user WHERE r.user.id = :userId")
    List<Reservation> findByUserId(Long userId);

    @Override
    @NonNull
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Reservation r JOIN FETCH r.stall JOIN FETCH r.user")
    List<Reservation> findAll();
    
    Optional<Reservation> findByQrCode(String qrCode);
    
    long countByUserId(Long userId);

}
