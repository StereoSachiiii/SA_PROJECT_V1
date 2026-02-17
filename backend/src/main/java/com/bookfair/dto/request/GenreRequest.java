package com.bookfair.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenreRequest {
    @NotNull(message = "User ID is required to add a genre")
    private Long userId;
    
    @NotBlank(message = "Genre name cannot be empty")
    @Size(min = 3, max = 30, message = "Genre name must be between 3 and 30 characters")
    private String name;
}
