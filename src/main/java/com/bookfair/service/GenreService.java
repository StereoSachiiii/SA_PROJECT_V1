package com.bookfair.service;

import com.bookfair.dto.request.GenreRequest;
import com.bookfair.entity.Genre;
import com.bookfair.entity.User;
import com.bookfair.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {
    
    private final GenreRepository genreRepository;
    private final UserService userService;
    
    public Genre addGenre(GenreRequest request) {
        User user = userService.getById(request.getUserId());
        
        Genre genre = new Genre();
        genre.setName(request.getName());
        genre.setUser(user);
        return genreRepository.save(genre);
    }
    
    public List<Genre> getByUser(Long userId) {
        return genreRepository.findByUserId(userId);
    }
}
