package com.bookfair.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StallRequest {
    private String name;       
    private String size;        
    private String reserved;
    private Integer positionX;
    private Integer positionY;
}
