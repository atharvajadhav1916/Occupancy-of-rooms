# SLRTCE IT-Sync (Occupancy Monitor)

### Project Overview
[cite_start]The **SLRTCE IT-Sync** is a real-time classroom and laboratory occupancy tracking system designed for students at **Shree L. R. Tiwari College of Engineering**[cite: 2]. It solves the common campus problem where students struggle to find free spaces for self-study or project work by providing a live, glanceable digital dashboard.

The system intelligently combines hardcoded master timetable data for **Friday** (covering FE, SE, and TE) with a manual override feature to account for early lecture departures or spontaneous project sessions.

---

### Core Features
* **Live Timetable Integration**: Automatically marks rooms as "Occupied" based on the current campus clock and the Friday master schedule.
* **Manual Check-In/Out**: Allows students to manually toggle a room's status via a "Toggle Status" button, satisfying the core project requirement.
* **Persistent Data**: Uses `localStorage` to ensure that manual overrides are remembered even after a page refresh, requiring no backend database.
* **Multi-Floor Filtering**: Quickly filter views for Floor 1, 2, 3, or 5 to navigate the campus wing efficiently.
* [cite_start]**Contextual Details**: When occupied, the app displays the specific Subject, Faculty, and Batch (e.g., Room 106: Digital Electronics with MG for FE ECS-A)[cite: 161, 163].
* **Adaptive UI**: Supports Dark and Light modes for visibility in different campus lighting conditions.

---

### Scraped Timetable Data (Friday Highlights)
[cite_start]The project includes specific data from SLRTCE academic records for the 2025-26 Even Term[cite: 1, 84, 146]:

| Floor | Room | Key Scheduled Activities (Friday) | Faculty | Class/Batch |
| :--- | :--- | :--- | :--- | :--- |
| **1** | 106 | [cite_start]UHV, Digital Electronics, Python Lab [cite: 161] | [cite_start]VT, MG, PB [cite: 163] | [cite_start]FE ECS-A [cite: 161] |
| **1** | 107 | [cite_start]PSDE, UHV [cite: 181, 231] | [cite_start]K, VT [cite: 184, 233] | [cite_start]FE CMPN-B, FE IT-A [cite: 181, 231] |
| **2** | 201 | [cite_start]Engineering Chemistry, DSA, Engineering Mechanics [cite: 148, 181] | [cite_start]LT, VS, AS [cite: 150, 184] | [cite_start]FE EXTC, FE CMPN-A [cite: 148, 181] |
| **3** | 311 | [cite_start]MAM-IS, SEPM, BMD [cite: 10, 12] | [cite_start]RK, SS, AG [cite: 10, 12] | [cite_start]SE-B IT [cite: 10, 12] |
| **5** | 502/503| [cite_start]DS Lab A2, Idea Lab, MPPL A1 [cite: 231, 242] | [cite_start]SK, RL, AS [cite: 233, 243] | [cite_start]FE IT-A, FE IT-B [cite: 231, 242] |

---

### Technical Constraints & Stack
* **Frontend**: Built using **React.js** with **Tailwind CSS** for styling.
* **Icons**: **Lucide-React** for high-clarity scannability.
* **State Management**: `useState` and `useMemo` for efficient live updates.
* **Storage**: Browser `localStorage` for manual occupancy tracking.
* **Development Time**: Designed to be functional and deployable within a 1-hour hackathon window.

---

### Installation & Setup
1.  **Clone the project**:
    ```bash
    git clone [https://github.com/your-repo/slrtce-it-sync.git](https://github.com/your-repo/slrtce-it-sync.git)
    ```
2.  **Install dependencies**:
    ```bash
    npm install lucide-react
    ```
3.  **Run the app**:
    ```bash
    npm start
    ```

---

### Future Scope
* **AI OCR Ingestion**: An autonomous module to parse messy PDF timetable scans into JSON format instantly.
* **Real-time Faculty Sync**: Integration with faculty attendance systems to automate "Free" status when a professor is on leave.
* **Student Heatmaps**: Tracking which labs are most used over time to optimize campus space utility.