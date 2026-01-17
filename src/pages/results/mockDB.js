export const MOCK_HISTORY = [
    // --- WEEK 1: EARLY ATTEMPTS ---
    {
      "_id": "665000000000000000000101",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-10T14:30:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 1 }
      ],
      "totalCost": 450000,
      "avgCoveragePercent": 38.6, // Low coverage start
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000102",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-11T09:15:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 3 }
      ],
      "totalCost": 500000,
      "avgCoveragePercent": 42.1, // Testing cheap ships
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000103",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-12T16:45:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 2 }
      ],
      "totalCost": 900000,
      "avgCoveragePercent": 71.2, // Doubling up works well
      "mapId": "arctic-sector-1"
    },
  
    // --- WEEK 2: OPTIMIZATION TESTING ---
    {
      "_id": "665000000000000000000104",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-13T11:20:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 1 },
        { "boatId": "kingston-01", "quantity": 2 }
      ],
      "totalCost": 650000,
      "avgCoveragePercent": 55.4, // Good efficiency
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000105",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-14T18:00:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 1 },
        { "boatId": "harry-dewolf-01", "quantity": 1 }
      ],
      "totalCost": 1200000,
      "avgCoveragePercent": 89.1, // Expensive but high coverage
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000106",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-15T10:00:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 5 }
      ],
      "totalCost": 950000,
      "avgCoveragePercent": 83.9, // Spamming cheap ships
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000107",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-16T14:20:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 2 }
      ],
      "totalCost": 1500000,
      "avgCoveragePercent": 94.5, // Brute force method
      "mapId": "arctic-sector-1"
    },
  
    // --- WEEK 3: "FAILED" RUNS & EXPERIMENTS ---
    {
      "_id": "665000000000000000000108",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-18T09:30:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 1 }
      ],
      "totalCost": 150000,
      "avgCoveragePercent": 12.4, // Minimal spending test (Fail)
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000109",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-19T13:45:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 1 },
        { "boatId": "kingston-01", "quantity": 1 }
      ],
      "totalCost": 600000,
      "avgCoveragePercent": 48.2, 
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000110",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-20T16:15:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 1 },
        { "boatId": "halifax-01", "quantity": 2 }
      ],
      "totalCost": 1650000,
      "avgCoveragePercent": 96.8, // Very high cost
      "mapId": "arctic-sector-1"
    },
  
    // --- WEEK 4: REFINING STRATEGY ---
    {
      "_id": "665000000000000000000111",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-22T10:00:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 4 },
        { "boatId": "halifax-01", "quantity": 1 }
      ],
      "totalCost": 1050000,
      "avgCoveragePercent": 88.5, // Finding the sweet spot
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000112",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-23T15:30:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 1 },
        { "boatId": "kingston-01", "quantity": 3 }
      ],
      "totalCost": 900000,
      "avgCoveragePercent": 75.0,
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000113",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-24T11:45:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 3 }
      ],
      "totalCost": 1350000,
      "avgCoveragePercent": 91.2,
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000114",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-25T09:00:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 6 }
      ],
      "totalCost": 1100000,
      "avgCoveragePercent": 85.0, // Diminishing returns on cheap ships
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000115",
      "userId": "665000000000000000000001",
      "createdAt": "2026-01-26T14:00:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 1 },
        { "boatId": "halifax-01", "quantity": 1 },
        { "boatId": "kingston-01", "quantity": 1 }
      ],
      "totalCost": 1350000,
      "avgCoveragePercent": 98.1, // THE PERFECT RUN (High cost but max coverage)
      "mapId": "arctic-sector-1"
    },
    // --- HIGH EFFICIENCY (High % / Low Cost) ---
    {
      "_id": "665000000000000000000201",
      "userId": "665000000000000000000001",
      "createdAt": "2026-02-01T09:00:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 1 } 
      ],
      "totalCost": 400000,
      "avgCoveragePercent": 92.5, // The lucky "perfect placement" run
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000202",
      "userId": "665000000000000000000001",
      "createdAt": "2026-02-02T14:15:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 2 }
      ],
      "totalCost": 600000,
      "avgCoveragePercent": 88.4, // Very efficient use of mid-tier ships
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000203",
      "userId": "665000000000000000000001",
      "createdAt": "2026-02-03T11:30:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 3 }
      ],
      "totalCost": 450000,
      "avgCoveragePercent": 81.0, // Cheap swarm strategy working well
      "mapId": "arctic-sector-1"
    },

    // --- LOW EFFICIENCY (Low % / High Cost) ---
    {
      "_id": "665000000000000000000204",
      "userId": "665000000000000000000001",
      "createdAt": "2026-02-04T16:45:00",
      "ships": [
        { "boatId": "harry-dewolf-01", "quantity": 3 }
      ],
      "totalCost": 1800000,
      "avgCoveragePercent": 25.4, // Huge spending, terrible positioning
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000205",
      "userId": "665000000000000000000001",
      "createdAt": "2026-02-05T10:20:00",
      "ships": [
        { "boatId": "halifax-01", "quantity": 4 }
      ],
      "totalCost": 1400000,
      "avgCoveragePercent": 33.1, // Diminishing returns nightmare
      "mapId": "arctic-sector-1"
    },
    {
      "_id": "665000000000000000000206",
      "userId": "665000000000000000000001",
      "createdAt": "2026-02-06T13:00:00",
      "ships": [
        { "boatId": "kingston-01", "quantity": 8 }
      ],
      "totalCost": 1200000,
      "avgCoveragePercent": 15.8, // Traffic jam of cheap ships
      "mapId": "arctic-sector-1"
    }
  ];