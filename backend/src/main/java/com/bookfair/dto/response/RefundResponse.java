package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RefundResponse {
    private Long id;
    private String status;
    private String refundTxId;
    private String refundedAt;
    private String reason;
}
