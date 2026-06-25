# Data Models for Android (Kotlin Data Classes)

Use these Kotlin data classes when parsing JSON responses from the server via Retrofit/Gson/Moshi.

## 1. Encounter and Patient Base

```kotlin
data class Patient(
    val id: String,
    val patientUid: String,
    val name: String,
    val gender: String,
    val age: Int?,
    val mobile: String,
    val createdAt: String
)

data class Encounter(
    val id: String,
    val encounterUid: String,
    val patientId: String,
    val department: String,
    val status: String,
    val createdAt: String,
    val patient: Patient? = null,
    val caseSheet: CaseSheet? = null
)
```

## 2. Clinical Case Sheet (JSON Blob)

The API stores the clinical state as a JSON string inside the `CaseSheet` model. When fetching the encounter, you will need to parse the `jsonData` field into the following clinical model:

```kotlin
data class CaseSheet(
    val id: String,
    val encounterId: String,
    val jsonData: String // Parse this string into ClinicalState
)

// The parsed clinical state
data class ClinicalState(
    val demo: Demographic,
    val cc: List<Complaint>,
    val past: PastHistory,
    val fam: FamilyHistory,
    val per: PersonalHistory,
    val drg: DrugHistory,
    val vit: Vitals,
    val diagnosis: String?,
    val prescribedInvestigations: String?,
    val managementPlan: String?,
    val prescriptions: List<PrescriptionItem>?
)

data class Demographic(
    val name: String,
    val age: String,
    val sex: String
)

data class Complaint(
    val text: String,
    val durNum: String,
    val durUnit: String
)

data class PastHistory(
    val dm: String,
    val htn: String,
    val tb: String,
    val sim: String,
    val cond: String,
    val surg: String
)

data class FamilyHistory(
    val det: String,
    val htn_dm: String,
    val cardiac: String
)

data class PersonalHistory(
    val sm: String, // Smoking
    val al: String, // Alcohol
    val dt: String, // Diet
    val sexual: String
)

data class DrugHistory(
    val cur: String,
    val allergies: String
)

data class Vitals(
    val pu: String, // Pulse
    val bp: String, // Blood Pressure
    val rr: String, // Resp Rate
    val tp: String, // Temp
    val o2: String  // SpO2
)
```

## 3. Order Models (Pharmacy / Lab)

These are used when querying the distinct dashboards for pharmacy or laboratory.

```kotlin
data class PrescriptionItem(
    val id: String,
    val encounterId: String,
    val drugName: String,
    val dose: String,
    val frequency: String,
    val duration: String,
    val route: String?,
    val instructions: String?,
    val status: String // Usually "PENDING"
)

data class InvestigationItem(
    val id: String,
    val invUid: String,
    val encounterId: String,
    val testName: String,
    val category: String?, // "Laboratory" or "Radiology"
    val status: String, // Usually "PENDING"
    val result: String?
)
```
