# UI & Architecture Guidelines for Android (Jetpack Compose)

## 1. Architectural Stack
- **UI Toolkit**: Jetpack Compose
- **Architecture**: MVVM (Model-View-ViewModel)
- **Networking**: Retrofit & OkHttp
- **Asynchrony**: Kotlin Coroutines & Flow
- **Dependency Injection**: Hilt (Optional, but recommended)
- **Navigation**: Jetpack Navigation Compose

## 2. Global Aesthetics (Dark Clinical Theme)
The application relies on a modern, dark "slate" theme with distinct neon/accent colors to categorize different modules.
- **Background**: `Slate 950` (#020617) for main app backgrounds.
- **Surface / Cards**: `Slate 900` (#0f172a) for elevated cards, borders in `Slate 800` (#1e293b).
- **Text**: `Slate 100` (#f1f5f9) for primary text, `Slate 400` (#94a3b8) for secondary/labels.

### Accent Colors (Use for icons, badges, borders, glowing shadows)
- **General Accents / Doctor**: `Indigo 500/600` (#6366f1 / #4f46e5)
- **Pharmacy / Prescriptions**: `Amber 500/600` (#f59e0b / #d97706)
- **Lab / Investigations**: `Sky 500/600` (#0ea5e9 / #0284c7)
- **Radiology**: `Fuchsia 500/600` (#d946ef / #c026d3)
- **Completion / Success**: `Emerald 500/600` (#10b981 / #059669)

## 3. UI Component Directives

### A. Vertical Stack & Scroll
- The app uses a continuous vertical scroll layout. Do not use horizontal pagers or tabs for primary navigation within an encounter.
- Use `LazyColumn` for stacking sections.
- For sub-sections (e.g. Past Medical History, Family History, Personal History, Drug History), stack them vertically as Cards one after another.

### B. Cards & Containers
- Wrap logical blocks in rounded cards (`RoundedCornerShape(12.dp)`).
- Apply a 1.dp border (`border = BorderStroke(1.dp, Slate800)`).
- Background color should be `Slate900`.
- Padding inside cards should be around `16.dp` to `24.dp`.

### C. Input Fields
- Use `OutlinedTextField` tailored to the dark theme.
- Container color: `Slate950`.
- Unfocused border: `Slate800`.
- Focused border: `Indigo500`.
- Use `KeyboardOptions` appropriately (e.g., Number keyboard for age).

### D. Quick-Select Chips (Important UX feature)
- For rapid data entry (e.g., Comorbidities, Investigations, Symptoms), use horizontally scrolling rows (`LazyRow`) or flow layouts (`FlowRow` from Compose Accompanist/Foundation) containing clickable Chips.
- Example Comorbidities: `DM`, `HTN`, `Epilepsy`, `Thyroid`, `Asthma`, `COVID-19`, `TB`.
- When a chip is clicked, it should append the string to the associated text field or add it to a list.

### E. Dashboard Dispatch Buttons
- "Send to Pharmacy", "Send to Lab", etc. should be prominently displayed at the bottom of their respective sections.
- When clicked, show a loading state (e.g., `CircularProgressIndicator` or text change to "Sending...").
- Upon success, change to a green `Emerald500` color with text "Sent ✓".

## 4. Key Screens to Build

1. **Dashboard / Patient List**: Shows list of active encounters. Status badges (New, In-progress, Complete).
2. **Encounter Shell (Clinical View)**:
   - **Demographics**: Name, Age, Sex, Contact.
   - **Complaints**: Text area for Chief Complaints.
   - **Background History**: Vertically stacked sections (Past Medical, Family, Personal, Drug) with Quick-Select flow rows.
   - **Examination**: Vitals inputs (Pulse, BP, SpO2, Temp) and system exams.
   - **Diagnosis & Management**:
     - Diagnosis text area.
     - Investigation selection (Labs vs Radiology) and dispatch buttons.
     - Prescription list (Drug name, dosage, freq, duration) and "Send to Pharmacy" button.
3. **Department Dashboards (Lab / Pharmacy)**:
   - Simple list views fetching `PENDING` orders for that specific department.
