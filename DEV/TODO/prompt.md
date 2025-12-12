### Session Objective: "No-Scroll" Visualization Layout

**Objective:**
Refactor the `ArrayVisualization` component to eliminate horizontal and vertical scrolling for standard datasets (up to 20 items). The entire search space must be visible at a glance within the viewport to improve the educational value of the algorithm visualization.

#### 1. Design Rationale: "Viewport-First" UX
The previous design used a single horizontal row for the array. For an array of 20 elements, this forced the user to scroll horizontally to see the `Right` pointer, breaking the mental model of "halving the search space."
*   **New Requirement:** The visualization must fit entirely within the `flex-[3]` panel without overflow.
*   **Solution:** A responsive, wrapping grid layout.

#### 2. Architectural Shift: From "Layered Rows" to "Atomic Items"
Currently, the React code likely iterates through the data three separate times (once for indices, once for values, once for pointers). We are moving to an **Atomic Component** structure.

*   **Old Structure (Horizontal Layers):**
    ```jsx
    <div className="indices-row"> {data.map(renderIndex)} </div>
    <div className="values-row"> {data.map(renderValue)} </div>
    <div className="pointers-row"> {data.map(renderPointer)} </div>
    ```
    *Problem:* Hard to wrap; indices drift away from values when wrapped.

*   **New Structure (Vertical Slices):**
    You need to create a single `<ArrayItem />` component that encapsulates the **Index**, **Value**, and **Pointer** for a specific position vertically.
    ```jsx
    <div className="flex flex-wrap justify-center gap-2">
      {data.map((value, index) => (
        <ArrayItem 
           key={index}
           index={index}
           value={value}
           pointer={getPointerForIndex(index)} // 'L', 'R', or 'M'
           status={getStatusForIndex(index)}   // 'active', 'found', etc.
        />
      ))}
    </div>
    ```

#### 3. Styling Specifications (Tailwind)
To ensure the "No-Scroll" constraint for N=20, strict sizing is required. Do not use dynamic sizing that might expand too much.

*   **Container:** `flex flex-wrap justify-center gap-2` (Allows natural flow into multiple rows).
*   **Item Dimensions:**
    *   **Value Box:** Fixed `w-12 h-12` (down from `w-16`).
    *   **Font Size:** Reduced to `text-base` for values, `text-[10px]` for indices/pointers.
    *   **Pointer Area:** Fixed height `h-6` reserved below the box (ensures alignment even if no pointer exists at that index).
*   **Vertical Alignment:** The main container should use `items-center justify-center` to center the grid within the available panel height.

#### 4. Summary of Benefits
1.  **Cognitive Load:** Users see the relationship between Index, Value, and Pointer immediately (Gestalt principle of proximity).
2.  **Responsiveness:** The grid automatically adjusts to 1, 2, or 3 rows depending on screen width, ensuring the algorithm remains usable on smaller laptops without hiding data.

---
Create a plan to investigate the viability of the above.