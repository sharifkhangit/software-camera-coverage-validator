/**
 * Problem: Software Camera Coverage Validator
 * --------------------------------------------
 * Determines whether a set of hardware cameras can collectively
 * cover the desired range of subject distances and light levels.
 */

// ---------- Types ----------

/**
 * Represents a numeric range with a minimum and maximum value.
 * Example: { min: 1, max: 5 } means the range covers all values from 1 to 5.
 */
interface NumericRange {
  min: number;
  max: number;
}

/**
 * Represents a single hardware camera’s capability.
 * Each camera can handle a specific range of subject distances
 * and a specific range of light levels.
 */
interface CameraSpec {
  distance: NumericRange;
  light: NumericRange;
}

// ---------- Core Logic ----------

/**
 * Checks if a group of numeric ranges completely covers a target range.
 *
 * Simple idea:
 * - We sort all available ranges from smallest to largest.
 * - We merge overlapping or touching ranges into one continuous block.
 * - Then we check if these merged blocks cover every value
 *   from the start to the end of the desired range without leaving gaps.
 *
 * Returns:
 * - true if the combined ranges cover the full desired range
 * - false if there’s any uncovered gap
 */
function isRangeFullyCovered(desired: NumericRange, availableRanges: NumericRange[]): boolean {
  if (availableRanges.length === 0) return false;

  // Sort the ranges based on their starting point
  const sorted = [...availableRanges].sort((a, b) => a.min - b.min);

  // Merge overlapping or adjacent ranges
  const merged: NumericRange[] = [];
  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    // If the next range starts before or right after the current one ends,
    // merge them into a single continuous range
    if (next.min <= current.max + 1) {
      current.max = Math.max(current.max, next.max);
    } else {
      // Otherwise, push the current range and move to the next
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);

  // Now check if the merged ranges cover the desired range completely
  let coverageStart = desired.min;

  for (const range of merged) {
    // If there’s a gap before this range starts, coverage fails
    if (range.min > coverageStart) return false;

    // If this range reaches or passes the desired max, full coverage achieved
    if (range.max >= desired.max) return true;

    // Otherwise, move the coverage point forward
    coverageStart = range.max + 1;
  }

  // If we reach here, it means the desired range wasn’t fully covered
  return false;
}

/**
 * Main function that checks if the provided hardware cameras
 * can cover both the desired distance range and light range.
 *
 * Steps:
 * 1. Collect all the distance ranges and light ranges from the cameras.
 * 2. Use `isRangeFullyCovered()` to check each dimension separately.
 * 3. Return true only if both distance and light are fully covered.
 *
 * Example:
 * If the desired distance is [1–10] and light is [5–15],
 * and the cameras together can handle all values in those ranges,
 * this function returns true.
 */
function canCamerasCoverDesiredRange(
  desiredDistance: NumericRange,
  desiredLight: NumericRange,
  hardwareCameras: CameraSpec[]
): boolean {
  const distanceRanges = hardwareCameras.map((c) => c.distance);
  const lightRanges = hardwareCameras.map((c) => c.light);

  const distanceCovered = isRangeFullyCovered(desiredDistance, distanceRanges);
  const lightCovered = isRangeFullyCovered(desiredLight, lightRanges);

  return distanceCovered && lightCovered;
}


// ---------- Tests ----------
const tests = [
  {
    name: "✅ Full coverage with two complementary cameras",
    expected: true,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 100, max: 500 },
      cameras: [
        { distance: { min: 1, max: 5 }, light: { min: 100, max: 300 } },
        { distance: { min: 6, max: 10 }, light: { min: 301, max: 500 } },
      ],
    },
  },
  {
    name: "❌ Gap in distance coverage",
    expected: false,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 100, max: 500 },
      cameras: [
        { distance: { min: 1, max: 4 }, light: { min: 100, max: 500 } },
        { distance: { min: 6, max: 10 }, light: { min: 100, max: 500 } },
      ],
    },
  },
  {
    name: "✅ Overlapping ranges merge correctly",
    expected: true,
    input: {
      desiredDistance: { min: 1, max: 8 },
      desiredLight: { min: 50, max: 200 },
      cameras: [
        { distance: { min: 1, max: 5 }, light: { min: 50, max: 150 } },
        { distance: { min: 4, max: 8 }, light: { min: 120, max: 200 } },
      ],
    },
  },
  {
    name: "❌ Light range not fully covered",
    expected: false,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 100, max: 600 },
      cameras: [
        { distance: { min: 1, max: 10 }, light: { min: 100, max: 500 } },
      ],
    },
  },
  {
    name: "❌ Empty camera list",
    expected: false,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 100, max: 500 },
      cameras: [],
    },
  },
  {
    name: "✅ Single camera covers everything",
    expected: true,
    input: {
      desiredDistance: { min: 1, max: 100 },
      desiredLight: { min: 10, max: 1000 },
      cameras: [
        { distance: { min: 1, max: 100 }, light: { min: 10, max: 1000 } },
      ],
    },
  },
  {
    name: "✅ Multiple small cameras form full coverage",
    expected: true,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 1, max: 10 },
      cameras: [
        { distance: { min: 1, max: 3 }, light: { min: 1, max: 4 } },
        { distance: { min: 4, max: 6 }, light: { min: 5, max: 7 } },
        { distance: { min: 7, max: 10 }, light: { min: 8, max: 10 } },
      ],
    },
  },
  {
    name: "❌ Non-overlapping light ranges with gaps",
    expected: false,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 1, max: 10 },
      cameras: [
        { distance: { min: 1, max: 10 }, light: { min: 1, max: 3 } },
        { distance: { min: 1, max: 10 }, light: { min: 5, max: 10 } },
      ],
    },
  },
  {
    name: "✅ Adjacent ranges merge successfully",
    expected: true,
    input: {
      desiredDistance: { min: 1, max: 6 },
      desiredLight: { min: 100, max: 200 },
      cameras: [
        { distance: { min: 1, max: 3 }, light: { min: 100, max: 150 } },
        { distance: { min: 4, max: 6 }, light: { min: 151, max: 200 } },
      ],
    },
  },
  {
    name: "❌ Partial coverage only on one dimension (light insufficient)",
    expected: false,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 100, max: 200 },
      cameras: [
        { distance: { min: 1, max: 10 }, light: { min: 100, max: 150 } },
      ],
    },
  },
  {
    name: "✅ Unordered camera list handled correctly",
    expected: true,
    input: {
      desiredDistance: { min: 1, max: 10 },
      desiredLight: { min: 10, max: 50 },
      cameras: [
        { distance: { min: 6, max: 10 }, light: { min: 30, max: 50 } },
        { distance: { min: 1, max: 5 }, light: { min: 10, max: 29 } },
      ],
    },
  },
  {
    name: "❌ Disjoint camera ranges fail coverage",
    expected: false,
    input: {
      desiredDistance: { min: 1, max: 3 },
      desiredLight: { min: 1, max: 3 },
      cameras: [
        { distance: { min: 5, max: 10 }, light: { min: 5, max: 10 } },
      ],
    },
  },
];

// ---------- Execute Tests ----------
console.log("=== SOFTWARE CAMERA COVERAGE TESTS ===\n");
for (const t of tests) {
  const actual = canCamerasCoverDesiredRange(
    t.input.desiredDistance,
    t.input.desiredLight,
    t.input.cameras
  );
  console.log(`${t.name}: ${actual} (expected ${t.expected})`);
}
