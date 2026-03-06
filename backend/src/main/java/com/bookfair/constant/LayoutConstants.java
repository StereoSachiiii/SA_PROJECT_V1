package com.bookfair.constant;

import com.bookfair.entity.PhysicalConstraint;
import com.bookfair.entity.PhysicalConstraintType;
import java.util.List;
import java.util.Arrays;

public class LayoutConstants {
    
    public static final List<PhysicalConstraint> SIRIMAVO_CONSTRAINTS = Arrays.asList(
        buildConstraint(PhysicalConstraintType.ENTRANCE, 45.0, 0.0, 10.0, 8.0, "MAIN ENTRY"),
        buildConstraint(PhysicalConstraintType.WALL, 0.0, 0.0, 1.0, 100.0, "West Wall"),
        buildConstraint(PhysicalConstraintType.WALL, 99.0, 0.0, 1.0, 100.0, "East Wall"),
        buildConstraint(PhysicalConstraintType.PILLAR, 20.0, 20.0, 2.0, 2.0, "P1"),
        buildConstraint(PhysicalConstraintType.PILLAR, 20.0, 50.0, 2.0, 2.0, "P2"),
        buildConstraint(PhysicalConstraintType.PILLAR, 20.0, 80.0, 2.0, 2.0, "P3")
    );

    public static final List<PhysicalConstraint> SLECC_CONSTRAINTS = Arrays.asList(
        buildConstraint(PhysicalConstraintType.ENTRANCE, 0.0, 45.0, 3.0, 10.0, "MAIN ENTRY"),
        buildConstraint(PhysicalConstraintType.FIRE_EXIT, 98.0, 10.0, 2.0, 5.0, "EXIT A"),
        buildConstraint(PhysicalConstraintType.FIRE_EXIT, 98.0, 85.0, 2.0, 5.0, "EXIT B"),
        buildConstraint(PhysicalConstraintType.OFFICE, 5.0, 5.0, 15.0, 10.0, "RECEPTION")
    );

    private static PhysicalConstraint buildConstraint(PhysicalConstraintType type, Double x, Double y, Double w, Double h, String label) {
        return PhysicalConstraint.builder()
            .type(type)
            .posX(x)
            .posY(y)
            .width(w)
            .height(h)
            .label(label)
            .build();
    }
}
