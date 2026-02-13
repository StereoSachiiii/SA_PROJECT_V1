// src/test/mockData.ts

/**
 * Mock data for prototyping the Bookfair Stall Reservation system.
 * This file allows testing of the Employee Portal and Stall Map 
 * without a running backend.
 */

//For the Employee Portal

export const MOCK_STALLS = [
    { id: 1, name: "A01", size: "Large", reserved: true },
    { id: 2, name: "A02", size: "Large", reserved: false },
    { id: 3, name: "B01", size: "Medium", reserved: true },
    { id: 4, name: "B02", size: "Medium", reserved: false },
    { id: 5, name: "C01", size: "Small", reserved: false },
    { id: 6, name: "C02", size: "Small", reserved: true },
    { id: 7, name: "D01", size: "Medium", reserved: false },
    { id: 8, name: "D02", size: "Large", reserved: false },
];

export const MOCK_RESERVATIONS = [
    {
        id: 101,
        createdAt: "2026-02-10T08:30:00Z",
        qrCode: "QR_STALL_A01_PUB_1_SECRET",
        stall: { name: "A01", size: "Large" },
        publisher: { 
            businessName: "Sarasavi Publishers", 
            email: "info@sarasavi.lk",
            contactPerson: "Mr. Perera" 
        }
    },
    {
        id: 102,
        createdAt: "2026-02-11T14:45:00Z",
        qrCode: "QR_STALL_B01_PUB_2_SECRET",
        stall: { name: "B01", size: "Medium" },
        publisher: { 
            businessName: "Gunasena & Co", 
            email: "contact@gunasena.com",
            contactPerson: "Ms. Silva"
        }
    },
    {
        id: 103,
        createdAt: "2026-02-12T09:15:00Z",
        qrCode: "QR_STALL_C02_PUB_3_SECRET",
        stall: { name: "C02", size: "Small" },
        publisher: { 
            businessName: "Vijitha Yapa", 
            email: "sales@vijithayapa.lk",
            contactPerson: "Mr. Fernando"
        }
    }
];

export const MOCK_PUBLISHERS = [
    { id: 1, businessName: "Sarasavi Publishers", email: "info@sarasavi.lk" },
    { id: 2, businessName: "Gunasena & Co", email: "contact@gunasena.com" },
    { id: 3, businessName: "Vijitha Yapa", email: "sales@vijithayapa.lk" }
];

export const MOCK_GENRES = [
    { id: 1, name: "Fiction", publisherId: 1 },
    { id: 2, name: "Educational", publisherId: 1 },
    { id: 3, name: "History", publisherId: 2 }
];

// For theStall Map Page, we can reuse MOCK_STALLS or create a more extensive map layout:

export const MOCK_STALL_MAP_DATA = [
    { id: 1, name: "A-01", size: "Large", reserved: true },
    { id: 2, name: "A-02", size: "Large", reserved: false },
    { id: 3, name: "A-03", size: "Large", reserved: false },
    { id: 4, name: "A-04", size: "Large", reserved: true },
    { id: 5, name: "B-01", size: "Medium", reserved: false },
    { id: 6, name: "B-02", size: "Medium", reserved: false },
    { id: 7, name: "B-03", size: "Medium", reserved: true },
    { id: 8, name: "B-04", size: "Medium", reserved: false },
    { id: 9, name: "C-01", size: "Small", reserved: false },
    { id: 10, name: "C-02", size: "Small", reserved: false },
    { id: 11, name: "C-03", size: "Small", reserved: false },
    { id: 12, name: "C-04", size: "Small", reserved: false },
    { id: 13, name: "D-01", size: "Medium", reserved: true },
    { id: 14, name: "D-02", size: "Medium", reserved: false },
    { id: 15, name: "D-03", size: "Medium", reserved: false },
    { id: 16, name: "D-04", size: "Medium", reserved: true },
    { id: 17, name: "E-01", size: "Large", reserved: false },
    { id: 18, name: "E-02", size: "Large", reserved: false },
    { id: 19, name: "E-03", size: "Large", reserved: false },
    { id: 20, name: "E-04", size: "Large", reserved: false },
];