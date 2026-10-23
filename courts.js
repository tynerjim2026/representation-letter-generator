
/* Court directory: verified court listings, NOT a complete five-county directory.
 * Source: New York State Unified Court System, retrieved October 23, 2026.
 * mailing-listed = official directory explicitly lists P.O. Box;
 * official-location-mailing-unconfirmed = official court location, NOT verified mailing address.
 * Always review court mailing address before sending.
 * Add records without changing the field names.
 */
const COURT_DIRECTORY = {
  "Albany": [
    {
      "name": "Albany City Court, Civil Part",
      "address": "24 Eagle Street, Room 209\nAlbany, New York 12207",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Albany City Court, Criminal Part",
      "address": "1 Morton Avenue\nAlbany, New York 12202",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Albany City Court, Traffic Part",
      "address": "24 Eagle Street, Room 93\nAlbany, New York 12207",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Albany County Court",
      "address": "6 Lodge Street, Room 113\nAlbany, New York 12207",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Albany County Family Court",
      "address": "30 Clinton Avenue\nAlbany, New York 12207",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Albany County Supreme Court",
      "address": "16 Eagle Street, Room 102\nAlbany, New York 12207",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Albany County Surrogate's Court",
      "address": "16 Eagle Street, Room 123\nAlbany, New York 12207",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Altamont Village Court",
      "address": "P.O. Box 643\nAltamont, New York 12009",
      "county": "Albany",
      "addressStatus": "mailing-listed",
      "source": "https://www.nycourts.gov/town-and-village-justice-courts"
    },
    {
      "name": "Bethlehem Town Court",
      "address": "447 Delaware Avenue\nDelmar, New York 12054",
      "county": "Albany",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/town-and-village-justice-courts"
    }
  ],
  "Schenectady": [
    {
      "name": "Schenectady City Court, Civil & Traffic",
      "address": "105 Jay Street\nSchenectady, New York 12305",
      "county": "Schenectady",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Schenectady City Court, Criminal",
      "address": "531 Liberty Street\nSchenectady, New York 12305",
      "county": "Schenectady",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    }
  ],
  "Saratoga": [
    {
      "name": "Saratoga County Family Court",
      "address": "35 West High Street, Room 2\nBallston Spa, New York 12020",
      "county": "Saratoga",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Saratoga County Supreme & County Court",
      "address": "30 McMaster Street, Building 3\nBallston Spa, New York 12020",
      "county": "Saratoga",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Saratoga County Surrogate's Court",
      "address": "30 McMaster Street, Building 3\nBallston Spa, New York 12020",
      "county": "Saratoga",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Saratoga Springs City Court",
      "address": "474 Broadway\nSaratoga Springs, New York 12866",
      "county": "Saratoga",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    }
  ],
  "Rensselaer": [
    {
      "name": "Rensselaer City Court",
      "address": "62 Washington Street\nRensselaer, New York 12144",
      "county": "Rensselaer",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Rensselaer County Family Court",
      "address": "1504 5th Avenue\nTroy, New York 12180",
      "county": "Rensselaer",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Rensselaer Supreme & County Court",
      "address": "80 Second Street\nTroy, New York 12180",
      "county": "Rensselaer",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Rensselaer County Surrogate's Court",
      "address": "80 Second Street\nTroy, New York 12180",
      "county": "Rensselaer",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Troy City Court",
      "address": "51 State Street\nTroy, New York 12180",
      "county": "Rensselaer",
      "addressStatus": "official-location-mailing-unconfirmed",
      "source": "https://www.nycourts.gov/court-locator"
    }
  ],
  "Montgomery": [
    {
      "name": "Montgomery County Family Court",
      "address": "P.O. Box 1500\nFonda, New York 12068",
      "county": "Montgomery",
      "addressStatus": "mailing-listed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Montgomery County Supreme & County Court",
      "address": "P.O. Box 1500\nFonda, New York 12068",
      "county": "Montgomery",
      "addressStatus": "mailing-listed",
      "source": "https://www.nycourts.gov/court-locator"
    },
    {
      "name": "Montgomery County Surrogate's Court",
      "address": "P.O. Box 1500\nFonda, New York 12068",
      "county": "Montgomery",
      "addressStatus": "mailing-listed",
      "source": "https://www.nycourts.gov/court-locator"
    }
  ]
};
