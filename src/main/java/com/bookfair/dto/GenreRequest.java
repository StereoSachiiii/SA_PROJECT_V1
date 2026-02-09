package com.bookfair.dto;

import lombok.Data;

@Data
public class GenreRequest {
    private Long publisherId;
    private String name;
}
