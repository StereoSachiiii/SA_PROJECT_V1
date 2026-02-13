package com.bookfair.dto.request;

import lombok.Data;

@Data
public class GenreRequest {
    private Long userId;
    private String name;
}
