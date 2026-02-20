package com.bookfair.constant;

public class LayoutConstants {
    public static final String SIRIMAVO_LAYOUT = "{" +
                "\"width\": 1000, \"height\": 600," +
                "\"entrances\": [" +
                "  {\"id\": \"gate-n\", \"type\": \"MAIN\", \"x\": 500, \"y\": 50, \"w\": 100, \"label\": \"MAIN NORTH GATE\"}," +
                "  {\"id\": \"gate-s\", \"type\": \"SECONDARY\", \"x\": 500, \"y\": 580, \"w\": 80, \"label\": \"SOUTH SERVICE ENTRY\"}" +
                "]," +
                "\"influences\": [" +
                "  {\"id\": \"inf-gate-n\", \"type\": \"ENTRANCE\", \"x\": 500, \"y\": 50, \"radius\": 250, \"intensity\": 85, \"falloff\": \"LINEAR\"}," +
                "  {\"id\": \"inf-stage\", \"type\": \"STAGE\", \"x\": 850, \"y\": 300, \"radius\": 350, \"intensity\": 100, \"falloff\": \"EXPONENTIAL\"}," +
                "  {\"id\": \"inf-aisle-c\", \"type\": \"WALKWAY\", \"x\": 500, \"y\": 300, \"radius\": 400, \"intensity\": 40, \"falloff\": \"LINEAR\"}" +
                "]," +
                "\"zones\": [" +
                "  {\"type\": \"WALKWAY\", \"geometry\": {\"x\": 45, \"y\": 0, \"w\": 10, \"h\": 100}, \"metadata\": {\"label\": \"MAIN TRAFFIC AXIS\"}}," +
                "  {\"type\": \"STAGE\", \"geometry\": {\"x\": 80, \"y\": 20, \"w\": 15, \"h\": 60}, \"metadata\": {\"label\": \"FESTIVAL STAGE\"}}," +
                "  {\"type\": \"ENTRANCE\", \"geometry\": {\"x\": 45, \"y\": -5, \"w\": 10, \"h\": 8}, \"metadata\": {\"label\": \"MAIN ENTRY\"}}" +
                "]" +
                "}";

    public static final String MAIN_HALL_LAYOUT = "{" +
                "\"width\": 1000, \"height\": 800," +
                "\"entrances\": [" +
                "  {\"id\": \"mh-gate-main\", \"type\": \"MAIN\", \"x\": 450, \"y\": 20, \"w\": 120, \"label\": \"GRAND ENTRANCE\"}" +
                "]," +
                "\"influences\": [" +
                "  {\"id\": \"mh-inf-gate\", \"type\": \"ENTRANCE\", \"x\": 450, \"y\": 20, \"radius\": 300, \"intensity\": 90, \"falloff\": \"LINEAR\"}," +
                "  {\"id\": \"mh-inf-center\", \"type\": \"WALKWAY\", \"x\": 500, \"y\": 400, \"radius\": 500, \"intensity\": 50, \"falloff\": \"LINEAR\"}" +
                "]," +
                "\"zones\": [" +
                "  {\"type\": \"ENTRANCE\", \"geometry\": {\"x\": 42, \"y\": -2, \"w\": 16, \"h\": 6}, \"metadata\": {\"label\": \"ENTRY HALL\"}}," +
                "  {\"type\": \"WALKWAY\", \"geometry\": {\"x\": 0, \"y\": 45, \"w\": 100, \"h\": 10}, \"metadata\": {\"label\": \"CENTRAL PROMENADE\"}}" +
                "]" +
                "}";

    public static final String SLECC_MAIN_LAYOUT = "[" +
                "{\"type\": \"ENTRANCE\", \"geometry\": {\"x\": 0, \"y\": 45, \"w\": 3, \"h\": 10}, \"metadata\": {\"label\": \"MAIN ENTRY\"}}," +
                "{\"type\": \"STAGE\", \"geometry\": {\"x\": 85, \"y\": 30, \"w\": 15, \"h\": 40}, \"metadata\": {\"label\": \"MAIN STAGE\"}}," +
                "{\"type\": \"WALKWAY\", \"geometry\": {\"x\": 15, \"y\": 0, \"w\": 5, \"h\": 100}, \"metadata\": {\"label\": \"Aisle A\"}}," +
                "{\"type\": \"WALKWAY\", \"geometry\": {\"x\": 75, \"y\": 0, \"w\": 5, \"h\": 100}, \"metadata\": {\"label\": \"Aisle B\"}}," +
                "{\"type\": \"REGISTRATION\", \"geometry\": {\"x\": 5, \"y\": 5, \"w\": 15, \"h\": 10}, \"metadata\": {\"label\": \"Reception\"}}" +
            "]";
}
