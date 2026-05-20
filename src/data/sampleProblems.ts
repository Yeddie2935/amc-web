import type { Problem } from "../types/amc";
import { amc2001Problems } from "./amc2001Problems";

/**
 * Clean structured import: 1999 AMC 8 Problems 1–25.
 * Each problem has typed statement text, answer choices, an original solution,
 * and an animation storyboard for the Fun Math Journey site.
 */
const legacySampleProblems: Problem[] = [
  {
    "id": "amc8-1999-01",
    "title": "1999 AMC 8 Problem 1: Missing Operation",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Order of operations",
    "difficulty": 1,
    "statement": "(6 ? 3) + 4 − (2 − 1) = 5. To make this statement true, what operation should replace the question mark between 6 and 3?",
    "choices": [
      {
        "label": "A",
        "text": "÷"
      },
      {
        "label": "B",
        "text": "×"
      },
      {
        "label": "C",
        "text": "+"
      },
      {
        "label": "D",
        "text": "−"
      },
      {
        "label": "E",
        "text": "None of these"
      }
    ],
    "answer": "A",
    "shortAnswer": "÷",
    "solutionSteps": [
      {
        "title": "Test division",
        "body": "Use the operation from choice A and simplify inside the parentheses first.",
        "equation": "(6 ÷ 3) + 4 − (2 − 1)"
      },
      {
        "title": "Simplify",
        "body": "Since 6 ÷ 3 = 2 and 2 − 1 = 1, the expression becomes 2 + 4 − 1.",
        "equation": "2 + 4 − 1 = 5"
      },
      {
        "title": "Conclude",
        "body": "Division makes the statement true, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the blank operation",
        "narration": "Display the equation with a large blank between 6 and 3.",
        "visualHint": "The expression (6 ? 3) + 4 − (2 − 1) = 5 appears."
      },
      {
        "title": "Try division",
        "narration": "Replace the blank with division and simplify the two parentheses.",
        "visualHint": "Animate 6 ÷ 3 becoming 2 and 2 − 1 becoming 1."
      },
      {
        "title": "Check the result",
        "narration": "Add and subtract left to right to confirm the equation equals 5.",
        "visualHint": "The expression becomes 2 + 4 − 1 = 5, then choice A is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "algebra",
      "order of operations",
      "arithmetic"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-02",
    "title": "1999 AMC 8 Problem 2: Clock Angle at 10:00",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 2,
    "category": "Geometry",
    "subcategory": "Angles",
    "difficulty": 1,
    "statement": "What is the degree measure of the smaller angle formed by the hands of a clock at 10 o'clock?",
    "choices": [
      {
        "label": "A",
        "text": "30"
      },
      {
        "label": "B",
        "text": "45"
      },
      {
        "label": "C",
        "text": "60"
      },
      {
        "label": "D",
        "text": "75"
      },
      {
        "label": "E",
        "text": "90"
      }
    ],
    "answer": "C",
    "shortAnswer": "60°",
    "solutionSteps": [
      {
        "title": "Use clock spacing",
        "body": "A clock has 12 equal spaces around 360 degrees, so each hour mark is 30 degrees apart.",
        "equation": "360° ÷ 12 = 30°"
      },
      {
        "title": "Count the spaces",
        "body": "At 10:00, the minute hand points to 12 and the hour hand points to 10. The smaller angle spans 2 hour spaces.",
        "equation": "2 × 30° = 60°"
      },
      {
        "title": "Conclude",
        "body": "The smaller angle is 60 degrees, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Draw the clock",
        "narration": "Show a clock with the minute hand at 12 and the hour hand at 10.",
        "visualHint": "Highlight the two hour gaps from 10 to 12."
      },
      {
        "title": "Measure one gap",
        "narration": "Label each hour gap as 30 degrees.",
        "visualHint": "360° is split into 12 equal parts."
      },
      {
        "title": "Add the gaps",
        "narration": "Two gaps make the smaller angle.",
        "visualHint": "30° + 30° = 60°, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "geometry",
      "clock",
      "angles"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-03",
    "title": "1999 AMC 8 Problem 3: Triplet Sum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Fractions and decimals",
    "difficulty": 1,
    "statement": "Which triplet of numbers has a sum NOT equal to 1?",
    "choices": [
      {
        "label": "A",
        "text": "(1/2, 1/3, 1/6)"
      },
      {
        "label": "B",
        "text": "(2, −2, 1)"
      },
      {
        "label": "C",
        "text": "(0.1, 0.3, 0.6)"
      },
      {
        "label": "D",
        "text": "(1.1, −2.1, 1.0)"
      },
      {
        "label": "E",
        "text": "(−3/2, −5/2, 5)"
      }
    ],
    "answer": "D",
    "shortAnswer": "(1.1, −2.1, 1.0)",
    "solutionSteps": [
      {
        "title": "Check the easy sums",
        "body": "Choices A, B, and C each add to 1.",
        "equation": "1/2 + 1/3 + 1/6 = 1; 2 − 2 + 1 = 1; 0.1 + 0.3 + 0.6 = 1"
      },
      {
        "title": "Check choice D",
        "body": "Add the numbers in choice D.",
        "equation": "1.1 − 2.1 + 1.0 = 0"
      },
      {
        "title": "Conclude",
        "body": "Choice D has sum 0, not 1. Therefore the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "List the triplets",
        "narration": "Show the five answer choices as rows.",
        "visualHint": "Each row has a small sum box next to it."
      },
      {
        "title": "Compute D",
        "narration": "Highlight choice D and add 1.1 and 1.0 first, then subtract 2.1.",
        "visualHint": "1.1 + 1.0 = 2.1, and 2.1 − 2.1 = 0."
      },
      {
        "title": "Find the odd one out",
        "narration": "Mark D as the only triplet whose sum is not 1.",
        "visualHint": "Choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "algebra",
      "fractions",
      "decimals",
      "addition"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-04",
    "title": "1999 AMC 8 Problem 4: Biker Distance Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Graph interpretation",
    "difficulty": 1,
    "statement": "The diagram shows the miles traveled by bikers Alberto and Bjorn. After four hours, about how many more miles has Alberto biked than Bjorn? In the graph, Alberto is at about 60 miles after 4 hours, while Bjorn is at about 35 miles after 4 hours.",
    "choices": [
      {
        "label": "A",
        "text": "15"
      },
      {
        "label": "B",
        "text": "20"
      },
      {
        "label": "C",
        "text": "25"
      },
      {
        "label": "D",
        "text": "30"
      },
      {
        "label": "E",
        "text": "35"
      }
    ],
    "answer": "C",
    "shortAnswer": "25 miles",
    "solutionSteps": [
      {
        "title": "Read Alberto's distance",
        "body": "At 4 hours, Alberto's line is near 60 miles."
      },
      {
        "title": "Read Bjorn's distance",
        "body": "At 4 hours, Bjorn's line is near 35 miles."
      },
      {
        "title": "Subtract",
        "body": "The difference is about 60 − 35 = 25 miles, so the answer is C.",
        "equation": "60 − 35 = 25"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the graph",
        "narration": "Display the distance-time graph with the 4-hour mark highlighted.",
        "visualHint": "A vertical line rises from x = 4."
      },
      {
        "title": "Read both riders",
        "narration": "Mark Alberto near 60 miles and Bjorn near 35 miles.",
        "visualHint": "Two dots appear on the riders' lines."
      },
      {
        "title": "Compare distances",
        "narration": "Subtract Bjorn's distance from Alberto's distance.",
        "visualHint": "60 − 35 = 25 appears, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "graph",
      "rates",
      "subtraction",
      "estimation"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-05",
    "title": "1999 AMC 8 Problem 5: Garden Shape Change",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 5,
    "category": "Geometry",
    "subcategory": "Area and perimeter",
    "difficulty": 1,
    "statement": "A rectangular garden 50 feet long and 10 feet wide is enclosed by a fence. To make the garden larger, while using the same fence, its shape is changed to a square. By how many square feet does this enlarge the garden?",
    "choices": [
      {
        "label": "A",
        "text": "100"
      },
      {
        "label": "B",
        "text": "200"
      },
      {
        "label": "C",
        "text": "300"
      },
      {
        "label": "D",
        "text": "400"
      },
      {
        "label": "E",
        "text": "500"
      }
    ],
    "answer": "D",
    "shortAnswer": "400 square feet",
    "solutionSteps": [
      {
        "title": "Find the original area",
        "body": "The rectangular garden has area length times width.",
        "equation": "50 × 10 = 500"
      },
      {
        "title": "Use the same fence",
        "body": "The rectangle's perimeter is 2(50 + 10) = 120 feet. A square with perimeter 120 has side length 30.",
        "equation": "120 ÷ 4 = 30"
      },
      {
        "title": "Find the increase",
        "body": "The square area is 30 × 30 = 900, so the increase is 900 − 500 = 400.",
        "equation": "900 − 500 = 400"
      }
    ],
    "animationFrames": [
      {
        "title": "Draw the rectangle",
        "narration": "Show a 50 by 10 rectangle and compute its area.",
        "visualHint": "50 × 10 = 500 appears inside the rectangle."
      },
      {
        "title": "Reuse the fence",
        "narration": "Stretch the same 120 feet of fence into a square.",
        "visualHint": "Perimeter 120 becomes four equal sides of 30."
      },
      {
        "title": "Compare areas",
        "narration": "Show the square area and subtract the rectangle area.",
        "visualHint": "900 − 500 = 400, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "geometry",
      "area",
      "perimeter",
      "square",
      "rectangle"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-06",
    "title": "1999 AMC 8 Problem 6: Who Has the Least Money?",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 6,
    "category": "Logic",
    "subcategory": "Inequalities",
    "difficulty": 2,
    "statement": "Bo, Coe, Flo, Joe, and Moe have different amounts of money. Neither Jo nor Bo has as much money as Flo. Both Bo and Coe have more than Moe. Jo has more than Moe, but less than Bo. Who has the least amount of money?",
    "choices": [
      {
        "label": "A",
        "text": "Bo"
      },
      {
        "label": "B",
        "text": "Coe"
      },
      {
        "label": "C",
        "text": "Flo"
      },
      {
        "label": "D",
        "text": "Joe"
      },
      {
        "label": "E",
        "text": "Moe"
      }
    ],
    "answer": "E",
    "shortAnswer": "Moe",
    "solutionSteps": [
      {
        "title": "Translate the clues",
        "body": "Neither Jo nor Bo has as much as Flo, so Flo has more than Jo and Bo. Bo and Coe both have more than Moe. Jo is also more than Moe but less than Bo."
      },
      {
        "title": "Focus on Moe",
        "body": "The clues directly say Bo > Moe, Coe > Moe, and Jo > Moe. Also Flo is greater than Bo and Jo, so Flo is not least."
      },
      {
        "title": "Conclude",
        "body": "Every other named person is above Moe, so Moe has the least money."
      }
    ],
    "animationFrames": [
      {
        "title": "Make a ranking board",
        "narration": "Show the five names as movable cards.",
        "visualHint": "Cards labeled Bo, Coe, Flo, Joe, Moe appear."
      },
      {
        "title": "Apply the clues",
        "narration": "Move Bo, Coe, and Joe above Moe. Then move Flo above Bo and Joe.",
        "visualHint": "Arrows show Bo > Moe, Coe > Moe, Joe > Moe, Flo > Bo."
      },
      {
        "title": "Identify the bottom",
        "narration": "The only person below everyone else is Moe.",
        "visualHint": "Moe drops to the bottom and choice E is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "logic",
      "inequalities",
      "ranking"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-07",
    "title": "1999 AMC 8 Problem 7: Service Center Milepost",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Fractions of an interval",
    "difficulty": 2,
    "statement": "The third exit on a highway is located at milepost 40 and the tenth exit is at milepost 160. There is a service center located three-fourths of the way from the third exit to the tenth exit. At what milepost would you expect to find this service center?",
    "choices": [
      {
        "label": "A",
        "text": "90"
      },
      {
        "label": "B",
        "text": "100"
      },
      {
        "label": "C",
        "text": "110"
      },
      {
        "label": "D",
        "text": "120"
      },
      {
        "label": "E",
        "text": "130"
      }
    ],
    "answer": "E",
    "shortAnswer": "130",
    "solutionSteps": [
      {
        "title": "Find the distance between exits",
        "body": "The distance from milepost 40 to milepost 160 is 120 miles.",
        "equation": "160 − 40 = 120"
      },
      {
        "title": "Take three-fourths",
        "body": "Three-fourths of 120 is 90.",
        "equation": "3/4 × 120 = 90"
      },
      {
        "title": "Add to the starting milepost",
        "body": "Starting at milepost 40, go 90 more miles: 40 + 90 = 130.",
        "equation": "40 + 90 = 130"
      }
    ],
    "animationFrames": [
      {
        "title": "Draw a number line",
        "narration": "Show milepost 40 on the left and 160 on the right.",
        "visualHint": "The segment between them is labeled 120 miles."
      },
      {
        "title": "Mark three-fourths",
        "narration": "Divide the segment into four equal parts and move three parts from 40.",
        "visualHint": "Each part is 30 miles; three parts are 90 miles."
      },
      {
        "title": "Find the milepost",
        "narration": "Add 90 to 40.",
        "visualHint": "40 + 90 = 130, then choice E is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "algebra",
      "fractions",
      "number line"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-08",
    "title": "1999 AMC 8 Problem 8: Cube Net Opposite Face",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Spatial reasoning",
    "difficulty": 2,
    "statement": "Six squares are colored, front and back, and hinged together in a cube net. The net has G in the center, B above G, R to the left of B, Y to the right of G, O to the right of Y, and W below Y. When folded into a cube, which face is opposite the white face W?",
    "choices": [
      {
        "label": "A",
        "text": "B"
      },
      {
        "label": "B",
        "text": "G"
      },
      {
        "label": "C",
        "text": "O"
      },
      {
        "label": "D",
        "text": "R"
      },
      {
        "label": "E",
        "text": "Y"
      }
    ],
    "answer": "A",
    "shortAnswer": "B",
    "solutionSteps": [
      {
        "title": "Use the net layout",
        "body": "Think of G as a central face. Y folds to one side of G, and B folds to another side of G."
      },
      {
        "title": "Track W",
        "body": "Because W is attached below Y, when Y folds up, W folds around to become the face opposite B."
      },
      {
        "title": "Conclude",
        "body": "The face opposite W is B, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the cube net",
        "narration": "Display the net with G in the center, B above G, R left of B, Y right of G, O right of Y, and W below Y.",
        "visualHint": "The W and B squares are highlighted."
      },
      {
        "title": "Fold around G",
        "narration": "Fold Y up from the right of G and B up from the top of G.",
        "visualHint": "Y and B rotate into adjacent cube faces."
      },
      {
        "title": "Fold W into place",
        "narration": "Rotate W around Y and show it landing opposite B.",
        "visualHint": "A line connects W and B as opposite faces, then choice A is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "geometry",
      "cube net",
      "spatial reasoning"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-09",
    "title": "1999 AMC 8 Problem 9: Overlapping Flower Beds",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 9,
    "category": "Counting & Probability",
    "subcategory": "Inclusion-exclusion",
    "difficulty": 2,
    "statement": "Three flower beds overlap as shown. Bed A has 500 plants, bed B has 450 plants, and bed C has 350 plants. Beds A and B share 50 plants, while beds A and C share 100 plants. Beds B and C do not overlap. What is the total number of plants?",
    "choices": [
      {
        "label": "A",
        "text": "850"
      },
      {
        "label": "B",
        "text": "1000"
      },
      {
        "label": "C",
        "text": "1150"
      },
      {
        "label": "D",
        "text": "1300"
      },
      {
        "label": "E",
        "text": "1450"
      }
    ],
    "answer": "C",
    "shortAnswer": "1150",
    "solutionSteps": [
      {
        "title": "Add the bed totals",
        "body": "Start by adding all three bed counts.",
        "equation": "500 + 450 + 350 = 1300"
      },
      {
        "title": "Subtract double-counted plants",
        "body": "Plants in the overlaps A∩B and A∩C were counted twice, so subtract them once.",
        "equation": "50 + 100 = 150"
      },
      {
        "title": "Compute total",
        "body": "The total is 1300 − 150 = 1150, so the answer is C.",
        "equation": "1300 − 150 = 1150"
      }
    ],
    "animationFrames": [
      {
        "title": "Show three regions",
        "narration": "Draw the three flower beds with A overlapping B and C.",
        "visualHint": "Label A = 500, B = 450, C = 350."
      },
      {
        "title": "Spot double-counting",
        "narration": "Highlight the overlaps: A and B share 50, A and C share 100.",
        "visualHint": "The two overlap regions glow."
      },
      {
        "title": "Use inclusion-exclusion",
        "narration": "Add all beds and subtract the overlaps once.",
        "visualHint": "500 + 450 + 350 − 50 − 100 = 1150, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "counting",
      "sets",
      "inclusion-exclusion",
      "overlap"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-1999-10",
    "title": "1999 AMC 8 Problem 10: Traffic Light Probability",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 1999,
    "problemNumber": 10,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "A complete cycle of a traffic light takes 60 seconds. During each cycle the light is green for 25 seconds, yellow for 5 seconds, and red for 30 seconds. At a randomly chosen time, what is the probability that the light will NOT be green?",
    "choices": [
      {
        "label": "A",
        "text": "1/4"
      },
      {
        "label": "B",
        "text": "1/3"
      },
      {
        "label": "C",
        "text": "5/12"
      },
      {
        "label": "D",
        "text": "1/2"
      },
      {
        "label": "E",
        "text": "7/12"
      }
    ],
    "answer": "E",
    "shortAnswer": "7/12",
    "solutionSteps": [
      {
        "title": "Find non-green time",
        "body": "Not green means yellow or red. Yellow lasts 5 seconds and red lasts 30 seconds.",
        "equation": "5 + 30 = 35"
      },
      {
        "title": "Divide by total time",
        "body": "The full cycle is 60 seconds, so the probability is 35/60.",
        "equation": "35/60"
      },
      {
        "title": "Simplify",
        "body": "Divide numerator and denominator by 5 to get 7/12.",
        "equation": "35/60 = 7/12"
      }
    ],
    "animationFrames": [
      {
        "title": "Draw a 60-second timeline",
        "narration": "Show a bar split into green, yellow, and red sections.",
        "visualHint": "Green = 25, yellow = 5, red = 30."
      },
      {
        "title": "Highlight not green",
        "narration": "Highlight the yellow and red sections together.",
        "visualHint": "Yellow + red is labeled 35 seconds."
      },
      {
        "title": "Make the probability",
        "narration": "Put non-green time over total cycle time and simplify.",
        "visualHint": "35/60 = 7/12, then choice E is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "1999",
      "probability",
      "traffic light",
      "fractions"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
      "id": "amc8-1999-11",
      "title": "1999 AMC 8 Problem 11: Equal Cross Sums",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 11,
      "category": "Logic",
      "subcategory": "Equal sums",
      "difficulty": 3,
      "statement": "Each of the five numbers 1, 4, 7, 10, and 13 is placed in one of the five squares of a cross-shaped figure. The sum of the three numbers in the horizontal row equals the sum of the three numbers in the vertical column. What is the largest possible value of this common sum?",
      "choices": [
        {
          "label": "A",
          "text": "20"
        },
        {
          "label": "B",
          "text": "21"
        },
        {
          "label": "C",
          "text": "22"
        },
        {
          "label": "D",
          "text": "24"
        },
        {
          "label": "E",
          "text": "30"
        }
      ],
      "answer": "D",
      "shortAnswer": "24",
      "solutionSteps": [
        {
          "title": "Notice the center is counted twice",
          "body": "The horizontal and vertical sums share the center square. If the common sum is S and the center number is c, then the total of all five numbers is 2S − c."
        },
        {
          "title": "Use the total",
          "body": "The five numbers add to 35, so 2S − c = 35. Therefore S = (35 + c)/2.",
          "equation": "1 + 4 + 7 + 10 + 13 = 35"
        },
        {
          "title": "Maximize the center",
          "body": "To make S as large as possible, use the largest possible center that still gives equal outside pairs. Put 13 in the center. Then S = (35 + 13)/2 = 24.",
          "equation": "S = (35 + 13)/2 = 24"
        },
        {
          "title": "Check it is possible",
          "body": "The remaining numbers can pair as 1 + 10 = 11 and 4 + 7 = 11, so both arms can have sum 11 plus the center 13. The common sum is 24."
        }
      ],
      "animationFrames": [
        {
          "title": "Show the cross",
          "narration": "Place five empty squares in a plus-sign shape and label the center as the shared square.",
          "visualHint": "The center square glows because both the row and column use it."
        },
        {
          "title": "Count the total two ways",
          "narration": "Add the horizontal sum and the vertical sum. The center gets counted twice.",
          "visualHint": "Show 2S − center = 35."
        },
        {
          "title": "Choose the largest center",
          "narration": "Put 13 in the center and pair the remaining numbers into equal sums.",
          "visualHint": "1 + 10 and 4 + 7 both become 11; 11 + 13 = 24."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "logic",
        "algebra",
        "equal sums",
        "casework"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-12",
      "title": "1999 AMC 8 Problem 12: Win-Loss Ratio",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 12,
      "category": "Algebra",
      "subcategory": "Ratios and percents",
      "difficulty": 2,
      "statement": "The ratio of the number of games won to the number of games lost, with no ties, by the Middle School Middies is 11:4. To the nearest whole percent, what percent of its games did the team lose?",
      "choices": [
        {
          "label": "A",
          "text": "24"
        },
        {
          "label": "B",
          "text": "27"
        },
        {
          "label": "C",
          "text": "36"
        },
        {
          "label": "D",
          "text": "45"
        },
        {
          "label": "E",
          "text": "73"
        }
      ],
      "answer": "B",
      "shortAnswer": "27%",
      "solutionSteps": [
        {
          "title": "Count ratio parts",
          "body": "The ratio 11:4 means 11 win parts and 4 loss parts, for 15 total parts.",
          "equation": "11 + 4 = 15"
        },
        {
          "title": "Make the loss fraction",
          "body": "The fraction of games lost is 4 out of 15.",
          "equation": "4/15 ≈ 0.2667"
        },
        {
          "title": "Convert to a percent",
          "body": "About 26.67% rounds to 27%, so the answer is B."
        }
      ],
      "animationFrames": [
        {
          "title": "Build a ratio bar",
          "narration": "Show 11 blue win blocks and 4 red loss blocks.",
          "visualHint": "There are 15 total blocks."
        },
        {
          "title": "Highlight losses",
          "narration": "Focus on the 4 loss blocks out of 15 total.",
          "visualHint": "The fraction 4/15 appears."
        },
        {
          "title": "Round the percent",
          "narration": "Convert 4/15 to about 26.67 percent and round.",
          "visualHint": "26.67% rounds to 27%, then choice B is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "ratio",
        "percent"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-13",
      "title": "1999 AMC 8 Problem 13: Computer Camp Average Age",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 13,
      "category": "Algebra",
      "subcategory": "Averages",
      "difficulty": 3,
      "statement": "The average age of the 40 members of a computer science camp is 17 years. There are 20 girls, 15 boys, and 5 adults. If the average age of the girls is 15 and the average age of the boys is 16, what is the average age of the adults?",
      "choices": [
        {
          "label": "A",
          "text": "26"
        },
        {
          "label": "B",
          "text": "27"
        },
        {
          "label": "C",
          "text": "28"
        },
        {
          "label": "D",
          "text": "29"
        },
        {
          "label": "E",
          "text": "30"
        }
      ],
      "answer": "C",
      "shortAnswer": "28",
      "solutionSteps": [
        {
          "title": "Find the total age",
          "body": "Forty people with average age 17 have total age 680.",
          "equation": "40 × 17 = 680"
        },
        {
          "title": "Subtract girls and boys",
          "body": "The girls total 20 × 15 = 300 years, and the boys total 15 × 16 = 240 years.",
          "equation": "680 − 300 − 240 = 140"
        },
        {
          "title": "Average the adults",
          "body": "The 5 adults have total age 140, so their average age is 28.",
          "equation": "140 ÷ 5 = 28"
        }
      ],
      "animationFrames": [
        {
          "title": "Show total age",
          "narration": "Turn the overall average into a total age.",
          "visualHint": "40 × 17 = 680 appears."
        },
        {
          "title": "Remove known groups",
          "narration": "Subtract the girls' total age and the boys' total age.",
          "visualHint": "680 − 300 − 240 = 140."
        },
        {
          "title": "Divide among adults",
          "narration": "Split the remaining 140 years among 5 adults.",
          "visualHint": "140 ÷ 5 = 28, then choice C is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "averages",
        "weighted average"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-14",
      "title": "1999 AMC 8 Problem 14: Isosceles Trapezoid Perimeter",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 14,
      "category": "Geometry",
      "subcategory": "Trapezoids and right triangles",
      "difficulty": 3,
      "statement": "In trapezoid ABCD, sides AB and CD are equal. The bases have lengths BC = 8 and AD = 16, and the height is 3. What is the perimeter of ABCD?",
      "choices": [
        {
          "label": "A",
          "text": "27"
        },
        {
          "label": "B",
          "text": "30"
        },
        {
          "label": "C",
          "text": "32"
        },
        {
          "label": "D",
          "text": "34"
        },
        {
          "label": "E",
          "text": "48"
        }
      ],
      "answer": "D",
      "shortAnswer": "34",
      "solutionSteps": [
        {
          "title": "Use symmetry",
          "body": "Because the trapezoid has equal legs, the extra length of the longer base is split evenly on the two sides.",
          "equation": "16 − 8 = 8, so each side offset is 4"
        },
        {
          "title": "Find one leg",
          "body": "Each leg is the hypotenuse of a right triangle with legs 3 and 4.",
          "equation": "AB = CD = √(3² + 4²) = 5"
        },
        {
          "title": "Add the sides",
          "body": "The perimeter is 16 + 8 + 5 + 5 = 34.",
          "equation": "16 + 8 + 5 + 5 = 34"
        }
      ],
      "animationFrames": [
        {
          "title": "Drop the heights",
          "narration": "Drop vertical segments from the top base to the bottom base.",
          "visualHint": "The bottom base's extra 8 units split into two 4-unit pieces."
        },
        {
          "title": "Make a 3-4-5 triangle",
          "narration": "Each slanted side is a 3-4-5 right triangle hypotenuse.",
          "visualHint": "The leg length 5 appears on both sides."
        },
        {
          "title": "Add perimeter",
          "narration": "Add both bases and both equal legs.",
          "visualHint": "16 + 8 + 5 + 5 = 34, then choice D is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "geometry",
        "trapezoid",
        "pythagorean theorem",
        "perimeter"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-15",
      "title": "1999 AMC 8 Problem 15: Extra License Plates",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 15,
      "category": "Counting & Probability",
      "subcategory": "Counting choices",
      "difficulty": 3,
      "statement": "Bicycle license plates in Flatville each contain three letters. The first is chosen from {C, H, L, P, R}, the second from {A, I, O}, and the third from {D, M, N, T}. Flatville adds two new letters. Both new letters may be added to one set, or one may be added to one set and one to another set. What is the largest possible number of additional license plates that can be made?",
      "choices": [
        {
          "label": "A",
          "text": "24"
        },
        {
          "label": "B",
          "text": "30"
        },
        {
          "label": "C",
          "text": "36"
        },
        {
          "label": "D",
          "text": "40"
        },
        {
          "label": "E",
          "text": "60"
        }
      ],
      "answer": "D",
      "shortAnswer": "40",
      "solutionSteps": [
        {
          "title": "Count the original plates",
          "body": "There are 5 choices for the first letter, 3 for the second, and 4 for the third.",
          "equation": "5 × 3 × 4 = 60"
        },
        {
          "title": "Add letters where they help most",
          "body": "Adding to the smaller sets usually helps more. If the two new letters are added to the second set, the count becomes 5 × 5 × 4 = 100. If one is added to the second and one to the third, the count is also 5 × 4 × 5 = 100.",
          "equation": "5 × 5 × 4 = 100"
        },
        {
          "title": "Find the increase",
          "body": "The largest new total is 100 plates, so the number of additional plates is 100 − 60 = 40.",
          "equation": "100 − 60 = 40"
        }
      ],
      "animationFrames": [
        {
          "title": "Show three slots",
          "narration": "Display the license plate as three letter slots with 5, 3, and 4 choices.",
          "visualHint": "The product 5 × 3 × 4 = 60 appears."
        },
        {
          "title": "Try the best upgrade",
          "narration": "Put the two new letters into the smallest set, increasing the middle slot from 3 choices to 5.",
          "visualHint": "The product changes to 5 × 5 × 4 = 100."
        },
        {
          "title": "Compare totals",
          "narration": "Subtract the original number of plates from the new maximum.",
          "visualHint": "100 − 60 = 40, then choice D is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "counting",
        "multiplication principle",
        "optimization"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-16",
      "title": "1999 AMC 8 Problem 16: Passing Score Needed",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 16,
      "category": "Algebra",
      "subcategory": "Percents",
      "difficulty": 3,
      "statement": "Tori's mathematics test had 75 problems: 10 arithmetic, 30 algebra, and 35 geometry. She answered 70% of the arithmetic, 40% of the algebra, and 60% of the geometry problems correctly. She did not pass because she got less than 60% of all the problems right. How many more problems would she have needed to answer correctly to earn a 60% passing grade?",
      "choices": [
        {
          "label": "A",
          "text": "1"
        },
        {
          "label": "B",
          "text": "5"
        },
        {
          "label": "C",
          "text": "7"
        },
        {
          "label": "D",
          "text": "9"
        },
        {
          "label": "E",
          "text": "11"
        }
      ],
      "answer": "B",
      "shortAnswer": "5",
      "solutionSteps": [
        {
          "title": "Count correct answers by topic",
          "body": "She got 7 arithmetic, 12 algebra, and 21 geometry problems correct.",
          "equation": "70% of 10 = 7, 40% of 30 = 12, 60% of 35 = 21"
        },
        {
          "title": "Find her total correct",
          "body": "Add the correct answers.",
          "equation": "7 + 12 + 21 = 40"
        },
        {
          "title": "Find passing score",
          "body": "Sixty percent of 75 is 45, so she needed 45 correct answers. She had 40, so she needed 5 more.",
          "equation": "0.60 × 75 = 45; 45 − 40 = 5"
        }
      ],
      "animationFrames": [
        {
          "title": "Split the test",
          "narration": "Show three bars: arithmetic 10, algebra 30, geometry 35.",
          "visualHint": "Correct portions become 7, 12, and 21."
        },
        {
          "title": "Add her score",
          "narration": "Add the correct answers to get her actual score.",
          "visualHint": "7 + 12 + 21 = 40."
        },
        {
          "title": "Compare to passing",
          "narration": "Mark 60 percent of 75 as the passing line.",
          "visualHint": "45 − 40 = 5, then choice B is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "percent",
        "arithmetic"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-17",
      "title": "1999 AMC 8 Problem 17: Cookie Eggs",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 17,
      "category": "Algebra",
      "subcategory": "Rates and rounding",
      "difficulty": 2,
      "statement": "At Central Middle School, 108 students will eat an average of two cookies apiece. A cookie recipe makes 15 cookies and uses 2 eggs. Walter can buy eggs by the half-dozen. How many half-dozens should he buy to make enough cookies, with some eggs and some cookies possibly left over?",
      "choices": [
        {
          "label": "A",
          "text": "1"
        },
        {
          "label": "B",
          "text": "2"
        },
        {
          "label": "C",
          "text": "5"
        },
        {
          "label": "D",
          "text": "7"
        },
        {
          "label": "E",
          "text": "15"
        }
      ],
      "answer": "C",
      "shortAnswer": "5 half-dozens",
      "solutionSteps": [
        {
          "title": "Find cookies needed",
          "body": "There are 108 students and each gets 2 cookies.",
          "equation": "108 × 2 = 216"
        },
        {
          "title": "Find full recipes",
          "body": "Each recipe makes 15 cookies. Since 216/15 = 14.4, they must make 15 full recipes.",
          "equation": "ceil(216 ÷ 15) = 15"
        },
        {
          "title": "Count eggs",
          "body": "Each recipe uses 2 eggs, so 15 recipes need 30 eggs. Since a half-dozen is 6 eggs, they need 5 half-dozens.",
          "equation": "15 × 2 = 30; 30 ÷ 6 = 5"
        }
      ],
      "animationFrames": [
        {
          "title": "Count cookie demand",
          "narration": "Multiply 108 students by 2 cookies each.",
          "visualHint": "216 cookies needed."
        },
        {
          "title": "Round recipes up",
          "narration": "Divide by 15 cookies per recipe and round up because partial recipes are not allowed.",
          "visualHint": "14.4 becomes 15 recipes."
        },
        {
          "title": "Convert eggs to half-dozens",
          "narration": "Use 2 eggs per recipe, then group the eggs into sixes.",
          "visualHint": "30 eggs = 5 half-dozens, then choice C is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "rounding",
        "multiplication",
        "cookies"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-18",
      "title": "1999 AMC 8 Problem 18: Smaller Cookie Party",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 18,
      "category": "Algebra",
      "subcategory": "Percents and rounding",
      "difficulty": 2,
      "statement": "The same cookie plan is used for 108 students eating an average of two cookies apiece, with each recipe making 15 cookies. They learn that attendance will be down 25%. How many recipes of cookies should they make for the smaller party, using only full recipes?",
      "choices": [
        {
          "label": "A",
          "text": "6"
        },
        {
          "label": "B",
          "text": "8"
        },
        {
          "label": "C",
          "text": "9"
        },
        {
          "label": "D",
          "text": "10"
        },
        {
          "label": "E",
          "text": "11"
        }
      ],
      "answer": "E",
      "shortAnswer": "11 recipes",
      "solutionSteps": [
        {
          "title": "Find new attendance",
          "body": "If attendance is down 25%, then 75% of the students attend.",
          "equation": "0.75 × 108 = 81"
        },
        {
          "title": "Find cookies needed",
          "body": "Each of the 81 students gets 2 cookies on average.",
          "equation": "81 × 2 = 162"
        },
        {
          "title": "Round recipes up",
          "body": "Each recipe makes 15 cookies, and only full recipes are allowed. Since 162/15 = 10.8, they need 11 recipes.",
          "equation": "ceil(162 ÷ 15) = 11"
        }
      ],
      "animationFrames": [
        {
          "title": "Shrink the group",
          "narration": "Show the attendance bar decreasing to 75 percent of 108.",
          "visualHint": "108 becomes 81 students."
        },
        {
          "title": "Count cookies",
          "narration": "Multiply the new attendance by 2 cookies each.",
          "visualHint": "81 × 2 = 162."
        },
        {
          "title": "Choose full recipes",
          "narration": "Divide by 15 and round up.",
          "visualHint": "10.8 rounds up to 11, then choice E is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "percent",
        "rounding",
        "cookies"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-19",
      "title": "1999 AMC 8 Problem 19: Cookie Butter Sticks",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 19,
      "category": "Algebra",
      "subcategory": "Unit conversion",
      "difficulty": 2,
      "statement": "The same cookie recipe makes 15 cookies and uses 3 tablespoons of butter. Walter and Gretel must make enough pans of cookies to supply 216 cookies. There are 8 tablespoons in a stick of butter. How many sticks of butter will be needed, with some butter possibly left over?",
      "choices": [
        {
          "label": "A",
          "text": "5"
        },
        {
          "label": "B",
          "text": "6"
        },
        {
          "label": "C",
          "text": "7"
        },
        {
          "label": "D",
          "text": "8"
        },
        {
          "label": "E",
          "text": "9"
        }
      ],
      "answer": "B",
      "shortAnswer": "6 sticks",
      "solutionSteps": [
        {
          "title": "Find full recipes",
          "body": "They need 216 cookies, and each recipe makes 15. Since 216/15 = 14.4, they need 15 full recipes.",
          "equation": "ceil(216 ÷ 15) = 15"
        },
        {
          "title": "Find tablespoons of butter",
          "body": "Each recipe uses 3 tablespoons of butter.",
          "equation": "15 × 3 = 45 tablespoons"
        },
        {
          "title": "Convert to sticks",
          "body": "Each stick has 8 tablespoons. Since 45/8 = 5.625, they need 6 whole sticks.",
          "equation": "ceil(45 ÷ 8) = 6"
        }
      ],
      "animationFrames": [
        {
          "title": "Round recipes up",
          "narration": "Divide 216 cookies by 15 per recipe and round up.",
          "visualHint": "14.4 becomes 15 recipes."
        },
        {
          "title": "Measure butter",
          "narration": "Multiply 15 recipes by 3 tablespoons each.",
          "visualHint": "45 tablespoons."
        },
        {
          "title": "Buy whole sticks",
          "narration": "Group tablespoons into sticks of 8 and round up.",
          "visualHint": "5.625 sticks becomes 6 sticks, then choice B is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "unit conversion",
        "rounding",
        "cookies"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-20",
      "title": "1999 AMC 8 Problem 20: Stack Map Front View",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 20,
      "category": "Geometry",
      "subcategory": "Spatial reasoning",
      "difficulty": 3,
      "statement": "A stack map gives the number of cubes stacked at each position. For the stack map in Figure 4, the back row has heights 2, 2, and 4, and the front row has heights 1, 3, and 1. Which answer choice is the front view?",
      "choices": [
        {
          "label": "A",
          "text": "A"
        },
        {
          "label": "B",
          "text": "B"
        },
        {
          "label": "C",
          "text": "C"
        },
        {
          "label": "D",
          "text": "D"
        },
        {
          "label": "E",
          "text": "E"
        }
      ],
      "answer": "B",
      "shortAnswer": "B",
      "solutionSteps": [
        {
          "title": "Use column maximums",
          "body": "From the front, each visible column height is the taller stack in that front-back column."
        },
        {
          "title": "Find the three visible heights",
          "body": "The left column has max(2, 1) = 2, the middle column has max(2, 3) = 3, and the right column has max(4, 1) = 4.",
          "equation": "2, 3, 4"
        },
        {
          "title": "Match the picture",
          "body": "The front view must rise from height 2 to 3 to 4 from left to right. That matches choice B."
        }
      ],
      "animationFrames": [
        {
          "title": "Show the stack map",
          "narration": "Display the 2-by-3 grid of stack heights.",
          "visualHint": "Back row: 2, 2, 4. Front row: 1, 3, 1."
        },
        {
          "title": "Look from the front",
          "narration": "For each left-to-right column, keep only the taller height.",
          "visualHint": "max(2,1), max(2,3), max(4,1)."
        },
        {
          "title": "Build the silhouette",
          "narration": "Draw the front view with heights 2, 3, and 4.",
          "visualHint": "The staircase silhouette matches choice B."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "geometry",
        "spatial reasoning",
        "3D",
        "stack map"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-21",
      "title": "1999 AMC 8 Problem 21: Star Angle",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 21,
      "category": "Geometry",
      "subcategory": "Angle chasing",
      "difficulty": 4,
      "statement": "In the star-shaped diagram, one tip angle is 40°. Two intersecting-line angles inside the star are marked 100° and 110°. What is the degree measure of angle A?",
      "choices": [
        {
          "label": "A",
          "text": "20"
        },
        {
          "label": "B",
          "text": "30"
        },
        {
          "label": "C",
          "text": "35"
        },
        {
          "label": "D",
          "text": "40"
        },
        {
          "label": "E",
          "text": "45"
        }
      ],
      "answer": "B",
      "shortAnswer": "30°",
      "solutionSteps": [
        {
          "title": "Turn obtuse angles into acute angles",
          "body": "The angle supplementary to 100° is 80°, and the angle supplementary to 110° is 70°.",
          "equation": "180° − 100° = 80°, 180° − 110° = 70°"
        },
        {
          "title": "Track line directions",
          "body": "The line through the 40° tip and the top of the star makes an 80° angle with the horizontal line. The other line from the 40° tip is therefore 40° lower, making a 40° angle with the horizontal."
        },
        {
          "title": "Use the 110° crossing",
          "body": "At the central crossing, the acute angle is 70°. So the line from A down to the lower right is 70° away from the 40° line, which puts it 30° below the horizontal."
        },
        {
          "title": "Conclude",
          "body": "Angle A is the angle between the horizontal line and that downward line, so A = 30°."
        }
      ],
      "animationFrames": [
        {
          "title": "Mark supplement angles",
          "narration": "Replace the 100° and 110° markings with their useful acute supplements.",
          "visualHint": "100° becomes 80°, and 110° becomes 70°."
        },
        {
          "title": "Follow the star lines",
          "narration": "Use the 40° tip to determine the direction of the next diagonal.",
          "visualHint": "A direction angle of 40° is shown from the horizontal."
        },
        {
          "title": "Find angle A",
          "narration": "Use the 70° crossing to locate the diagonal from A.",
          "visualHint": "The diagonal is 30° below the horizontal, so choice B is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "geometry",
        "angles",
        "angle chasing",
        "star"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-22",
      "title": "1999 AMC 8 Problem 22: Fish, Bread, and Rice",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 22,
      "category": "Algebra",
      "subcategory": "Unit rates",
      "difficulty": 2,
      "statement": "In a far-off land, three fish can be traded for two loaves of bread, and one loaf of bread can be traded for four bags of rice. How many bags of rice is one fish worth?",
      "choices": [
        {
          "label": "A",
          "text": "3/8"
        },
        {
          "label": "B",
          "text": "1/2"
        },
        {
          "label": "C",
          "text": "3/4"
        },
        {
          "label": "D",
          "text": "2 2/3"
        },
        {
          "label": "E",
          "text": "3 1/3"
        }
      ],
      "answer": "D",
      "shortAnswer": "2 2/3 bags",
      "solutionSteps": [
        {
          "title": "Convert bread to rice",
          "body": "Two loaves of bread are worth 8 bags of rice because each loaf is worth 4 bags.",
          "equation": "2 × 4 = 8"
        },
        {
          "title": "Connect fish to rice",
          "body": "Three fish are worth the same as two loaves, so three fish are worth 8 bags of rice."
        },
        {
          "title": "Find one fish",
          "body": "Divide by 3 to find the value of one fish.",
          "equation": "8 ÷ 3 = 8/3 = 2 2/3"
        }
      ],
      "animationFrames": [
        {
          "title": "Trade fish for bread",
          "narration": "Show 3 fish changing into 2 loaves of bread.",
          "visualHint": "3 fish = 2 loaves."
        },
        {
          "title": "Trade bread for rice",
          "narration": "Each loaf turns into 4 bags of rice.",
          "visualHint": "2 loaves = 8 bags."
        },
        {
          "title": "Divide among fish",
          "narration": "Split 8 bags of rice equally among 3 fish.",
          "visualHint": "8/3 = 2 2/3, then choice D is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "algebra",
        "rates",
        "unit conversion",
        "fractions"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-23",
      "title": "1999 AMC 8 Problem 23: Equal Areas in a Square",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 23,
      "category": "Geometry",
      "subcategory": "Coordinate geometry and area",
      "difficulty": 4,
      "statement": "Square ABCD has side length 3. Points M on AB and N on AD are chosen so that segments CM and CN divide the square's area into three equal parts. How long is segment CM?",
      "choices": [
        {
          "label": "A",
          "text": "√10"
        },
        {
          "label": "B",
          "text": "√12"
        },
        {
          "label": "C",
          "text": "√13"
        },
        {
          "label": "D",
          "text": "√14"
        },
        {
          "label": "E",
          "text": "√15"
        }
      ],
      "answer": "C",
      "shortAnswer": "√13",
      "solutionSteps": [
        {
          "title": "Find each region area",
          "body": "The square has area 9, so each of the three equal parts has area 3.",
          "equation": "3 × 3 = 9; 9 ÷ 3 = 3"
        },
        {
          "title": "Use triangle BCM",
          "body": "Triangle BCM has base BM on the left side and height 3. Its area must be 3, so BM = 2.",
          "equation": "(1/2)(BM)(3) = 3 → BM = 2"
        },
        {
          "title": "Locate M",
          "body": "Since AB = 3 and BM = 2, point M is 1 unit above A. With coordinates A=(0,0), B=(0,3), C=(3,3), we have M=(0,1)."
        },
        {
          "title": "Find CM",
          "body": "The horizontal distance from M to C is 3 and the vertical distance is 2, so CM = √(3² + 2²) = √13.",
          "equation": "CM = √(9 + 4) = √13"
        }
      ],
      "animationFrames": [
        {
          "title": "Divide the square area",
          "narration": "Show the square of side 3 and label each of the three regions as area 3.",
          "visualHint": "The total area 9 is split into 3, 3, and 3."
        },
        {
          "title": "Solve for M",
          "narration": "Focus on triangle BCM and use area to find BM.",
          "visualHint": "(1/2)(BM)(3) = 3, so BM = 2."
        },
        {
          "title": "Use Pythagorean theorem",
          "narration": "Show the right triangle from M to C with legs 3 and 2.",
          "visualHint": "CM = √13, then choice C is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "geometry",
        "area",
        "square",
        "pythagorean theorem",
        "coordinate geometry"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-24",
      "title": "1999 AMC 8 Problem 24: Remainder of a Power",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 24,
      "category": "Number Theory",
      "subcategory": "Modular arithmetic",
      "difficulty": 3,
      "statement": "When 1999^2000 is divided by 5, what is the remainder?",
      "choices": [
        {
          "label": "A",
          "text": "4"
        },
        {
          "label": "B",
          "text": "1"
        },
        {
          "label": "C",
          "text": "2"
        },
        {
          "label": "D",
          "text": "3"
        },
        {
          "label": "E",
          "text": "0"
        }
      ],
      "answer": "B",
      "shortAnswer": "1",
      "solutionSteps": [
        {
          "title": "Reduce the base",
          "body": "Only the remainder mod 5 matters. Since 1999 is 1 less than a multiple of 5, it is congruent to −1 mod 5.",
          "equation": "1999 ≡ 4 ≡ −1 (mod 5)"
        },
        {
          "title": "Use the even exponent",
          "body": "An even power of −1 is 1.",
          "equation": "(-1)^2000 = 1"
        },
        {
          "title": "Conclude",
          "body": "The remainder is 1, so the answer is B."
        }
      ],
      "animationFrames": [
        {
          "title": "Reduce 1999",
          "narration": "Replace 1999 with its remainder when divided by 5.",
          "visualHint": "1999 ≡ 4 ≡ −1 mod 5."
        },
        {
          "title": "Use exponent parity",
          "narration": "Show that an even number of negative signs multiply to positive 1.",
          "visualHint": "(-1)^2000 = 1."
        },
        {
          "title": "State the remainder",
          "narration": "The power leaves remainder 1 when divided by 5.",
          "visualHint": "Choice B is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "number theory",
        "modular arithmetic",
        "remainders",
        "exponents"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
    {
      "id": "amc8-1999-25",
      "title": "1999 AMC 8 Problem 25: Shaded Midpoint Triangles",
      "sourceType": "AMC",
      "contest": "AMC 8",
      "year": 1999,
      "problemNumber": 25,
      "category": "Geometry",
      "subcategory": "Area and geometric series",
      "difficulty": 5,
      "statement": "Points B, D, and J are midpoints of the sides of right triangle ACG. Then K, E, and I are midpoints of the sides of triangle JDG, and the dividing and shading process continues 100 times. If AC = CG = 6, then the total area of the shaded triangles is nearest to what value?",
      "choices": [
        {
          "label": "A",
          "text": "6"
        },
        {
          "label": "B",
          "text": "7"
        },
        {
          "label": "C",
          "text": "8"
        },
        {
          "label": "D",
          "text": "9"
        },
        {
          "label": "E",
          "text": "10"
        }
      ],
      "answer": "A",
      "shortAnswer": "6",
      "solutionSteps": [
        {
          "title": "Find the first shaded area",
          "body": "The large right triangle has legs AC = 6 and CG = 6. The first shaded triangle has legs half as long, 3 and 3, so its area is 4.5.",
          "equation": "(1/2)(3)(3) = 4.5"
        },
        {
          "title": "Notice the scale factor",
          "body": "Each new triangle is formed from midpoints of the previous triangle, so its side lengths are half as large. Areas therefore shrink by a factor of 1/4 each time.",
          "equation": "area scale = (1/2)^2 = 1/4"
        },
        {
          "title": "Add the geometric series",
          "body": "The shaded areas are 4.5 + 4.5/4 + 4.5/16 + ... for 100 terms. This is very close to the infinite sum.",
          "equation": "4.5/(1 − 1/4) = 6"
        },
        {
          "title": "Conclude",
          "body": "After 100 steps, the total is essentially 6, so the nearest answer is A."
        }
      ],
      "animationFrames": [
        {
          "title": "Show the first triangle",
          "narration": "Draw the right triangle with legs 6 and 6, then connect midpoints.",
          "visualHint": "The first shaded triangle has legs 3 and 3."
        },
        {
          "title": "Shrink repeatedly",
          "narration": "Zoom into the next triangle and repeat the midpoint process.",
          "visualHint": "Each shaded area is one-fourth of the previous shaded area."
        },
        {
          "title": "Sum the areas",
          "narration": "Display the geometric series and its limiting sum.",
          "visualHint": "4.5 + 1.125 + 0.28125 + ... approaches 6, then choice A is circled."
        }
      ],
      "tags": [
        "AMC 8",
        "1999",
        "geometry",
        "area",
        "midpoints",
        "geometric series",
        "similarity"
      ],
      "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 1999 AMC 8 PDF",
      "license": "See attribution page"
    },
{
    "id": "amc8-2000-01",
    "title": "2000 AMC 8 Problem 1: Aunt Anna's Age",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Age word problems",
    "difficulty": 1,
    "statement": "Aunt Anna is 42 years old. Caitlin is 5 years younger than Brianna, and Brianna is half as old as Aunt Anna. How old is Caitlin?",
    "choices": [
      {
        "label": "A",
        "text": "15"
      },
      {
        "label": "B",
        "text": "16"
      },
      {
        "label": "C",
        "text": "17"
      },
      {
        "label": "D",
        "text": "21"
      },
      {
        "label": "E",
        "text": "37"
      }
    ],
    "answer": "B",
    "shortAnswer": "16",
    "solutionSteps": [
      {
        "title": "Find Brianna's age",
        "body": "Brianna is half as old as Aunt Anna, so she is half of 42.",
        "equation": "42 ÷ 2 = 21"
      },
      {
        "title": "Find Caitlin's age",
        "body": "Caitlin is 5 years younger than Brianna.",
        "equation": "21 − 5 = 16"
      },
      {
        "title": "Conclude",
        "body": "Caitlin is 16 years old, so the answer is B."
      }
    ],
    "animationFrames": [
      {
        "title": "Start with Aunt Anna",
        "narration": "Show Aunt Anna's age as 42.",
        "visualHint": "A large 42 appears next to Aunt Anna."
      },
      {
        "title": "Halve the age",
        "narration": "Brianna is half of 42.",
        "visualHint": "42 splits into two equal parts of 21."
      },
      {
        "title": "Subtract five",
        "narration": "Caitlin is 5 years younger than Brianna.",
        "visualHint": "21 − 5 = 16, then choice B is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "age",
      "word problem"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-02",
    "title": "2000 AMC 8 Problem 2: Less Than Its Reciprocal",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 2,
    "category": "Number Theory",
    "subcategory": "Reciprocals and inequalities",
    "difficulty": 2,
    "statement": "Which of these numbers is less than its reciprocal?",
    "choices": [
      {
        "label": "A",
        "text": "−2"
      },
      {
        "label": "B",
        "text": "−1"
      },
      {
        "label": "C",
        "text": "0"
      },
      {
        "label": "D",
        "text": "1"
      },
      {
        "label": "E",
        "text": "2"
      }
    ],
    "answer": "A",
    "shortAnswer": "−2",
    "solutionSteps": [
      {
        "title": "Check the negative choices",
        "body": "The reciprocal of −2 is −1/2, and −2 is less than −1/2.",
        "equation": "−2 < −1/2"
      },
      {
        "title": "Eliminate the others",
        "body": "−1 equals its reciprocal, 0 has no reciprocal, 1 equals its reciprocal, and 2 is greater than 1/2."
      },
      {
        "title": "Conclude",
        "body": "Only −2 is less than its reciprocal, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Show each number",
        "narration": "List the five choices with a blank for each reciprocal.",
        "visualHint": "−2, −1, 0, 1, 2 appear in a column."
      },
      {
        "title": "Compare −2",
        "narration": "The reciprocal of −2 is −1/2, which lies to the right of −2 on the number line.",
        "visualHint": "A number line shows −2 < −1/2."
      },
      {
        "title": "Circle the answer",
        "narration": "The only choice that works is −2.",
        "visualHint": "Choice A is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "number theory",
      "reciprocal",
      "inequality"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-03",
    "title": "2000 AMC 8 Problem 3: Whole Numbers in an Interval",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 3,
    "category": "Number Theory",
    "subcategory": "Intervals",
    "difficulty": 1,
    "statement": "How many whole numbers lie in the interval between 5/3 and 2π?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "3"
      },
      {
        "label": "C",
        "text": "4"
      },
      {
        "label": "D",
        "text": "5"
      },
      {
        "label": "E",
        "text": "infinitely many"
      }
    ],
    "answer": "D",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Estimate the endpoints",
        "body": "The left endpoint is about 1.67 and the right endpoint is about 6.28.",
        "equation": "5/3 ≈ 1.67, 2π ≈ 6.28"
      },
      {
        "title": "List the whole numbers",
        "body": "The whole numbers strictly between these values are 2, 3, 4, 5, and 6."
      },
      {
        "title": "Count them",
        "body": "There are 5 whole numbers, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Draw the interval",
        "narration": "Mark 5/3 and 2π on a number line.",
        "visualHint": "The interval runs from just after 1 to just after 6."
      },
      {
        "title": "Drop in whole numbers",
        "narration": "Place 2, 3, 4, 5, and 6 inside the interval.",
        "visualHint": "Five highlighted dots appear."
      },
      {
        "title": "Count",
        "narration": "There are five whole numbers in the interval.",
        "visualHint": "The five dots are counted and choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "number theory",
      "whole numbers",
      "intervals"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-04",
    "title": "2000 AMC 8 Problem 4: At-Home Work Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Graph interpretation",
    "difficulty": 2,
    "statement": "In 1960 only 5% of the working adults in Carlin City worked at home. By 1970 the at-home work force increased to 8%. In 1980 there were approximately 15% working at home, and in 1990 there were 30%. The graph that best illustrates this is",
    "choices": [
      {
        "label": "A",
        "text": "Graph A"
      },
      {
        "label": "B",
        "text": "Graph B"
      },
      {
        "label": "C",
        "text": "Graph C"
      },
      {
        "label": "D",
        "text": "Graph D"
      },
      {
        "label": "E",
        "text": "Graph E"
      }
    ],
    "answer": "E",
    "shortAnswer": "Graph E",
    "solutionSteps": [
      {
        "title": "Identify the data points",
        "body": "The graph should be near 5 in 1960, 8 in 1970, 15 in 1980, and 30 in 1990."
      },
      {
        "title": "Look for increasing growth",
        "body": "The increases are about 3, then 7, then 15, so the graph should rise faster over time."
      },
      {
        "title": "Conclude",
        "body": "Graph E best matches the four data points and the accelerating increase."
      }
    ],
    "animationFrames": [
      {
        "title": "Plot the points",
        "narration": "Place the four percent values at 1960, 1970, 1980, and 1990.",
        "visualHint": "Dots appear around 5, 8, 15, and 30 percent."
      },
      {
        "title": "Compare shapes",
        "narration": "The line should curve upward because the increases get larger.",
        "visualHint": "Graphs that are flat or linear fade out."
      },
      {
        "title": "Select graph E",
        "narration": "Graph E follows the small-small-large growth pattern.",
        "visualHint": "Choice E is highlighted."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "graph",
      "data",
      "percent"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-05",
    "title": "2000 AMC 8 Problem 5: Maximum Number of Principals",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 5,
    "category": "Logic",
    "subcategory": "Intervals",
    "difficulty": 2,
    "statement": "Each principal of Lincoln High School serves exactly one 3-year term. What is the maximum number of principals this school could have during an 8-year period?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "3"
      },
      {
        "label": "C",
        "text": "4"
      },
      {
        "label": "D",
        "text": "5"
      },
      {
        "label": "E",
        "text": "8"
      }
    ],
    "answer": "C",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Think about overlapping an interval",
        "body": "An 8-year period can include parts of terms at the beginning and end, not only full terms."
      },
      {
        "title": "Build the maximum",
        "body": "For example, the 8-year period could include the end of one 3-year term, two complete 3-year terms, and the beginning of another term."
      },
      {
        "title": "Conclude",
        "body": "That makes a maximum of 4 principals, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Draw a timeline",
        "narration": "Show consecutive 3-year principal terms on a number line.",
        "visualHint": "Blocks of length 3 are placed end to end."
      },
      {
        "title": "Slide an 8-year window",
        "narration": "Move an 8-year window so it clips a term on each end and contains two full terms in the middle.",
        "visualHint": "Four different term blocks touch the window."
      },
      {
        "title": "Count the principals",
        "narration": "The window can include four principals at most.",
        "visualHint": "The four terms are numbered, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "logic",
      "intervals",
      "timeline"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-06",
    "title": "2000 AMC 8 Problem 6: Shaded L-Shaped Region",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "Figure ABCD is a square. Inside this square three smaller squares are drawn with the side lengths as labeled. What is the area of the shaded L-shaped region?",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "10"
      },
      {
        "label": "C",
        "text": "12.5"
      },
      {
        "label": "D",
        "text": "14"
      },
      {
        "label": "E",
        "text": "15"
      }
    ],
    "answer": "D",
    "shortAnswer": "14",
    "solutionSteps": [
      {
        "title": "Find the outer square side length",
        "body": "The side of the large square is made of lengths 1, 3, and 1.",
        "equation": "1 + 3 + 1 = 5"
      },
      {
        "title": "Subtract the unshaded squares",
        "body": "The unshaded squares have side lengths 1, 3, and 1, so their total area is 1 + 9 + 1 = 11.",
        "equation": "1² + 3² + 1² = 11"
      },
      {
        "title": "Compute the shaded area",
        "body": "The large square has area 25, so the shaded area is 25 − 11 = 14.",
        "equation": "5² − 11 = 14"
      }
    ],
    "animationFrames": [
      {
        "title": "Mark the side lengths",
        "narration": "Show that the big square has side length 5.",
        "visualHint": "The labels 1, 3, and 1 combine along a side."
      },
      {
        "title": "Shade by subtraction",
        "narration": "Treat the shaded region as the big square minus the three smaller squares.",
        "visualHint": "The three unshaded squares glow."
      },
      {
        "title": "Subtract areas",
        "narration": "Compute 25 minus 11.",
        "visualHint": "25 − (1 + 9 + 1) = 14, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "area",
      "square",
      "subtraction"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-07",
    "title": "2000 AMC 8 Problem 7: Minimum Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Integers",
    "difficulty": 2,
    "statement": "What is the minimum possible product of three different numbers of the set {−8, −6, −4, 0, 3, 5, 7}?",
    "choices": [
      {
        "label": "A",
        "text": "−336"
      },
      {
        "label": "B",
        "text": "−280"
      },
      {
        "label": "C",
        "text": "−210"
      },
      {
        "label": "D",
        "text": "−192"
      },
      {
        "label": "E",
        "text": "0"
      }
    ],
    "answer": "B",
    "shortAnswer": "−280",
    "solutionSteps": [
      {
        "title": "Need a negative product",
        "body": "The minimum product should be as negative as possible."
      },
      {
        "title": "Use one negative and two large positives",
        "body": "Choosing −8, 7, and 5 gives a large negative product.",
        "equation": "−8 × 7 × 5 = −280"
      },
      {
        "title": "Compare with three negatives",
        "body": "The product of −8, −6, and −4 is −192, which is not as small as −280. Therefore the answer is B."
      }
    ],
    "animationFrames": [
      {
        "title": "Sort the numbers",
        "narration": "Place the negative numbers on the left and positive numbers on the right.",
        "visualHint": "−8, −6, −4, 0, 3, 5, 7 appear on a number line."
      },
      {
        "title": "Try for most negative",
        "narration": "Pair the largest positive product with the most negative number.",
        "visualHint": "−8, 7, and 5 are selected."
      },
      {
        "title": "Multiply",
        "narration": "The product is −280, the smallest available value.",
        "visualHint": "−8 × 7 × 5 = −280, then choice B is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "integers",
      "product",
      "optimization"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-08",
    "title": "2000 AMC 8 Problem 8: Hidden Dice Dots",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Spatial reasoning",
    "difficulty": 3,
    "statement": "Three dice with faces numbered 1 through 6 are stacked as shown. Seven of the eighteen faces are visible, leaving eleven faces hidden. What is the total number of dots NOT visible in this view?",
    "choices": [
      {
        "label": "A",
        "text": "21"
      },
      {
        "label": "B",
        "text": "22"
      },
      {
        "label": "C",
        "text": "31"
      },
      {
        "label": "D",
        "text": "41"
      },
      {
        "label": "E",
        "text": "53"
      }
    ],
    "answer": "D",
    "shortAnswer": "41",
    "solutionSteps": [
      {
        "title": "Use the total dots",
        "body": "Each die has 1 + 2 + 3 + 4 + 5 + 6 = 21 dots, so three dice have 63 dots total.",
        "equation": "3 × 21 = 63"
      },
      {
        "title": "Add the visible dots",
        "body": "From the drawing, the visible faces show 1, 2, 3, 4, 6, 5, and 1 dots.",
        "equation": "1 + 2 + 3 + 4 + 6 + 5 + 1 = 22"
      },
      {
        "title": "Subtract visible from total",
        "body": "The hidden dots total 63 − 22 = 41, so the answer is D.",
        "equation": "63 − 22 = 41"
      }
    ],
    "animationFrames": [
      {
        "title": "Count total dots",
        "narration": "Show that each die has 21 total dots.",
        "visualHint": "1 + 2 + 3 + 4 + 5 + 6 = 21."
      },
      {
        "title": "Highlight visible faces",
        "narration": "Add the seven visible face values from the drawing.",
        "visualHint": "The visible values sum to 22."
      },
      {
        "title": "Find hidden dots",
        "narration": "Subtract the visible dots from all dots on the three dice.",
        "visualHint": "63 − 22 = 41, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "spatial reasoning",
      "dice",
      "subtraction"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-09",
    "title": "2000 AMC 8 Problem 9: Cross-Number Powers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 9,
    "category": "Number Theory",
    "subcategory": "Powers and digits",
    "difficulty": 3,
    "statement": "Three-digit powers of 2 and 5 are used in a cross-number puzzle. Across 2 is 2^m and Down 1 is 5^n. What is the only possible digit for the outlined square?",
    "choices": [
      {
        "label": "A",
        "text": "0"
      },
      {
        "label": "B",
        "text": "2"
      },
      {
        "label": "C",
        "text": "4"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "8"
      }
    ],
    "answer": "D",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "List three-digit powers of 5",
        "body": "The three-digit powers of 5 are 125 and 625. In either case, the middle digit is 2."
      },
      {
        "title": "Use the crossing digit",
        "body": "That crossing digit is the first digit of the across entry, so the three-digit power of 2 must start with 2."
      },
      {
        "title": "Find the matching power of 2",
        "body": "The three-digit power of 2 that starts with 2 is 256, so the outlined last digit is 6."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the cross-number grid",
        "narration": "Mark the crossing square where the down number and across number meet.",
        "visualHint": "The down entry and across entry are highlighted."
      },
      {
        "title": "Try powers of 5",
        "narration": "Both 125 and 625 put a 2 in the crossing square.",
        "visualHint": "The crossing digit becomes 2."
      },
      {
        "title": "Complete the across power",
        "narration": "The only three-digit power of 2 beginning with 2 is 256.",
        "visualHint": "The outlined square fills with 6, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "number theory",
      "powers",
      "digits",
      "logic"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-10",
    "title": "2000 AMC 8 Problem 10: Ara and Shea Heights",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Percent change",
    "difficulty": 2,
    "statement": "Ara and Shea were once the same height. Since then Shea has grown 20% while Ara has grown half as many inches as Shea. Shea is now 60 inches tall. How tall, in inches, is Ara now?",
    "choices": [
      {
        "label": "A",
        "text": "48"
      },
      {
        "label": "B",
        "text": "51"
      },
      {
        "label": "C",
        "text": "52"
      },
      {
        "label": "D",
        "text": "54"
      },
      {
        "label": "E",
        "text": "55"
      }
    ],
    "answer": "E",
    "shortAnswer": "55",
    "solutionSteps": [
      {
        "title": "Find their original height",
        "body": "Shea is now 60 after growing 20%, so 60 is 120% of the original height.",
        "equation": "60 ÷ 1.2 = 50"
      },
      {
        "title": "Find Shea's growth",
        "body": "Shea grew from 50 to 60, so she grew 10 inches.",
        "equation": "60 − 50 = 10"
      },
      {
        "title": "Find Ara's height",
        "body": "Ara grew half as many inches, so Ara grew 5 inches and is now 55 inches tall.",
        "equation": "50 + 5 = 55"
      }
    ],
    "animationFrames": [
      {
        "title": "Represent the original height",
        "narration": "Show both Ara and Shea starting at the same height.",
        "visualHint": "Both height bars begin at 50 inches."
      },
      {
        "title": "Show Shea's growth",
        "narration": "Shea grows 20%, reaching 60 inches.",
        "visualHint": "A 10-inch increase appears."
      },
      {
        "title": "Give Ara half the growth",
        "narration": "Ara grows half of 10 inches, which is 5 inches.",
        "visualHint": "Ara's bar ends at 55, then choice E is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "percent",
      "height",
      "word problem"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-11",
    "title": "2000 AMC 8 Problem 11: Divisible by the Units Digit",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 11,
    "category": "Number Theory",
    "subcategory": "Divisibility",
    "difficulty": 3,
    "statement": "The number 64 has the property that it is divisible by its units digit. How many whole numbers between 10 and 50 have this property?",
    "choices": [
      {
        "label": "A",
        "text": "15"
      },
      {
        "label": "B",
        "text": "16"
      },
      {
        "label": "C",
        "text": "17"
      },
      {
        "label": "D",
        "text": "18"
      },
      {
        "label": "E",
        "text": "20"
      }
    ],
    "answer": "C",
    "shortAnswer": "17",
    "solutionSteps": [
      {
        "title": "Check each possible units digit",
        "body": "Ignore numbers ending in 0. For each number from 10 to 50, test divisibility by its units digit."
      },
      {
        "title": "List the working numbers",
        "body": "The numbers are 11, 12, 15, 21, 22, 24, 25, 31, 32, 33, 35, 36, 41, 42, 44, 45, and 48."
      },
      {
        "title": "Count them",
        "body": "There are 17 such numbers, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Create a table",
        "narration": "Make rows for the tens digits 1, 2, 3, and 4.",
        "visualHint": "A 10-to-50 table appears."
      },
      {
        "title": "Test units digits",
        "narration": "Keep only numbers divisible by their last digit.",
        "visualHint": "Working entries light up."
      },
      {
        "title": "Count highlighted numbers",
        "narration": "There are 17 highlighted numbers.",
        "visualHint": "The count reaches 17 and choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "number theory",
      "divisibility",
      "digits"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-12",
    "title": "2000 AMC 8 Problem 12: Smallest Number of Blocks",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 12,
    "category": "Logic",
    "subcategory": "Optimization",
    "difficulty": 4,
    "statement": "A block wall 100 feet long and 7 feet high will be constructed using blocks that are 1 foot high and either 2 feet long or 1 foot long. The vertical joins in the blocks must be staggered as shown, and the wall must be even on the ends. What is the smallest number of blocks needed to build this wall?",
    "choices": [
      {
        "label": "A",
        "text": "344"
      },
      {
        "label": "B",
        "text": "347"
      },
      {
        "label": "C",
        "text": "350"
      },
      {
        "label": "D",
        "text": "353"
      },
      {
        "label": "E",
        "text": "356"
      }
    ],
    "answer": "D",
    "shortAnswer": "353",
    "solutionSteps": [
      {
        "title": "Minimize blocks per row",
        "body": "A 100-foot row can use fifty 2-foot blocks, which is the fewest possible for one row.",
        "equation": "100 ÷ 2 = 50"
      },
      {
        "title": "Stagger adjacent rows",
        "body": "Two adjacent rows cannot both have joins every 2 feet in the same places. Alternating rows can use a 1-foot block at each end and forty-nine 2-foot blocks, for 51 blocks."
      },
      {
        "title": "Use seven rows",
        "body": "Use four 50-block rows and three 51-block rows.",
        "equation": "4 × 50 + 3 × 51 = 353"
      }
    ],
    "animationFrames": [
      {
        "title": "Build one row",
        "narration": "Show a row made of fifty 2-foot blocks.",
        "visualHint": "The row has 50 blocks."
      },
      {
        "title": "Create a staggered row",
        "narration": "Shift the joins by using 1-foot end blocks and 2-foot middle blocks.",
        "visualHint": "The staggered row has 51 blocks."
      },
      {
        "title": "Stack seven rows",
        "narration": "Alternate the two row types to minimize the total.",
        "visualHint": "4 rows of 50 and 3 rows of 51 sum to 353, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "logic",
      "optimization",
      "blocks",
      "patterns"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-13",
    "title": "2000 AMC 8 Problem 13: Angle Bisector in an Isosceles Triangle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 13,
    "category": "Geometry",
    "subcategory": "Angles",
    "difficulty": 3,
    "statement": "In triangle CAT, we have ∠ACT = ∠ATC and ∠CAT = 36°. If TR bisects ∠ATC, then ∠CRT = ?",
    "choices": [
      {
        "label": "A",
        "text": "36°"
      },
      {
        "label": "B",
        "text": "54°"
      },
      {
        "label": "C",
        "text": "72°"
      },
      {
        "label": "D",
        "text": "90°"
      },
      {
        "label": "E",
        "text": "108°"
      }
    ],
    "answer": "C",
    "shortAnswer": "72°",
    "solutionSteps": [
      {
        "title": "Find the base angles",
        "body": "Since ∠ACT and ∠ATC are equal, each is half of 180° − 36°.",
        "equation": "(180° − 36°) ÷ 2 = 72°"
      },
      {
        "title": "Bisect angle T",
        "body": "TR bisects ∠ATC, so ∠CTR is 36°.",
        "equation": "72° ÷ 2 = 36°"
      },
      {
        "title": "Use triangle CRT",
        "body": "In triangle CRT, angle C is 72° and angle T is 36°, so angle R is 72°.",
        "equation": "180° − 72° − 36° = 72°"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the isosceles triangle",
        "narration": "Highlight the equal base angles at C and T.",
        "visualHint": "Angles C and T are both labeled 72°."
      },
      {
        "title": "Draw the bisector",
        "narration": "Split angle T into two 36° angles.",
        "visualHint": "TR divides the 72° angle."
      },
      {
        "title": "Finish triangle CRT",
        "narration": "Use the triangle angle sum to find angle R.",
        "visualHint": "180 − 72 − 36 = 72, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "angles",
      "isosceles triangle",
      "angle bisector"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-14",
    "title": "2000 AMC 8 Problem 14: Units Digit of Powers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 14,
    "category": "Number Theory",
    "subcategory": "Units digit cycles",
    "difficulty": 2,
    "statement": "What is the units digit of 19^19 + 99^99?",
    "choices": [
      {
        "label": "A",
        "text": "0"
      },
      {
        "label": "B",
        "text": "1"
      },
      {
        "label": "C",
        "text": "2"
      },
      {
        "label": "D",
        "text": "8"
      },
      {
        "label": "E",
        "text": "9"
      }
    ],
    "answer": "D",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Use only units digits",
        "body": "Both 19 and 99 have units digit 9, so only powers of 9 matter for the units digit."
      },
      {
        "title": "Use the 9-cycle",
        "body": "Odd powers of 9 end in 9, while even powers end in 1. Both exponents are odd."
      },
      {
        "title": "Add the units digits",
        "body": "The units digit is the units digit of 9 + 9 = 18, which is 8."
      }
    ],
    "animationFrames": [
      {
        "title": "Ignore all but units digits",
        "narration": "Turn 19 and 99 into their units digit, 9.",
        "visualHint": "19 → 9 and 99 → 9."
      },
      {
        "title": "Apply the cycle",
        "narration": "Odd powers of 9 end in 9.",
        "visualHint": "9¹, 9³, 9⁵ all show units digit 9."
      },
      {
        "title": "Add units digits",
        "narration": "9 plus 9 has units digit 8.",
        "visualHint": "9 + 9 = 18, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "number theory",
      "units digit",
      "powers",
      "cycles"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-15",
    "title": "2000 AMC 8 Problem 15: Nested Equilateral Triangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 15,
    "category": "Geometry",
    "subcategory": "Perimeter",
    "difficulty": 3,
    "statement": "Triangles ABC, ADE, and EFG are all equilateral. Points D and G are midpoints of AC and AE, respectively. If AB = 4, what is the perimeter of figure ABCDEFG?",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "13"
      },
      {
        "label": "C",
        "text": "15"
      },
      {
        "label": "D",
        "text": "18"
      },
      {
        "label": "E",
        "text": "21"
      }
    ],
    "answer": "C",
    "shortAnswer": "15",
    "solutionSteps": [
      {
        "title": "Use the largest equilateral triangle",
        "body": "Since ABC is equilateral and AB = 4, we have AC = BC = 4."
      },
      {
        "title": "Use the midpoints",
        "body": "D is the midpoint of AC, so AD = DC = 2. Triangle ADE is equilateral, so DE = AE = 2. G is the midpoint of AE, so AG = GE = 1. Triangle EFG is equilateral, so EF = FG = 1."
      },
      {
        "title": "Add the outer sides",
        "body": "The perimeter of ABCDEFG is AB + BC + CD + DE + EF + FG + GA.",
        "equation": "4 + 4 + 2 + 2 + 1 + 1 + 1 = 15"
      }
    ],
    "animationFrames": [
      {
        "title": "Label the big triangle",
        "narration": "Put length 4 on each side of triangle ABC.",
        "visualHint": "AB, BC, and AC are all 4."
      },
      {
        "title": "Halve the sides",
        "narration": "Use the midpoints to get lengths 2 and then 1.",
        "visualHint": "AC splits into 2 and 2; AE splits into 1 and 1."
      },
      {
        "title": "Trace the perimeter",
        "narration": "Walk around ABCDEFG and add the side lengths.",
        "visualHint": "4 + 4 + 2 + 2 + 1 + 1 + 1 = 15, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "perimeter",
      "equilateral triangle",
      "midpoints"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-16",
    "title": "2000 AMC 8 Problem 16: Backyard Length and Perimeter",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 16,
    "category": "Algebra",
    "subcategory": "Rectangles",
    "difficulty": 2,
    "statement": "In order for Mateen to walk a kilometer (1000 m) in his rectangular backyard, he must walk the length 25 times or walk its perimeter 10 times. What is the area of Mateen's backyard in square meters?",
    "choices": [
      {
        "label": "A",
        "text": "40"
      },
      {
        "label": "B",
        "text": "200"
      },
      {
        "label": "C",
        "text": "400"
      },
      {
        "label": "D",
        "text": "500"
      },
      {
        "label": "E",
        "text": "1000"
      }
    ],
    "answer": "C",
    "shortAnswer": "400",
    "solutionSteps": [
      {
        "title": "Find the length",
        "body": "Walking the length 25 times gives 1000 meters, so the length is 40 meters.",
        "equation": "1000 ÷ 25 = 40"
      },
      {
        "title": "Find the perimeter",
        "body": "Walking the perimeter 10 times gives 1000 meters, so the perimeter is 100 meters.",
        "equation": "1000 ÷ 10 = 100"
      },
      {
        "title": "Find the width and area",
        "body": "For a rectangle, 2(L + W) = 100, so L + W = 50. With L = 40, W = 10, and the area is 400.",
        "equation": "40 × 10 = 400"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the rectangle",
        "narration": "Label the length and width of the backyard.",
        "visualHint": "A rectangle appears with length unknown."
      },
      {
        "title": "Use the length walk",
        "narration": "Divide 1000 by 25 to get the length.",
        "visualHint": "Length = 40."
      },
      {
        "title": "Use the perimeter walk",
        "narration": "Divide 1000 by 10 to get perimeter 100, then find the width and area.",
        "visualHint": "Area = 40 × 10 = 400, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "geometry",
      "rectangle",
      "area",
      "perimeter"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-17",
    "title": "2000 AMC 8 Problem 17: Custom Operation",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Operations",
    "difficulty": 3,
    "statement": "The operation ⊗ is defined for all nonzero numbers by a ⊗ b = a²/b. Determine [(1 ⊗ 2) ⊗ 3] − [1 ⊗ (2 ⊗ 3)].",
    "choices": [
      {
        "label": "A",
        "text": "−2/3"
      },
      {
        "label": "B",
        "text": "−1/4"
      },
      {
        "label": "C",
        "text": "0"
      },
      {
        "label": "D",
        "text": "1/4"
      },
      {
        "label": "E",
        "text": "2/3"
      }
    ],
    "answer": "A",
    "shortAnswer": "−2/3",
    "solutionSteps": [
      {
        "title": "Evaluate the left bracket",
        "body": "First 1 ⊗ 2 = 1/2. Then (1/2) ⊗ 3 = (1/2)²/3 = 1/12.",
        "equation": "(1/2)² ÷ 3 = 1/12"
      },
      {
        "title": "Evaluate the right bracket",
        "body": "First 2 ⊗ 3 = 4/3. Then 1 ⊗ (4/3) = 1 ÷ (4/3) = 3/4.",
        "equation": "1 ⊗ (4/3) = 3/4"
      },
      {
        "title": "Subtract",
        "body": "The expression is 1/12 − 3/4 = 1/12 − 9/12 = −8/12 = −2/3.",
        "equation": "1/12 − 3/4 = −2/3"
      }
    ],
    "animationFrames": [
      {
        "title": "Define the operation",
        "narration": "Show that a ⊗ b means square the first number and divide by the second.",
        "visualHint": "a ⊗ b = a²/b."
      },
      {
        "title": "Compute both brackets",
        "narration": "Evaluate the left bracket and the right bracket separately.",
        "visualHint": "Left = 1/12 and right = 3/4."
      },
      {
        "title": "Subtract results",
        "narration": "Subtract 3/4 from 1/12.",
        "visualHint": "1/12 − 9/12 = −8/12 = −2/3, then choice A is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "operation",
      "fractions"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-18",
    "title": "2000 AMC 8 Problem 18: Two Geoboard Quadrilaterals",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 18,
    "category": "Geometry",
    "subcategory": "Area and perimeter",
    "difficulty": 4,
    "statement": "Consider the two geoboard quadrilaterals. Which of the following statements is true?",
    "choices": [
      {
        "label": "A",
        "text": "The area of quadrilateral I is more than the area of quadrilateral II."
      },
      {
        "label": "B",
        "text": "The area of quadrilateral I is less than the area of quadrilateral II."
      },
      {
        "label": "C",
        "text": "The quadrilaterals have the same area and the same perimeter."
      },
      {
        "label": "D",
        "text": "The quadrilaterals have the same area, but the perimeter of I is more than the perimeter of II."
      },
      {
        "label": "E",
        "text": "The quadrilaterals have the same area, but the perimeter of I is less than the perimeter of II."
      }
    ],
    "answer": "E",
    "shortAnswer": "Same area, but perimeter of I is less than perimeter of II",
    "solutionSteps": [
      {
        "title": "Compare areas",
        "body": "Using the grid, both quadrilaterals occupy the same base-height area. Each has area 1 square unit."
      },
      {
        "title": "Compare side lengths",
        "body": "Quadrilateral I has shorter slanted sides than quadrilateral II. Quadrilateral II has a longer slanted side across a 2-by-1 step."
      },
      {
        "title": "Conclude",
        "body": "They have the same area, but the perimeter of I is less than the perimeter of II, so the answer is E."
      }
    ],
    "animationFrames": [
      {
        "title": "Place both shapes on grid coordinates",
        "narration": "Show each quadrilateral on the same geoboard spacing.",
        "visualHint": "Both shapes are outlined on grid dots."
      },
      {
        "title": "Compare area boxes",
        "narration": "Use the grid to show each shape has equal area.",
        "visualHint": "Matching shaded area units appear."
      },
      {
        "title": "Compare perimeters",
        "narration": "Highlight the longer diagonal side in quadrilateral II.",
        "visualHint": "Perimeter II is longer, then choice E is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "geoboard",
      "area",
      "perimeter",
      "spatial reasoning"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-19",
    "title": "2000 AMC 8 Problem 19: Three Circular Arcs",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Circle area",
    "difficulty": 3,
    "statement": "Three circular arcs of radius 5 units bound the region shown. Arcs AB and AD are quarter-circles, and arc BCD is a semicircle. What is the area, in square units, of the region?",
    "choices": [
      {
        "label": "A",
        "text": "25"
      },
      {
        "label": "B",
        "text": "10 + 5π"
      },
      {
        "label": "C",
        "text": "50"
      },
      {
        "label": "D",
        "text": "50 + 5π"
      },
      {
        "label": "E",
        "text": "25π"
      }
    ],
    "answer": "E",
    "shortAnswer": "25π",
    "solutionSteps": [
      {
        "title": "Recognize the circle pieces",
        "body": "The top boundary is a semicircle of radius 5. The two lower boundaries are quarter-circles of the same radius."
      },
      {
        "title": "Add the arc portions",
        "body": "A semicircle plus two quarter-circles makes one full circle."
      },
      {
        "title": "Find the area",
        "body": "The area is the area of a circle of radius 5.",
        "equation": "π × 5² = 25π"
      }
    ],
    "animationFrames": [
      {
        "title": "Color the arcs",
        "narration": "Color the top semicircle and the two lower quarter-circles.",
        "visualHint": "The arcs are labeled 1/2, 1/4, and 1/4 of a circle."
      },
      {
        "title": "Combine the fractions",
        "narration": "Add the arc fractions to make one full circle.",
        "visualHint": "1/2 + 1/4 + 1/4 = 1."
      },
      {
        "title": "Compute circle area",
        "narration": "Use radius 5 to get the area.",
        "visualHint": "πr² = 25π, then choice E is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "circle",
      "area",
      "arcs"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-20",
    "title": "2000 AMC 8 Problem 20: Nine Coins Totaling $1.02",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 20,
    "category": "Algebra",
    "subcategory": "Coin systems",
    "difficulty": 3,
    "statement": "You have nine coins: a collection of pennies, nickels, dimes, and quarters having a total value of $1.02, with at least one coin of each type. How many dimes must you have?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "2"
      },
      {
        "label": "C",
        "text": "3"
      },
      {
        "label": "D",
        "text": "4"
      },
      {
        "label": "E",
        "text": "5"
      }
    ],
    "answer": "A",
    "shortAnswer": "1",
    "solutionSteps": [
      {
        "title": "Set up equations",
        "body": "Let p, n, d, and q be the numbers of pennies, nickels, dimes, and quarters. Then p + n + d + q = 9 and p + 5n + 10d + 25q = 102."
      },
      {
        "title": "Eliminate pennies",
        "body": "Subtract the coin-count equation from the value equation.",
        "equation": "4n + 9d + 24q = 93"
      },
      {
        "title": "Use at least one of each",
        "body": "Testing possible positive values gives q = 3, n = 3, d = 1, and p = 2. Therefore there must be 1 dime."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the four coin types",
        "narration": "Represent pennies, nickels, dimes, and quarters with variables.",
        "visualHint": "p, n, d, q appear under coin icons."
      },
      {
        "title": "Use count and value",
        "narration": "Write one equation for the number of coins and one for total cents.",
        "visualHint": "p+n+d+q=9 and p+5n+10d+25q=102."
      },
      {
        "title": "Find the only combination",
        "narration": "The only valid combination has one dime.",
        "visualHint": "2 pennies, 3 nickels, 1 dime, 3 quarters total 102 cents, then choice A is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "coins",
      "systems",
      "logic"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-21",
    "title": "2000 AMC 8 Problem 21: Penny Toss Probability",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 21,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "Keiko tosses one penny and Ephraim tosses two pennies. The probability that Ephraim gets the same number of heads that Keiko gets is",
    "choices": [
      {
        "label": "A",
        "text": "1/4"
      },
      {
        "label": "B",
        "text": "3/8"
      },
      {
        "label": "C",
        "text": "1/2"
      },
      {
        "label": "D",
        "text": "2/3"
      },
      {
        "label": "E",
        "text": "3/4"
      }
    ],
    "answer": "B",
    "shortAnswer": "3/8",
    "solutionSteps": [
      {
        "title": "Case 1: Keiko gets 0 heads",
        "body": "This has probability 1/2. Ephraim gets 0 heads with probability 1/4.",
        "equation": "(1/2)(1/4) = 1/8"
      },
      {
        "title": "Case 2: Keiko gets 1 head",
        "body": "This has probability 1/2. Ephraim gets exactly 1 head with probability 1/2.",
        "equation": "(1/2)(1/2) = 1/4"
      },
      {
        "title": "Add the cases",
        "body": "The total probability is 1/8 + 1/4 = 3/8.",
        "equation": "1/8 + 2/8 = 3/8"
      }
    ],
    "animationFrames": [
      {
        "title": "Draw outcome branches",
        "narration": "Branch Keiko's toss into 0 heads or 1 head.",
        "visualHint": "Two branches labeled T and H."
      },
      {
        "title": "Match Ephraim's heads",
        "narration": "For each branch, show Ephraim's matching outcomes.",
        "visualHint": "TT matches 0; HT and TH match 1."
      },
      {
        "title": "Add probabilities",
        "narration": "Add 1/8 and 1/4.",
        "visualHint": "3/8 appears and choice B is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "counting",
      "probability",
      "coins"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-22",
    "title": "2000 AMC 8 Problem 22: Cube Surface Area Increase",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 22,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 3,
    "statement": "A cube has edge length 2. Suppose that we glue a cube of edge length 1 on top of the big cube so that one of its faces rests entirely on the top face of the larger cube. The percent increase in the surface area from the original cube to the new solid formed is closest to",
    "choices": [
      {
        "label": "A",
        "text": "10"
      },
      {
        "label": "B",
        "text": "15"
      },
      {
        "label": "C",
        "text": "17"
      },
      {
        "label": "D",
        "text": "21"
      },
      {
        "label": "E",
        "text": "25"
      }
    ],
    "answer": "C",
    "shortAnswer": "17",
    "solutionSteps": [
      {
        "title": "Original surface area",
        "body": "The large cube has edge length 2, so its surface area is 6 times 2 squared.",
        "equation": "6 × 2² = 24"
      },
      {
        "title": "Net added area",
        "body": "The small cube contributes 6 square units, but its bottom face and the covered part of the large cube are not exposed. That removes 2 square units, so the net increase is 4.",
        "equation": "6 − 2 = 4"
      },
      {
        "title": "Find percent increase",
        "body": "The percent increase is 4/24 = 1/6, or about 16.7%, closest to 17.",
        "equation": "4/24 ≈ 16.7%"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the big cube",
        "narration": "Compute the original surface area of the 2-by-2-by-2 cube.",
        "visualHint": "Surface area 24 is displayed."
      },
      {
        "title": "Attach the small cube",
        "narration": "Add the small cube and hide the two faces that touch.",
        "visualHint": "Six new faces appear, but two covered faces fade."
      },
      {
        "title": "Compute percent increase",
        "narration": "The net increase is 4 out of 24.",
        "visualHint": "4/24 ≈ 17%, then choice C is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "surface area",
      "cube",
      "percent"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-23",
    "title": "2000 AMC 8 Problem 23: Overlapping Averages",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 23,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 3,
    "statement": "There is a list of seven numbers. The average of the first four numbers is 5, and the average of the last four numbers is 8. If the average of all seven numbers is 6 4/7, then the number common to both sets of four numbers is",
    "choices": [
      {
        "label": "A",
        "text": "5 3/7"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "6 4/7"
      },
      {
        "label": "D",
        "text": "7"
      },
      {
        "label": "E",
        "text": "7 3/7"
      }
    ],
    "answer": "B",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Find the two four-number sums",
        "body": "The first four numbers sum to 20, and the last four numbers sum to 32.",
        "equation": "4 × 5 = 20, 4 × 8 = 32"
      },
      {
        "title": "Find the total sum",
        "body": "The average of all seven numbers is 6 4/7, so the total sum is 46.",
        "equation": "7 × 6 4/7 = 46"
      },
      {
        "title": "Subtract the overlap",
        "body": "Adding the two four-number sums counts the shared middle number twice. Therefore the shared number is 20 + 32 − 46 = 6.",
        "equation": "52 − 46 = 6"
      }
    ],
    "animationFrames": [
      {
        "title": "Show seven slots",
        "narration": "Highlight the first four numbers and the last four numbers.",
        "visualHint": "The fourth number belongs to both groups."
      },
      {
        "title": "Compute group sums",
        "narration": "The first group sums to 20 and the second to 32.",
        "visualHint": "20 and 32 appear above the groups."
      },
      {
        "title": "Remove double-counting",
        "narration": "Subtract the total sum from the two group sums to isolate the common number.",
        "visualHint": "20 + 32 − 46 = 6, then choice B is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "algebra",
      "averages",
      "overlap"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-24",
    "title": "2000 AMC 8 Problem 24: Angles in a Star Figure",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 24,
    "category": "Geometry",
    "subcategory": "Angles",
    "difficulty": 4,
    "statement": "If ∠A = 20° and ∠AFG = ∠AGF, then ∠B + ∠D =",
    "choices": [
      {
        "label": "A",
        "text": "48°"
      },
      {
        "label": "B",
        "text": "60°"
      },
      {
        "label": "C",
        "text": "72°"
      },
      {
        "label": "D",
        "text": "80°"
      },
      {
        "label": "E",
        "text": "90°"
      }
    ],
    "answer": "D",
    "shortAnswer": "80°",
    "solutionSteps": [
      {
        "title": "Use triangle AFG",
        "body": "In triangle AFG, angle A is 20° and angles AFG and AGF are equal."
      },
      {
        "title": "Find the equal angles",
        "body": "The remaining 160° is split equally, so each of those angles is 80°.",
        "equation": "(180° − 20°) ÷ 2 = 80°"
      },
      {
        "title": "Use triangle BFD",
        "body": "At F, the angle inside triangle BFD is supplementary to 80°, so it is 100°. Thus ∠B + ∠D = 180° − 100° = 80°.",
        "equation": "180° − 100° = 80°"
      }
    ],
    "animationFrames": [
      {
        "title": "Focus on triangle AFG",
        "narration": "Show that A is 20 degrees and the other two angles are equal.",
        "visualHint": "Triangle AFG is highlighted."
      },
      {
        "title": "Find each base angle",
        "narration": "Split 160 degrees into two equal angles.",
        "visualHint": "Angles at F and G become 80 degrees."
      },
      {
        "title": "Move to triangle BFD",
        "narration": "Use the straight line at F to get 100 degrees, then find the sum of B and D.",
        "visualHint": "∠B + ∠D = 80°, then choice D is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "angles",
      "triangle",
      "star figure"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2000-25",
    "title": "2000 AMC 8 Problem 25: Triangle from Rectangle Midpoints",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2000,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "The area of rectangle ABCD is 72. If point A and the midpoints of BC and CD are joined to form a triangle, the area of that triangle is",
    "choices": [
      {
        "label": "A",
        "text": "21"
      },
      {
        "label": "B",
        "text": "27"
      },
      {
        "label": "C",
        "text": "30"
      },
      {
        "label": "D",
        "text": "36"
      },
      {
        "label": "E",
        "text": "40"
      }
    ],
    "answer": "B",
    "shortAnswer": "27",
    "solutionSteps": [
      {
        "title": "Use variables for the rectangle",
        "body": "Let the rectangle have width w and height h, so wh = 72."
      },
      {
        "title": "Place the triangle vertices",
        "body": "The triangle uses A, the midpoint of BC, and the midpoint of CD. Relative to the rectangle, its area is 3/8 of the rectangle's area."
      },
      {
        "title": "Compute the area",
        "body": "The triangle area is 3/8 of 72.",
        "equation": "(3/8) × 72 = 27"
      }
    ],
    "animationFrames": [
      {
        "title": "Draw the rectangle",
        "narration": "Show rectangle ABCD and mark the midpoints of BC and CD.",
        "visualHint": "The two midpoints glow."
      },
      {
        "title": "Connect the triangle",
        "narration": "Draw segments from A to both midpoints and between the midpoints.",
        "visualHint": "The interior triangle is shaded."
      },
      {
        "title": "Use the area fraction",
        "narration": "The triangle takes 3/8 of the rectangle's area.",
        "visualHint": "3/8 × 72 = 27, then choice B is circled."
      }
    ],
    "tags": [
      "AMC 8",
      "2000",
      "geometry",
      "area",
      "rectangle",
      "midpoints"
    ],
    "sourceName": "Mathematical Association of America, American Mathematics Competitions; extracted from uploaded 2000 AMC 8 PDF",
    "license": "CC BY-NC-SA"
  }
];

export const sampleProblems: Problem[] = [
  ...legacySampleProblems,
  ...amc2001Problems,
];

export { legacySampleProblems };
