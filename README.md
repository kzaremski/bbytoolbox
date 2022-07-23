# bbytoolbox
Best Buy tracks sales internally with their reporting software.
Microsoft provides labor for the store and I saw that their associates can have a more realtime report on the performance of the stores if store associates track their sales directly instead of tallying them on an erasable card.
I developed a web app using React, Express, and MongoDB that keeps track of products and services sold in individual sales made by employees in the computing department.
It aims to simplify the tasks of the representatives that Microsoft sends to each Best Buy market in the country.
I worked with the Microsoft representative that visits our store to add features that would benefit them and pilot the app’s use in other stores within the market.
The app’s backend generates and emails a report to the representative every morning for the previous day with a breakdown of sales by employee and calculates key performance indicators.
At its peak it was in use by three stores in Colorado, on track to becoming a standard procedure, but is now defunct with my departure from the company.

### Key Features
- Installable progressive web app.
- Track sales of Windows computers, Microsoft Office, XBOX, and Best Buy Geek Squad Protection or Total Tech Support plans.
- Multiple stores and supports different time zones.
- Automatic calculation and tracking of key performance indicators based on the ratios of the different kinds of units sold to each other.
- End of day automatic reporting with Excel file generation that is then emailed to a set of admin emails (myself and the third-party Microsoft associates).
- Simple PIN authentication to avoid scanning and use by customers and other unauthorized users.

### Configuration
The backend is configured with environment variables set at runtime.
```
MG_APIKEY      Mailgun API key
MG_DOMAIN      Mailgun email sending domain (configured on Mailgun's dashboard)
MONGODB_URI    MongoDB connection string/URI
PORT           Application HTTP port (should not be internet facing, reverse proxy with NGINX)
PIN            "yes" or "no", should associates be required to authenticate with 4-digit pin in order to submit sales?
```

### License
The app is no longer in use so I have made the source code public.

The code is licensed under the BSD 4-Clause or "old" license.
See LICENSE for details.
