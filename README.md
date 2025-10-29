# 🧠 Software Camera Coverage Validator

This project solves the **Software Camera Coverage Problem**, where multiple hardware cameras each support a limited range of **subject distances** and **light levels**, and we need to verify whether they can collectively cover a target range without any gaps.

The program is written entirely in **TypeScript**, uses no third-party libraries, and includes all logic and test cases in a single file.

---

## 🔍 What It Does

Imagine building a software camera that uses multiple physical cameras.  
Each physical camera only works well in certain lighting and distance conditions.  
The goal is to ensure that — together — they cover every possible condition you need.

This script takes:
- The **desired distance range** (e.g., 1–10 meters)
- The **desired light range** (e.g., 100–500 lux)
- A list of **hardware cameras** with their individual supported ranges

It checks:
- If all those smaller ranges merge into one continuous range without gaps  
- In **both** dimensions (distance and light)

If both are fully covered, it returns **true**, meaning your camera setup is complete.

---

## 🧩 How It Works 

1. **Collect all camera ranges** for distance and light.  
2. **Sort** those ranges from smallest to largest.  
3. **Merge** any overlapping or touching ranges into one continuous block.  
4. **Check** if those merged ranges fully cover the desired range.  
5. **Repeat** for both distance and light.  
6. Return **true** only if both are completely covered.

---

## 💡 Example

If the software camera should work between  
- Distances **1–10 meters**  
- Light levels **100–500 lux**

And two cameras cover:
- Camera 1: 1–5 meters, 100–300 lux  
- Camera 2: 6–10 meters, 301–500 lux  

✅ Together, they cover everything perfectly.  
❌ But if there’s a gap (like one stops at 4 and the next starts at 6), the function will detect that.

---

## 🧠 Algorithm Summary

- Sorting ensures all ranges are checked in sequence.  
- Merging avoids false gaps when ranges overlap or touch.  
- A continuous coverage test ensures every number between min and max is included.  
- Both **distance** and **light** must pass for success.

---

## 🧾 File Description

**File:** `camera-coverage.ts`

Includes:
- Type definitions for `NumericRange` and `CameraSpec`
- Two main functions:
  - `isRangeFullyCovered()` — checks if a set of ranges fully covers a desired range  
  - `canCamerasCoverDesiredRange()` — checks both distance and light ranges  
- A complete set of **test cases** validating all edge cases

---

## 🧪 Test Scenarios Included

The test suite covers:
- ✅ Full coverage with multiple cameras  
- ❌ Missing gaps in distance or light  
- ✅ Overlapping or adjacent ranges merging correctly  
- ❌ Empty camera list  
- ✅ Unordered camera list (robust sorting)  
- ❌ Disjoint or insufficient ranges  

---

## ▶️ How to Run

### 1. Save the File  
Save the full TypeScript file as:

```bash
camera-coverage.ts
```

### 2. Compile It  
Use the TypeScript compiler:

```bash
tsc camera-coverage.ts
```

### 3. Run It  
Run the compiled JavaScript file using Node:

```bash
node camera-coverage.js
```

Or run directly with `ts-node`:

```bash
npx ts-node camera-coverage.ts
```

---

### 🧾 Expected Output

When you execute the file, you’ll see test results like this:

```
=== SOFTWARE CAMERA COVERAGE TESTS ===

✅ Full coverage with two complementary cameras: true (expected true)
❌ Gap in distance coverage: false (expected false)
✅ Overlapping ranges merge correctly: true (expected true)
❌ Light range not fully covered: false (expected false)
❌ Empty camera list: false (expected false)
✅ Single camera covers everything: true (expected true)
✅ Multiple small cameras form full coverage: true (expected true)
❌ Non-overlapping light ranges with gaps: false (expected false)
✅ Adjacent ranges merge successfully: true (expected true)
❌ Partial coverage only on one dimension (light insufficient): false (expected false)
✅ Unordered camera list handled correctly: true (expected true)
❌ Disjoint camera ranges fail coverage: false (expected false)
```

---

## 🧰 Tech Stack

- **Language:** TypeScript  
- **Runtime:** Node.js  
- **Dependencies:** None (pure logic implementation)

---

### 💬 Final Note

This project demonstrates **logical problem-solving** and **range validation** techniques that can be applied to real-world systems like:
- Smart camera setups  
- Sensor networks  
- Dynamic environmental calibration

It’s clean, efficient, and fully test-driven.
