package com.bookfair.service;

import com.bookfair.dto.request.GenreRequest;
import com.bookfair.dto.response.GenreResponse;
import com.bookfair.entity.Genre;
import com.bookfair.entity.User;
import com.bookfair.entity.User.Role;
import com.bookfair.exception.BusinessLogicException;
import com.bookfair.exception.ResourceNotFoundException;
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
    public GenreResponse addGenre(GenreRequest request, String requesterUsername) {
        User requester = userService.getByUsernameForServices(requesterUsername);
        
        if (request.getUserId() != null && !request.getUserId().equals(requester.getId()) && requester.getRole() != Role.ADMIN) {
            throw new BusinessLogicException("Access denied: Cannot add genres for other users.");
        }
        
        Genre genre = new Genre();
        genre.setName(request.getName());
        genre.setUser(requester);
        genreRepository.save(genre);

        return new GenreResponse(genre.getId(), genre.getName());
    }
    
    public List<GenreResponse> getByUser(Long userId, String requesterUsername) {
        User requester = userService.getByUsernameForServices(requesterUsername);

        if (!requester.getId().equals(userId) && 
            requester.getRole() != Role.ADMIN && 
            requester.getRole() != Role.EMPLOYEE) {
            throw new BusinessLogicException("Access denied: Cannot view genres for other users");
        }

        return genreRepository.findByUserId(userId).stream()
                .map(genre -> new GenreResponse(genre.getId(), genre.getName()))
                .toList();
    }
}
