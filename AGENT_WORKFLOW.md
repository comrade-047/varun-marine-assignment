# AI Agent Workflow Log

This document logs the collaboration with AI agents (Gemini and GitHub Copilot) to build the FuelEU Maritime project, as required by the assignment.

## Agents Used

* **Gemini (Google):** Used as a high-level pair programmer, architect, and debugger. It provided the overall plan, and debugged complex logical/environment bugs.
* **GitHub Copilot:** Used as an "in-line" code generator for boilerplate, complex algorithms, and test cases.

## Prompts & Outputs

### Example 1: Backend - Prisma Schema Generation

* **Prompt:** A series of sequential comments in `schema.prisma`.
    ```prisma
    // A table for 'routes' with columns:
    // id (default uuid), route_id (string, unique),
    // vesselType (string), fuelType (string), year (int),
    // ghgIntensity (float), fuelConsumption (float),
    // distance (float), totalEmissions (float),
    // is_baseline (boolean, default false)
    // @@map("routes")
    ```
* **Output:** GitHub Copilot generated the full `model Route { ... }` block based on the comment. This was repeated for all 5 models, saving significant time.

### Example 2: Backend - Core Logic (CB Formula)

* **Prompt:** A comment inside `ComplianceService.ts` defining the logic.
    ```typescript
    /*
    Formula:
    Target Intensity (2025) = 89.3368 gCO₂e/MJ
    Energy in scope (MJ) ≈ fuelConsumption × 41 000 MJ/t
    Compliance Balance = ( Target − Actual ) × Energy in scope
    
    Create a function `calculateCB(input: CbCalculationInput): number`
    where input is { ghgIntensity: number, fuelConsumption: number }
    */
    ```
* **Output:** Copilot generated the `calculateCB` function instantly, including the constants, correctly translating the formula into code.

### Example 3: Backend - Core Logic (Greedy Pooling Algorithm)

* **Prompt:** This was the most complex prompt, provided by Gemini and executed by Copilot. A large comment block was placed inside the `allocatePool` function in `PoolService.ts`.
    ```typescript
    /*
    Task: Implement the greedy allocation logic for a compliance pool.
    
    Rules:
    1. Calculate the total pool balance (sum of all cb_before).
    2. If total balance is < 0, throw an Error("Invalid pool: Total balance is negative.").
    3. Separate members into 'surplusShips' (sorted DESC) and 'deficitShips' (sorted ASC).
    ... (and 5 more detailed steps) ...
    8. Return the list of 'result' objects.
    */
    ```
* **Output:** Copilot generated a ~40-line implementation of this complex algorithm, including sorting, looping, and the final validation checks.

### Example 4: Frontend - UI Component (Tailwind Table)

* **Prompt:** A comment inside `RoutesTab.tsx`.
    ```jsx
    {/* A responsive TailwindCSS table to display the routes.
        Columns: Route ID, Vessel Type, Fuel Type, Year, GHG Intensity, Actions
        The table should have a light gray header and borders between rows.
    */}
    ```
* **Output:** Copilot generated the full `<table>`, `<thead>`, `<tbody>`, and `.map()` function to render the rows, including all the correct Tailwind classes.

## Validation / Corrections

AI was not a "magic bullet" and required constant human oversight.

* **Backend Test Failures:** The integration tests failed repeatedly. This wasn't an AI hallucination, but a complex series of environment and state bugs. **Gemini** was used to debug this, identifying:
    1.  The `app.use('/')` bug in `app.ts` that hijacked all API routes.
    2.  The missing `dotenv/config` in `prisma.ts`, which caused a stale DB connection.
    3.  The missing `@@unique` constraint in `schema.prisma` that broke the `upsert` call.
* **Frontend `routes.map` Error:** The frontend crashed because the API was returning an HTML file (due to the backend bug). Gemini helped diagnose this by analyzing the `<!doctype html>` error message, tracing it back to the `baseURL` being `undefined`, and realizing the Vite server needed a restart to load the `.env` file.
* **Frontend Logic Bug:** The "Bank Full Surplus" button didn't work. Gemini identified that the hook was calling `computeCb` (re-calculating the old surplus) instead of `getAdjustedCb` (reading the new '0' balance).

## Observations

* **Where AI saved time:** Boilerplate was the biggest win. Schemas, tables, forms, and simple functions were generated in seconds. The pooling algorithm was a massive time-save, turning a 1-hour "think-and-code" problem into a 10-minute "prompt-and-validate" task.
* **Where it failed:** The AI (both agents) struggled with system-wide **state and environment**. It couldn't debug the test failures on its own because the problem wasn't in one file, but in the *interaction* between Jest, Prisma, Express, and `dotenv`. This required human analysis, guided by the AI's suggestions.
* **Effective Combination:** The best workflow was **Gemini (Architect) + Human (Coder) + Copilot (Typist)**.
    1.  Gemini provided the plan and file structure.
    2.  I (the human) created the files.
    3.  Copilot wrote most of the code inside the files.
    4.  Gemini helped debug the code when it broke.

## Best Practices Followed

* Used AI to generate boilerplate (React components, Express controllers).
* Used AI to refactor (e.g., pulling `Button` and `InputField` into their own files).
* Used AI for complex, isolated logic (the pooling algorithm).
* **Crucially, used AI to help write unit and integration tests.**