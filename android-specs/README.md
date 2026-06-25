# Android App Implementation Specs

This folder contains guidelines and specifications intended for Google AI Studio (or any LLM/developer) to build the Android counterpart to the Oudatham (CHMS) web application.

## Files included:
1. `UI_GUIDELINES.md`: Defines the visual aesthetic, color palettes, and component structures to ensure the Android app mirrors the Next.js web application.
2. `DATA_MODELS.md`: Translates the Prisma database schema and TypeScript interfaces into Kotlin Data Classes for use in the app.
3. `API_ENDPOINTS.md`: Documents the REST API endpoints available on the web server that the Android app should interact with via Retrofit.

## How to use this for AI Studio:
Upload these files (or copy-paste their contents) into a prompt for Google AI Studio along with instructions like:
*"Build a Jetpack Compose Android app based on these UI guidelines, data models, and API endpoints."*
