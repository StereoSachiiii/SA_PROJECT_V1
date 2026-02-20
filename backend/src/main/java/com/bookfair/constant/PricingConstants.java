package com.bookfair.constant;

@org.springframework.stereotype.Component
public class PricingConstants {

    public static long STALL_SMALL_PRICE;
    public static long STALL_MEDIUM_PRICE;
    public static long STALL_LARGE_PRICE;
    public static long SLECC_MEDIUM_PRICE;
    public static long SLECC_VIP_PRICE;
    public static long SLECC_ANNEX_PRICE;
    public static double VIP_MULTIPLIER;

    @org.springframework.beans.factory.annotation.Value("${app.pricing.stall.small}")
    public void setSmallPrice(long val) { STALL_SMALL_PRICE = val; }

    @org.springframework.beans.factory.annotation.Value("${app.pricing.stall.medium}")
    public void setMediumPrice(long val) { STALL_MEDIUM_PRICE = val; }

    @org.springframework.beans.factory.annotation.Value("${app.pricing.stall.large}")
    public void setLargePrice(long val) { STALL_LARGE_PRICE = val; }

    @org.springframework.beans.factory.annotation.Value("${app.pricing.slecc.medium:50000}")
    public void setSleccMediumPrice(long val) { SLECC_MEDIUM_PRICE = val; }

    @org.springframework.beans.factory.annotation.Value("${app.pricing.slecc.vip:100000}")
    public void setSleccVipPrice(long val) { SLECC_VIP_PRICE = val; }

    @org.springframework.beans.factory.annotation.Value("${app.pricing.slecc.annex:30000}")
    public void setSleccAnnexPrice(long val) { SLECC_ANNEX_PRICE = val; }

    @org.springframework.beans.factory.annotation.Value("${app.pricing.vip-multiplier}")
    public void setVipMultiplier(double val) { VIP_MULTIPLIER = val; }
}
