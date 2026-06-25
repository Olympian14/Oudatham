# API Endpoints (Retrofit Interface)

These endpoints run on the Next.js backend and handle the core logic. Assume a base URL like `https://your-server.com`.

## 1. Authentication
*Note: The current app uses NextAuth/Auth.js which heavily relies on cookies. For an Android app, you will need to implement a JWT or Token-based auth route (e.g., `/api/auth/login`), but for building the UI prototype, assume you have a valid session cookie or token.*

## 2. Doctor / Encounter Management

### Get All Encounters
**Endpoint:** `GET /api/doctor/encounters`
**Response:** `List<Encounter>`
Returns all active encounters for the doctor.

### Sync Case Sheet (Auto-save)
**Endpoint:** `POST /api/doctor/encounter/{id}`
**Path Param:** `id` (The Encounter ID)
**Body:** JSON representing the full `ClinicalState` object.
**Description:** Saves the current state of the encounter (Demographics, History, Vitals, etc.) to the `CaseSheet` table. Call this periodically or when navigating between sections.

### Dispatch Orders (Pharmacy / Lab)
**Endpoint:** `POST /api/doctor/encounter/{id}/dispatch`
**Path Param:** `id` (The Encounter ID)
**Body:**
```json
{
  "type": "pharmacy", // or "lab" or "radiology"
  "payload": [ 
    // If type=pharmacy, send List<PrescriptionItem>
    // If type=lab/radiology, send string of investigations separated by newline
  ]
}
```
**Description:** Pushes the active orders into the relational database for the dashboards to consume.

### Complete Encounter
**Endpoint:** `POST /api/doctor/encounter/{id}/complete`
**Path Param:** `id` (The Encounter ID)
**Description:** Marks the encounter status as `COMPLETED`.

## 3. Department Dashboards

### Get Pending Lab Investigations
**Endpoint:** `GET /api/lab/pending`
**Response:** `List<InvestigationItem>`
**Description:** Fetches all investigations where `status == "PENDING"`.

### Get Pending Prescriptions
**Endpoint:** `GET /api/pharmacy/pending`
**Response:** `List<PrescriptionItem>`
**Description:** Fetches all prescriptions where `status == "PENDING"`.

---

## Retrofit Interface Example

```kotlin
interface OudathamApi {
    
    @GET("api/doctor/encounters")
    suspend fun getEncounters(): Response<List<Encounter>>

    @POST("api/doctor/encounter/{id}")
    suspend fun saveCaseSheet(
        @Path("id") id: String,
        @Body state: ClinicalState
    ): Response<Unit>

    @POST("api/doctor/encounter/{id}/dispatch")
    suspend fun dispatchOrders(
        @Path("id") id: String,
        @Body request: DispatchRequest
    ): Response<Unit>

    @GET("api/lab/pending")
    suspend fun getPendingLabs(): Response<List<InvestigationItem>>

    @GET("api/pharmacy/pending")
    suspend fun getPendingPrescriptions(): Response<List<PrescriptionItem>>
}

data class DispatchRequest(
    val type: String,
    val payload: Any
)
```
