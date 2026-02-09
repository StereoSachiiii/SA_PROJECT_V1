package com.bookfair.service;

import com.bookfair.dto.GenreRequest;
import com.bookfair.entity.Genre;
import com.bookfair.entity.Publisher;
import com.bookfair.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {
    
    private final GenreRepository genreRepository;
    private final PublisherService publisherService;
    
    public Genre addGenre(GenreRequest request) {
        Publisher publisher = publisherService.getById(request.getPublisherId());
        
        Genre genre = new Genre();
        genre.setName(request.getName());
        genre.setPublisher(publisher);
        return genreRepository.save(genre);
    }
    
    public List<Genre> getByPublisher(Long publisherId) {
        return genreRepository.findByPublisherId(publisherId);
    }
}
