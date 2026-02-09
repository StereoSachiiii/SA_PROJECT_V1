package com.bookfair.service;

import com.bookfair.dto.PublisherRequest;
import com.bookfair.entity.Publisher;
import com.bookfair.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService {
    
    private final PublisherRepository publisherRepository;
    
    public Publisher register(PublisherRequest request) {
        Publisher publisher = new Publisher();
        publisher.setBusinessName(request.getBusinessName());
        publisher.setEmail(request.getEmail());
        publisher.setContactPerson(request.getContactPerson());
        return publisherRepository.save(publisher);
    }
    
    public Publisher getById(Long id) {
        return publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));
    }
    
    public List<Publisher> getAll() {
        return publisherRepository.findAll();
    }
}
