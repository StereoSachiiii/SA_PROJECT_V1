package com.bookfair.service;

import com.bookfair.dto.request.GenreRequest;
import com.bookfair.dto.response.GenreResponse;
import com.bookfair.entity.Genre;
import com.bookfair.entity.User;
import com.bookfair.repository.GenreRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {
    
    private final GenreRepository genreRepository;
    private final UserService userService;
    
    public GenreResponse addGenre(GenreRequest request) {
        String username = getLoggedInUser();

        User user = userService.getByUsernameForServices(username);
        
        Genre genre = new Genre();
        genre.setName(request.getName());
        genre.setUser(user);
        genreRepository.save(genre);

        return new GenreResponse(genre.getId(), genre.getName());
    }
    
    public List<GenreResponse> getByUser(Long userId) {
        List<Genre> genres = genreRepository.findByUserId(userId);
        List<GenreResponse> genreResponses = genres.stream().map( genre -> {
            return new GenreResponse(genre.getId(), genre.getName());
        }).toList();

        return genreResponses;
    }

    private String getLoggedInUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }
}
