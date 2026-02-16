package com.bookfair.service;

import com.bookfair.dto.request.GenreRequest;
import com.bookfair.dto.response.GenreResponse;
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
    
    /**
     * Add a genre to a user's listing.
     *
     * Uses userId from the request body (not SecurityContext) because:
     * 1. Auth is currently permitAll() so SecurityContext is always "anonymousUser"
     * 2. The frontend already sends userId in the request body
     *
     * TODO: Once JWT auth is enforced, switch to SecurityContext-based user lookup
     *       and remove userId from GenreRequest.
     */
    public GenreResponse addGenre(GenreRequest request) {
        if (request.getUserId() == null) {
            throw new RuntimeException("userId is required");
        }
        
        User user = userService.getByIdForServices(request.getUserId());
        
        Genre genre = new Genre();
        genre.setName(request.getName());
        genre.setUser(user);
        genreRepository.save(genre);

        return new GenreResponse(genre.getId(), genre.getName());
    }
    
    public List<GenreResponse> getByUser(Long userId) {
        return genreRepository.findByUserId(userId).stream()
                .map(genre -> new GenreResponse(genre.getId(), genre.getName()))
                .toList();
    }
}
