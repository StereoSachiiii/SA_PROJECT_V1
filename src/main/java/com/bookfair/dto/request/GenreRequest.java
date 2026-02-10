package com.bookfair.dto.request;

import lombok.Data;

@Data
public class GenreRequest {
    private Long publisherId;
    private String name;
}
