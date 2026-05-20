import type { Problem } from "../types/amc";

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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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
      "license": "CC BY-NC-SA"
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

/**
 * Structured import: 2001 AMC 8 Problems 1–25.
 * Includes recreated SVG diagrams for the visual problems, referenced by imageUrls.
 */
const amc2001Problems: Problem[] = [
  {
    "id": "amc8-2001-01",
    "title": "2001 AMC 8 Problem 1: Painting Golf Ball Dimples",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Unit conversion",
    "difficulty": 1,
    "statement": "Casey's shop class is making a golf trophy. He has to paint 300 dimples on a golf ball. If it takes him 2 seconds to paint one dimple, how many minutes will it take for him to finish?",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "8"
      },
      {
        "label": "D",
        "text": "10"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "10 minutes",
    "solutionSteps": [
      {
        "title": "Find the total seconds",
        "body": "There are 300 dimples and each takes 2 seconds.",
        "equation": "300 × 2 = 600 seconds"
      },
      {
        "title": "Convert seconds to minutes",
        "body": "One minute is 60 seconds, so divide by 60.",
        "equation": "600 ÷ 60 = 10"
      },
      {
        "title": "Choose the answer",
        "body": "It will take 10 minutes, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Count dimples",
        "narration": "Show 300 dimples, each taking 2 seconds.",
        "visualHint": "300 groups of 2 seconds combine into 600 seconds."
      },
      {
        "title": "Convert to minutes",
        "narration": "Divide the 600 seconds by 60 seconds per minute.",
        "visualHint": "600 ÷ 60 = 10 appears."
      },
      {
        "title": "Circle choice D",
        "narration": "The total time is 10 minutes.",
        "visualHint": "Choice D is highlighted."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "300 × 2 ÷ 60 = 10"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "arithmetic",
      "time",
      "unit conversion"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-02",
    "title": "2001 AMC 8 Problem 2: Product 24 and Sum 11",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 2,
    "category": "Algebra",
    "subcategory": "Factors",
    "difficulty": 1,
    "statement": "I'm thinking of two whole numbers. Their product is 24 and their sum is 11. What is the larger number?",
    "choices": [
      {
        "label": "A",
        "text": "3"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "8"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "List factor pairs",
        "body": "The whole-number factor pairs of 24 are 1 and 24, 2 and 12, 3 and 8, and 4 and 6."
      },
      {
        "title": "Check the sums",
        "body": "Only 3 and 8 have sum 11.",
        "equation": "3 + 8 = 11"
      },
      {
        "title": "Pick the larger number",
        "body": "The larger of the two numbers is 8, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Show factor pairs",
        "narration": "Display the factor pairs of 24.",
        "visualHint": "Pairs 1×24, 2×12, 3×8, and 4×6 appear."
      },
      {
        "title": "Test sums",
        "narration": "Add each pair and keep the pair that sums to 11.",
        "visualHint": "3 + 8 = 11 glows."
      },
      {
        "title": "Choose larger",
        "narration": "The larger number in the pair is 8.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "3 × 8 = 24, 3 + 8 = 11"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "factors",
      "whole numbers"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-03",
    "title": "2001 AMC 8 Problem 3: Elberta and Anjou Money",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 1,
    "statement": "Granny Smith has $63. Elberta has $2 more than Anjou and Anjou has one-third as much as Granny Smith. How many dollars does Elberta have?",
    "choices": [
      {
        "label": "A",
        "text": "17"
      },
      {
        "label": "B",
        "text": "18"
      },
      {
        "label": "C",
        "text": "19"
      },
      {
        "label": "D",
        "text": "21"
      },
      {
        "label": "E",
        "text": "23"
      }
    ],
    "answer": "E",
    "shortAnswer": "$23",
    "solutionSteps": [
      {
        "title": "Find Anjou's money",
        "body": "Anjou has one-third of Granny Smith's $63.",
        "equation": "63 ÷ 3 = 21"
      },
      {
        "title": "Add Elberta's extra money",
        "body": "Elberta has $2 more than Anjou.",
        "equation": "21 + 2 = 23"
      },
      {
        "title": "Choose the answer",
        "body": "Elberta has $23, so the answer is E."
      }
    ],
    "animationFrames": [
      {
        "title": "Split $63 into thirds",
        "narration": "Divide Granny Smith's money into three equal parts.",
        "visualHint": "$63 becomes three bars of $21."
      },
      {
        "title": "Add two dollars",
        "narration": "Elberta has one $21 part plus $2.",
        "visualHint": "$21 + $2 = $23."
      },
      {
        "title": "Circle choice E",
        "narration": "The amount is $23.",
        "visualHint": "Choice E is highlighted."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "total": 63,
        "parts": 3,
        "extra": 2
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "money",
      "fractions"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-04",
    "title": "2001 AMC 8 Problem 4: Smallest Even Five-Digit Number",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 4,
    "category": "Number Theory",
    "subcategory": "Digits and place value",
    "difficulty": 2,
    "statement": "The digits 1, 2, 3, 4 and 9 are each used once to form the smallest possible even five-digit number. The digit in the tens place is",
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
        "text": "9"
      }
    ],
    "answer": "E",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Reserve an even ones digit",
        "body": "The number must end in 2 or 4. To make the whole number as small as possible, use the smaller digits at the front and save 4 for the ones place."
      },
      {
        "title": "Build the smallest number",
        "body": "Use 1, 2, and 3 in the first three positions, then put 9 in the tens place and 4 in the ones place.",
        "equation": "12394"
      },
      {
        "title": "Read the tens digit",
        "body": "The tens digit is 9, so the answer is E."
      }
    ],
    "animationFrames": [
      {
        "title": "Sort the digits",
        "narration": "Arrange the digits from smallest to largest.",
        "visualHint": "1, 2, 3, 4, 9 appear."
      },
      {
        "title": "Keep the number even",
        "narration": "The ones digit must be even, so 4 goes at the end after using 1, 2, 3 as early as possible.",
        "visualHint": "The number 12394 forms."
      },
      {
        "title": "Read the tens place",
        "narration": "The tens place is the second digit from the right.",
        "visualHint": "The 9 is highlighted and choice E is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "number": "12394",
        "highlight": "tens digit 9"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "digits",
      "place value",
      "even numbers"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-05",
    "title": "2001 AMC 8 Problem 5: Lightning and Thunder Distance",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Rates and unit conversion",
    "difficulty": 1,
    "statement": "On a dark and stormy night Snoopy suddenly saw a flash of lightning. Ten seconds later he heard the sound of thunder. The speed of sound is 1088 feet per second and one mile is 5280 feet. Estimate, to the nearest half-mile, how far Snoopy was from the flash of lightning?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "1 1/2"
      },
      {
        "label": "C",
        "text": "2"
      },
      {
        "label": "D",
        "text": "2 1/2"
      },
      {
        "label": "E",
        "text": "3"
      }
    ],
    "answer": "C",
    "shortAnswer": "2 miles",
    "solutionSteps": [
      {
        "title": "Find the distance in feet",
        "body": "The sound traveled for 10 seconds at 1088 feet per second.",
        "equation": "1088 × 10 = 10880 feet"
      },
      {
        "title": "Convert to miles",
        "body": "Divide by 5280 feet per mile.",
        "equation": "10880 ÷ 5280 ≈ 2.06"
      },
      {
        "title": "Round to the nearest half-mile",
        "body": "2.06 miles rounds to 2 miles, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Show sound traveling",
        "narration": "A sound wave travels for 10 seconds.",
        "visualHint": "1088 ft/s × 10 s = 10880 ft."
      },
      {
        "title": "Convert to miles",
        "narration": "Compare 10880 feet to 5280 feet per mile.",
        "visualHint": "10880/5280 ≈ 2.06."
      },
      {
        "title": "Round",
        "narration": "The nearest half-mile is 2 miles.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "value": 2.06,
        "roundTo": "nearest half-mile"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "rates",
      "estimation",
      "unit conversion"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-06",
    "title": "2001 AMC 8 Problem 6: Equally Spaced Trees",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 6,
    "category": "Algebra",
    "subcategory": "Sequences and spacing",
    "difficulty": 1,
    "statement": "Six trees are equally spaced along one side of a straight road. The distance from the first tree to the fourth is 60 feet. What is the distance in feet between the first and last trees?",
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
        "text": "105"
      },
      {
        "label": "D",
        "text": "120"
      },
      {
        "label": "E",
        "text": "140"
      }
    ],
    "answer": "B",
    "shortAnswer": "100 feet",
    "solutionSteps": [
      {
        "title": "Count the gaps",
        "body": "From the 1st tree to the 4th tree there are 3 equal spaces."
      },
      {
        "title": "Find one space",
        "body": "Those 3 spaces total 60 feet.",
        "equation": "60 ÷ 3 = 20"
      },
      {
        "title": "Use all five spaces",
        "body": "From the 1st tree to the 6th tree there are 5 spaces.",
        "equation": "5 × 20 = 100"
      }
    ],
    "animationFrames": [
      {
        "title": "Place six trees",
        "narration": "Show six equally spaced trees in a row.",
        "visualHint": "Five equal gaps appear."
      },
      {
        "title": "Use trees 1 through 4",
        "narration": "The first to fourth tree covers three gaps totaling 60 feet.",
        "visualHint": "Each gap is labeled 20 feet."
      },
      {
        "title": "Extend to the last tree",
        "narration": "Five gaps make the full distance.",
        "visualHint": "5 × 20 = 100, then choice B is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "gaps": 5,
        "gapLength": 20
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "spacing",
      "sequences"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-07",
    "title": "2001 AMC 8 Problem 7: Small Kite Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 7,
    "category": "Geometry",
    "subcategory": "Area of a kite",
    "difficulty": 2,
    "statement": "To promote her school's annual Kite Olympics, Genevieve makes a small kite and a large kite for a bulletin board display. The kites look like the one in the diagram. For her small kite Genevieve draws the kite on a one-inch grid. For the large kite she triples both the height and width of the entire grid. What is the number of square inches in the area of the small kite?",
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
        "text": "23"
      },
      {
        "label": "D",
        "text": "24"
      },
      {
        "label": "E",
        "text": "25"
      }
    ],
    "answer": "A",
    "shortAnswer": "21 square inches",
    "solutionSteps": [
      {
        "title": "Read the diagonals",
        "body": "From the grid, the horizontal diagonal is 6 inches and the vertical diagonal is 7 inches."
      },
      {
        "title": "Use the kite area formula",
        "body": "The area of a kite is half the product of its diagonals.",
        "equation": "(6 × 7) ÷ 2 = 21"
      },
      {
        "title": "Choose the answer",
        "body": "The small kite has area 21 square inches, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the grid kite",
        "narration": "Display the kite on the one-inch grid.",
        "visualHint": "The horizontal and vertical diagonals are highlighted."
      },
      {
        "title": "Measure diagonals",
        "narration": "Count 6 inches across and 7 inches vertically.",
        "visualHint": "Labels 6 and 7 appear."
      },
      {
        "title": "Compute area",
        "narration": "Use half the product of the diagonals.",
        "visualHint": "(6 × 7)/2 = 21; choice A is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "diagonal1": 6,
        "diagonal2": 7,
        "area": 21
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "geometry",
      "area",
      "kite",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-07-kite.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-08",
    "title": "2001 AMC 8 Problem 8: Large Kite Bracing",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Scale factor and diagonals",
    "difficulty": 2,
    "statement": "To promote her school's annual Kite Olympics, Genevieve makes a small kite and a large kite for a bulletin board display. The kites look like the one in the diagram. For her small kite Genevieve draws the kite on a one-inch grid. For the large kite she triples both the height and width of the entire grid. Genevieve puts bracing on her large kite in the form of a cross connecting opposite corners of the kite. How many inches of bracing material does she need?",
    "choices": [
      {
        "label": "A",
        "text": "30"
      },
      {
        "label": "B",
        "text": "32"
      },
      {
        "label": "C",
        "text": "35"
      },
      {
        "label": "D",
        "text": "38"
      },
      {
        "label": "E",
        "text": "39"
      }
    ],
    "answer": "E",
    "shortAnswer": "39 inches",
    "solutionSteps": [
      {
        "title": "Scale the diagonals",
        "body": "The small kite diagonals are 6 and 7 inches. Tripling the grid triples both diagonal lengths."
      },
      {
        "title": "Find the large diagonals",
        "body": "The large kite diagonals are 18 inches and 21 inches.",
        "equation": "3 × 6 = 18, 3 × 7 = 21"
      },
      {
        "title": "Add the bracing lengths",
        "body": "The cross uses both diagonals.",
        "equation": "18 + 21 = 39"
      }
    ],
    "animationFrames": [
      {
        "title": "Start with the small diagonals",
        "narration": "Show the 6-inch and 7-inch diagonals on the small kite.",
        "visualHint": "The two diagonals glow."
      },
      {
        "title": "Triple the grid",
        "narration": "The large kite is 3 times as wide and 3 times as tall.",
        "visualHint": "6 becomes 18 and 7 becomes 21."
      },
      {
        "title": "Add the cross pieces",
        "narration": "The bracing is the sum of the two large diagonals.",
        "visualHint": "18 + 21 = 39, then choice E is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "smallDiagonals": "6,7",
        "scale": 3,
        "largeDiagonals": "18,21",
        "total": 39
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "geometry",
      "scale factor",
      "diagonals",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-08-bracing.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-09",
    "title": "2001 AMC 8 Problem 9: Kite Foil Waste",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 9,
    "category": "Geometry",
    "subcategory": "Area and scale factor",
    "difficulty": 3,
    "statement": "To promote her school's annual Kite Olympics, Genevieve makes a small kite and a large kite for a bulletin board display. The kites look like the one in the diagram. For her small kite Genevieve draws the kite on a one-inch grid. For the large kite she triples both the height and width of the entire grid. The large kite is covered with gold foil. The foil is cut from a rectangular piece that just covers the entire grid. How many square inches of waste material are cut off from the four corners?",
    "choices": [
      {
        "label": "A",
        "text": "63"
      },
      {
        "label": "B",
        "text": "72"
      },
      {
        "label": "C",
        "text": "180"
      },
      {
        "label": "D",
        "text": "189"
      },
      {
        "label": "E",
        "text": "264"
      }
    ],
    "answer": "D",
    "shortAnswer": "189 square inches",
    "solutionSteps": [
      {
        "title": "Scale the bounding rectangle",
        "body": "The small grid is 6 inches wide and 7 inches tall, so the large grid is 18 inches by 21 inches."
      },
      {
        "title": "Find the rectangle area",
        "body": "The rectangular foil piece has area 18 × 21.",
        "equation": "18 × 21 = 378"
      },
      {
        "title": "Use the kite area relationship",
        "body": "The kite takes half of its bounding rectangle, so the waste is the other half.",
        "equation": "378 ÷ 2 = 189"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the bounding rectangle",
        "narration": "Draw the rectangle that just covers the large grid.",
        "visualHint": "The 18 by 21 rectangle appears around the kite."
      },
      {
        "title": "Split rectangle and kite",
        "narration": "The kite uses half the rectangle area.",
        "visualHint": "The outside corner waste regions are shaded."
      },
      {
        "title": "Compute waste",
        "narration": "Half of 378 square inches is waste.",
        "visualHint": "378 ÷ 2 = 189, then choice D is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "rectangleArea": 378,
        "waste": 189
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "geometry",
      "area",
      "scale factor",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-09-waste.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-10",
    "title": "2001 AMC 8 Problem 10: State Quarters at 2000 Percent",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 1,
    "statement": "A collector offers to buy state quarters for 2000% of their face value. At that rate how much will Bryden get for his four state quarters?",
    "choices": [
      {
        "label": "A",
        "text": "20 dollars"
      },
      {
        "label": "B",
        "text": "50 dollars"
      },
      {
        "label": "C",
        "text": "200 dollars"
      },
      {
        "label": "D",
        "text": "500 dollars"
      },
      {
        "label": "E",
        "text": "2000 dollars"
      }
    ],
    "answer": "A",
    "shortAnswer": "$20",
    "solutionSteps": [
      {
        "title": "Find the face value",
        "body": "Four quarters have face value one dollar.",
        "equation": "4 × $0.25 = $1"
      },
      {
        "title": "Convert the percent",
        "body": "2000% means 20 times the original value.",
        "equation": "2000% = 20"
      },
      {
        "title": "Multiply",
        "body": "Twenty times one dollar is $20, so the answer is A.",
        "equation": "20 × $1 = $20"
      }
    ],
    "animationFrames": [
      {
        "title": "Show four quarters",
        "narration": "Four quarters combine to $1.",
        "visualHint": "Four quarter icons merge into $1."
      },
      {
        "title": "Convert 2000%",
        "narration": "2000 percent means 20 times the face value.",
        "visualHint": "2000% → 20×."
      },
      {
        "title": "Calculate payment",
        "narration": "Multiply $1 by 20.",
        "visualHint": "20 × $1 = $20; choice A is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "2000% × $1 = 20 × $1 = $20"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "percent",
      "money"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-11",
    "title": "2001 AMC 8 Problem 11: Coordinate Trapezoid Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 11,
    "category": "Geometry",
    "subcategory": "Coordinate geometry",
    "difficulty": 2,
    "statement": "Points A, B, C and D have coordinates A(3, 2), B(3, −2), C(−3, −2) and D(−3, 0). The area of quadrilateral ABCD is",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "15"
      },
      {
        "label": "C",
        "text": "18"
      },
      {
        "label": "D",
        "text": "21"
      },
      {
        "label": "E",
        "text": "24"
      }
    ],
    "answer": "C",
    "shortAnswer": "18",
    "solutionSteps": [
      {
        "title": "Identify parallel sides",
        "body": "AB and CD are vertical, so they are parallel. Their lengths are 4 and 2."
      },
      {
        "title": "Find the distance between them",
        "body": "The parallel sides lie on x = 3 and x = −3, so the distance between them is 6.",
        "equation": "3 − (−3) = 6"
      },
      {
        "title": "Use trapezoid area",
        "body": "Area equals the average of the bases times the height.",
        "equation": "((4 + 2)/2) × 6 = 18"
      }
    ],
    "animationFrames": [
      {
        "title": "Plot the points",
        "narration": "Place A, B, C, and D on the coordinate grid.",
        "visualHint": "The polygon ABCD is drawn."
      },
      {
        "title": "Measure the parallel sides",
        "narration": "AB is 4 units and CD is 2 units.",
        "visualHint": "Both vertical sides are highlighted."
      },
      {
        "title": "Compute trapezoid area",
        "narration": "Use the distance 6 between the parallel sides.",
        "visualHint": "((4+2)/2)×6 = 18, then choice C is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "A": "(3,2)",
        "B": "(3,-2)",
        "C": "(-3,-2)",
        "D": "(-3,0)",
        "area": 18
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "geometry",
      "coordinate plane",
      "area",
      "trapezoid",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-11-coordinate-trapezoid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-12",
    "title": "2001 AMC 8 Problem 12: Custom Operation",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Defined operations",
    "difficulty": 2,
    "statement": "If a ⊗ b = (a + b)/(a − b), then (6 ⊗ 4) ⊗ 3 =",
    "choices": [
      {
        "label": "A",
        "text": "4"
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
        "text": "30"
      },
      {
        "label": "E",
        "text": "72"
      }
    ],
    "answer": "A",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Evaluate inside first",
        "body": "Apply the operation to 6 and 4.",
        "equation": "6 ⊗ 4 = (6 + 4)/(6 − 4) = 10/2 = 5"
      },
      {
        "title": "Use the result with 3",
        "body": "Now evaluate 5 ⊗ 3.",
        "equation": "5 ⊗ 3 = (5 + 3)/(5 − 3) = 8/2 = 4"
      },
      {
        "title": "Choose the answer",
        "body": "The result is 4, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Replace the operation",
        "narration": "Substitute 6 and 4 into the formula.",
        "visualHint": "(6+4)/(6−4) appears."
      },
      {
        "title": "Simplify to 5",
        "narration": "The inner operation equals 5.",
        "visualHint": "(6⊗4)⊗3 becomes 5⊗3."
      },
      {
        "title": "Evaluate again",
        "narration": "Use the same rule one more time.",
        "visualHint": "(5+3)/(5−3)=4; choice A is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "(6 ⊗ 4) ⊗ 3 = 5 ⊗ 3 = 4"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "defined operation",
      "fractions"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-13",
    "title": "2001 AMC 8 Problem 13: Cherry Pie Graph Angle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 13,
    "category": "Algebra",
    "subcategory": "Pie charts and fractions",
    "difficulty": 2,
    "statement": "Of the 36 students in Richelle's class, 12 prefer chocolate pie, 8 prefer apple, and 6 prefer blueberry. Half of the remaining students prefer cherry pie and half prefer lemon. For Richelle's pie graph showing this data, how many degrees should she use for cherry pie?",
    "choices": [
      {
        "label": "A",
        "text": "10"
      },
      {
        "label": "B",
        "text": "20"
      },
      {
        "label": "C",
        "text": "30"
      },
      {
        "label": "D",
        "text": "50"
      },
      {
        "label": "E",
        "text": "72"
      }
    ],
    "answer": "D",
    "shortAnswer": "50°",
    "solutionSteps": [
      {
        "title": "Find the remaining students",
        "body": "Subtract the students already counted.",
        "equation": "36 − 12 − 8 − 6 = 10"
      },
      {
        "title": "Find cherry students",
        "body": "Half of the remaining 10 students prefer cherry pie.",
        "equation": "10 ÷ 2 = 5"
      },
      {
        "title": "Convert to degrees",
        "body": "Cherry is 5/36 of the circle.",
        "equation": "(5/36) × 360° = 50°"
      }
    ],
    "animationFrames": [
      {
        "title": "Subtract known pie choices",
        "narration": "Remove chocolate, apple, and blueberry from the class total.",
        "visualHint": "36 − 12 − 8 − 6 = 10."
      },
      {
        "title": "Split remaining students",
        "narration": "Half prefer cherry and half prefer lemon.",
        "visualHint": "10 splits into 5 and 5."
      },
      {
        "title": "Make pie angle",
        "narration": "Convert 5 of 36 students to a sector angle.",
        "visualHint": "5/36 × 360° = 50°, then choice D is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "part": 5,
        "total": 36,
        "degrees": 50
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "pie chart",
      "fractions",
      "degrees"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-14",
    "title": "2001 AMC 8 Problem 14: Buffet Meal Choices",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 14,
    "category": "Counting & Probability",
    "subcategory": "Combinations",
    "difficulty": 2,
    "statement": "Tyler has entered a buffet line in which he chooses one kind of meat, two different vegetables and one dessert. If the order of food items is not important, how many different meals might he choose? Meat: beef, chicken, pork. Vegetables: baked beans, corn, potatoes, tomatoes. Dessert: brownies, chocolate cake, chocolate pudding, ice cream.",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "24"
      },
      {
        "label": "C",
        "text": "72"
      },
      {
        "label": "D",
        "text": "80"
      },
      {
        "label": "E",
        "text": "144"
      }
    ],
    "answer": "C",
    "shortAnswer": "72",
    "solutionSteps": [
      {
        "title": "Choose meat and dessert",
        "body": "There are 3 meat choices and 4 dessert choices.",
        "equation": "3 × 4 = 12"
      },
      {
        "title": "Choose two vegetables",
        "body": "Choose 2 different vegetables from 4, with order not important.",
        "equation": "C(4,2) = 6"
      },
      {
        "title": "Multiply independent choices",
        "body": "For each meat-dessert pair there are 6 vegetable pairs.",
        "equation": "12 × 6 = 72"
      }
    ],
    "animationFrames": [
      {
        "title": "Pick meat and dessert",
        "narration": "Show 3 meat options and 4 dessert options.",
        "visualHint": "3 × 4 = 12."
      },
      {
        "title": "Choose vegetables",
        "narration": "Pair two different vegetables without caring about order.",
        "visualHint": "C(4,2)=6 vegetable pairs appear."
      },
      {
        "title": "Multiply",
        "narration": "Combine the independent choices.",
        "visualHint": "12 × 6 = 72; choice C is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "meats": 3,
        "vegetablesChoose2": 6,
        "desserts": 4,
        "total": 72
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "counting",
      "combinations",
      "multiplication principle"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-15",
    "title": "2001 AMC 8 Problem 15: Peeling Potatoes Together",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Work rates",
    "difficulty": 2,
    "statement": "Homer began peeling a pile of 44 potatoes at the rate of 3 potatoes per minute. Four minutes later Christen joined him and peeled at the rate of 5 potatoes per minute. When they finished, how many potatoes had Christen peeled?",
    "choices": [
      {
        "label": "A",
        "text": "20"
      },
      {
        "label": "B",
        "text": "24"
      },
      {
        "label": "C",
        "text": "32"
      },
      {
        "label": "D",
        "text": "33"
      },
      {
        "label": "E",
        "text": "40"
      }
    ],
    "answer": "A",
    "shortAnswer": "20 potatoes",
    "solutionSteps": [
      {
        "title": "Homer works alone first",
        "body": "For 4 minutes, Homer peels 3 potatoes per minute.",
        "equation": "4 × 3 = 12"
      },
      {
        "title": "Find the remaining potatoes",
        "body": "After that, 32 potatoes remain.",
        "equation": "44 − 12 = 32"
      },
      {
        "title": "Use the combined rate",
        "body": "Together they peel 3 + 5 = 8 potatoes per minute, so 32 potatoes take 4 minutes. Christen peels 5 per minute for 4 minutes.",
        "equation": "4 × 5 = 20"
      }
    ],
    "animationFrames": [
      {
        "title": "Homer starts alone",
        "narration": "Homer peels 12 potatoes in the first 4 minutes.",
        "visualHint": "44 drops to 32 remaining."
      },
      {
        "title": "Both peel together",
        "narration": "Their combined rate is 8 potatoes per minute.",
        "visualHint": "32 ÷ 8 = 4 minutes."
      },
      {
        "title": "Count Christen's potatoes",
        "narration": "Christen peels 5 per minute for 4 minutes.",
        "visualHint": "5 × 4 = 20; choice A is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "total": 44,
        "homerFirst": 12,
        "combinedRate": 8,
        "christenPeeled": 20
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "work rates",
      "rates"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-16",
    "title": "2001 AMC 8 Problem 16: Folded Paper Rectangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 16,
    "category": "Geometry",
    "subcategory": "Perimeter and folding",
    "difficulty": 3,
    "statement": "A square piece of paper, 4 inches on a side, is folded in half vertically. Both layers are then cut in half parallel to the fold. Three new rectangles are formed, a large one and two small ones. What is the ratio of the perimeter of one of the small rectangles to the perimeter of the large rectangle?",
    "choices": [
      {
        "label": "A",
        "text": "1/3"
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
        "text": "4/5"
      },
      {
        "label": "E",
        "text": "5/6"
      }
    ],
    "answer": "E",
    "shortAnswer": "5/6",
    "solutionSteps": [
      {
        "title": "Understand the pieces",
        "body": "After folding, cutting parallel to the fold creates two small 4 by 1 rectangles and one large 4 by 2 rectangle."
      },
      {
        "title": "Find the perimeters",
        "body": "A small rectangle has perimeter 2(4 + 1) = 10, and the large rectangle has perimeter 2(4 + 2) = 12."
      },
      {
        "title": "Form the ratio",
        "body": "The ratio is 10/12, which simplifies to 5/6.",
        "equation": "10/12 = 5/6"
      }
    ],
    "animationFrames": [
      {
        "title": "Fold the square",
        "narration": "Show the 4 by 4 square folded vertically.",
        "visualHint": "A dashed vertical fold line appears."
      },
      {
        "title": "Cut the folded paper",
        "narration": "Cut parallel to the fold halfway across the folded width.",
        "visualHint": "The small 4×1 pieces and the large 4×2 piece separate."
      },
      {
        "title": "Compare perimeters",
        "narration": "Compute 10 for the small rectangle and 12 for the large rectangle.",
        "visualHint": "10/12 = 5/6; choice E is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "small": "4×1",
        "large": "4×2",
        "ratio": "5/6"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "geometry",
      "perimeter",
      "folding",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-16-folding.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-17",
    "title": "2001 AMC 8 Problem 17: Millionaire Percent Increase",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Percent increase",
    "difficulty": 3,
    "statement": "For the game show Who Wants To Be A Millionaire?, the dollar values of each question are shown in the table where K = 1000: Question 1 through 15 have values 100, 200, 300, 500, 1K, 2K, 4K, 8K, 16K, 32K, 64K, 125K, 250K, 500K, 1000K. Between which two questions is the percent increase of the value the smallest?",
    "choices": [
      {
        "label": "A",
        "text": "From 1 to 2"
      },
      {
        "label": "B",
        "text": "From 2 to 3"
      },
      {
        "label": "C",
        "text": "From 3 to 4"
      },
      {
        "label": "D",
        "text": "From 11 to 12"
      },
      {
        "label": "E",
        "text": "From 14 to 15"
      }
    ],
    "answer": "B",
    "shortAnswer": "From 2 to 3",
    "solutionSteps": [
      {
        "title": "Check the obvious doubling jumps",
        "body": "From 1 to 2 and from 14 to 15, the value doubles, which is a 100% increase."
      },
      {
        "title": "Compare the smaller-looking jumps",
        "body": "From 2 to 3, the value goes from 200 to 300, a 50% increase. From 3 to 4, it goes from 300 to 500, a 66 2/3% increase. From 11 to 12, it goes from 64K to 125K, almost a 95% increase."
      },
      {
        "title": "Choose the smallest",
        "body": "The smallest percent increase is from 2 to 3, so the answer is B.",
        "equation": "(300 − 200)/200 = 1/2 = 50%"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the table",
        "narration": "Display the question values from 1 to 15.",
        "visualHint": "The value row appears with 100, 200, 300, 500, and so on."
      },
      {
        "title": "Compare percent changes",
        "narration": "Focus on the answer choices and compute each percent increase.",
        "visualHint": "2→3 gives 50%, 3→4 gives 66 2/3%, and 11→12 is much larger."
      },
      {
        "title": "Highlight smallest",
        "narration": "The smallest increase is from question 2 to question 3.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "smallest": "From 2 to 3",
        "percent": 50
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "percent",
      "table",
      "rates of change",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-17-millionaire-table.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-18",
    "title": "2001 AMC 8 Problem 18: Dice Product Multiple of 5",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 18,
    "category": "Counting & Probability",
    "subcategory": "Probability with dice",
    "difficulty": 3,
    "statement": "Two dice are thrown. What is the probability that the product of the two numbers is a multiple of 5?",
    "choices": [
      {
        "label": "A",
        "text": "1/36"
      },
      {
        "label": "B",
        "text": "1/18"
      },
      {
        "label": "C",
        "text": "1/6"
      },
      {
        "label": "D",
        "text": "11/36"
      },
      {
        "label": "E",
        "text": "1/3"
      }
    ],
    "answer": "D",
    "shortAnswer": "11/36",
    "solutionSteps": [
      {
        "title": "Use the complement",
        "body": "The product is a multiple of 5 exactly when at least one die shows 5."
      },
      {
        "title": "Find no fives",
        "body": "The probability that neither die shows 5 is (5/6)(5/6).",
        "equation": "(5/6)^2 = 25/36"
      },
      {
        "title": "Subtract from 1",
        "body": "The probability of at least one 5 is 1 − 25/36.",
        "equation": "1 − 25/36 = 11/36"
      }
    ],
    "animationFrames": [
      {
        "title": "Focus on the factor 5",
        "narration": "A product is a multiple of 5 only if at least one die is 5.",
        "visualHint": "All outcomes with a 5 are highlighted on a 6 by 6 grid."
      },
      {
        "title": "Count the complement",
        "narration": "It is easier to count outcomes with no 5s.",
        "visualHint": "A 5 by 5 block of no-five outcomes appears."
      },
      {
        "title": "Subtract",
        "narration": "Remove the 25 no-five outcomes from 36 total outcomes.",
        "visualHint": "36 − 25 = 11, so probability 11/36; choice D is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "totalOutcomes": 36,
        "favorable": 11,
        "probability": "11/36"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "probability",
      "dice",
      "complement"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-19",
    "title": "2001 AMC 8 Problem 19: Speed-Time Graph for Car N",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 19,
    "category": "Algebra",
    "subcategory": "Graph interpretation",
    "difficulty": 3,
    "statement": "Car M traveled at a constant speed for a given time. This is shown by the dashed line. Car N traveled at twice the speed for the same distance. If Car M and Car N's speed and time are shown as solid line, which graph illustrates this?",
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
    "answer": "D",
    "shortAnswer": "Graph D",
    "solutionSteps": [
      {
        "title": "Use twice the speed",
        "body": "On a speed-time graph, twice the speed means N must be twice as high as M."
      },
      {
        "title": "Use same distance",
        "body": "Distance is speed times time, or area under the speed-time graph. If speed doubles and distance stays the same, time must be cut in half."
      },
      {
        "title": "Pick the matching graph",
        "body": "The correct graph has N higher than M but only half as long in time. That is graph D."
      }
    ],
    "animationFrames": [
      {
        "title": "Show M's rectangle",
        "narration": "For constant speed, distance is the area of a rectangle under the line.",
        "visualHint": "The dashed M line forms a speed × time rectangle."
      },
      {
        "title": "Double speed, halve time",
        "narration": "N is twice as high but half as long, keeping the same area.",
        "visualHint": "A tall narrow rectangle has the same area."
      },
      {
        "title": "Match the choice",
        "narration": "Only graph D shows N higher and shorter.",
        "visualHint": "Choice D is highlighted."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "correct": "D",
        "speedFactor": 2,
        "timeFactor": "1/2"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "graphs",
      "speed",
      "distance",
      "rates",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-19-speed-graphs.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-20",
    "title": "2001 AMC 8 Problem 20: Hidden Test Scores Logic",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 20,
    "category": "Logic",
    "subcategory": "Ordering",
    "difficulty": 4,
    "statement": "Kaleana shows her test score to Quay, Marty and Shana, but the others keep theirs hidden. Quay thinks, \"At least two of us have the same score.\" Marty thinks, \"I didn't get the lowest score.\" Shana thinks, \"I didn't get the highest score.\" List the scores from lowest to highest for Marty (M), Quay (Q) and Shana (S).",
    "choices": [
      {
        "label": "A",
        "text": "S,Q,M"
      },
      {
        "label": "B",
        "text": "Q,M,S"
      },
      {
        "label": "C",
        "text": "Q,S,M"
      },
      {
        "label": "D",
        "text": "M,S,Q"
      },
      {
        "label": "E",
        "text": "S,M,Q"
      }
    ],
    "answer": "A",
    "shortAnswer": "S, Q, M",
    "solutionSteps": [
      {
        "title": "Use Quay's statement",
        "body": "Quay only knows Kaleana's score besides his own. For him to know two people have the same score, his score must equal Kaleana's."
      },
      {
        "title": "Use Marty and Shana",
        "body": "Marty knows he is not lowest, so he must be above Kaleana. Shana knows she is not highest, so she must be below Kaleana."
      },
      {
        "title": "Order the three hidden scores",
        "body": "Since Quay equals Kaleana, the order is Shana, Quay, Marty.",
        "equation": "S < Q < M"
      }
    ],
    "animationFrames": [
      {
        "title": "Mark Kaleana as known",
        "narration": "Each student compares only their own score to Kaleana's visible score.",
        "visualHint": "K appears in the center."
      },
      {
        "title": "Infer relationships",
        "narration": "Quay equals K, Marty is above K, and Shana is below K.",
        "visualHint": "S < K = Q < M is shown."
      },
      {
        "title": "Remove K",
        "narration": "List only Marty, Quay, and Shana from lowest to highest.",
        "visualHint": "S, Q, M appears and choice A is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "order": "S < Q < M"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "logic",
      "ordering",
      "inequalities"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-21",
    "title": "2001 AMC 8 Problem 21: Largest Integer with Mean 15",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 21,
    "category": "Algebra",
    "subcategory": "Mean and median",
    "difficulty": 3,
    "statement": "The mean of a set of five different positive integers is 15. The median is 18. The maximum possible value of the largest of these five integers is",
    "choices": [
      {
        "label": "A",
        "text": "19"
      },
      {
        "label": "B",
        "text": "24"
      },
      {
        "label": "C",
        "text": "32"
      },
      {
        "label": "D",
        "text": "35"
      },
      {
        "label": "E",
        "text": "40"
      }
    ],
    "answer": "D",
    "shortAnswer": "35",
    "solutionSteps": [
      {
        "title": "Find the total sum",
        "body": "Five integers with mean 15 have total sum 75.",
        "equation": "5 × 15 = 75"
      },
      {
        "title": "Make the other numbers small",
        "body": "The median is 18, so the ordered list is _, _, 18, _, _. To maximize the largest number, make the other four values as small as possible: 1, 2, 18, and 19."
      },
      {
        "title": "Find the largest value",
        "body": "Subtract those four values from the total.",
        "equation": "75 − 1 − 2 − 18 − 19 = 35"
      }
    ],
    "animationFrames": [
      {
        "title": "Set the middle value",
        "narration": "With five numbers, the median is the third number.",
        "visualHint": "_, _, 18, _, _ appears."
      },
      {
        "title": "Minimize the rest",
        "narration": "Use 1 and 2 below 18, and 19 just above 18.",
        "visualHint": "1, 2, 18, 19, _."
      },
      {
        "title": "Use the total sum",
        "narration": "Subtract from 75 to maximize the last number.",
        "visualHint": "75 − 1 − 2 − 18 − 19 = 35; choice D is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "sum": 75,
        "known": "1,2,18,19",
        "largest": 35
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "mean",
      "median",
      "integers",
      "optimization"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-22",
    "title": "2001 AMC 8 Problem 22: Impossible Test Score",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 22,
    "category": "Number Theory",
    "subcategory": "Scoring combinations",
    "difficulty": 3,
    "statement": "On a twenty-question test, each correct answer is worth 5 points, each unanswered question is worth 1 point and each incorrect answer is worth 0 points. Which of the following scores is NOT possible?",
    "choices": [
      {
        "label": "A",
        "text": "90"
      },
      {
        "label": "B",
        "text": "91"
      },
      {
        "label": "C",
        "text": "92"
      },
      {
        "label": "D",
        "text": "95"
      },
      {
        "label": "E",
        "text": "97"
      }
    ],
    "answer": "E",
    "shortAnswer": "97",
    "solutionSteps": [
      {
        "title": "Find the top score",
        "body": "All 20 questions correct gives 100 points.",
        "equation": "20 × 5 = 100"
      },
      {
        "title": "Find the next-highest score",
        "body": "The best score below 100 is 19 correct and 1 blank, worth 96 points.",
        "equation": "19 × 5 + 1 = 96"
      },
      {
        "title": "Identify the gap",
        "body": "No score between 96 and 100 is possible, so 97 is not possible. The answer is E."
      }
    ],
    "animationFrames": [
      {
        "title": "Start at perfect score",
        "narration": "Twenty correct answers give 100 points.",
        "visualHint": "100 appears at the top of a score ladder."
      },
      {
        "title": "Drop one question",
        "narration": "The smallest drop from perfect is replacing one correct answer with a blank: lose 4 points.",
        "visualHint": "100 becomes 96."
      },
      {
        "title": "Spot the impossible score",
        "narration": "Scores 97, 98, and 99 cannot happen.",
        "visualHint": "97 is highlighted and choice E is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "impossible": 97,
        "gap": "97-99"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "scoring",
      "combinations",
      "integers"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2001-23",
    "title": "2001 AMC 8 Problem 23: Noncongruent Triangles from Midpoints",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Triangle congruence",
    "difficulty": 4,
    "statement": "Points R, S and T are vertices of an equilateral triangle, and points X, Y and Z are midpoints of its sides. How many noncongruent triangles can be drawn using any three of these six points as vertices?",
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
        "text": "20"
      }
    ],
    "answer": "D",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Recognize symmetry",
        "body": "The six points form an equilateral triangle with midpoints, so many choices of three points make congruent triangles."
      },
      {
        "title": "Group by size and shape",
        "body": "There is the large triangle RST, the middle equilateral triangles like SYZ, and two different sizes/shapes of smaller triangles from using vertices and midpoints."
      },
      {
        "title": "Count the types",
        "body": "These give 4 noncongruent triangle types total, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the six points",
        "narration": "Display R, S, T and side midpoints X, Y, Z.",
        "visualHint": "The large equilateral triangle outline appears."
      },
      {
        "title": "Group congruent examples",
        "narration": "Triangles that can be rotated or reflected onto each other are one type.",
        "visualHint": "Examples of the same shape glow together."
      },
      {
        "title": "Count distinct shapes",
        "narration": "There are four different shapes/sizes.",
        "visualHint": "Four representative triangles are shown and choice D is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "types": 4
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "geometry",
      "triangles",
      "congruence",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-23-midpoints.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-24",
    "title": "2001 AMC 8 Problem 24: Folded Colored Triangle Pairs",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 24,
    "category": "Counting & Probability",
    "subcategory": "Counting with constraints",
    "difficulty": 4,
    "statement": "Each half of this figure is composed of 3 red triangles, 5 blue triangles and 8 white triangles. When the upper half is folded down over the centerline, 2 pairs of red triangles coincide, as do 3 pairs of blue triangles. There are 2 red-white pairs. How many white pairs coincide?",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "5"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "7"
      },
      {
        "label": "E",
        "text": "9"
      }
    ],
    "answer": "B",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Remove same-color pairs",
        "body": "On each half, 2 red-red pairs use 2 red triangles and 3 blue-blue pairs use 3 blue triangles."
      },
      {
        "title": "Use red-white pairs",
        "body": "After the red-red pairs, each half has only 1 red left. The 2 red-white pairs must use that 1 red on each half and 1 white on each half."
      },
      {
        "title": "Finish the remaining colors",
        "body": "Each half now has 2 blue and 7 white left. The remaining blue triangles must pair with white triangles, using 2 white on each half. That leaves 5 white triangles on each half, so there are 5 white-white pairs."
      }
    ],
    "animationFrames": [
      {
        "title": "Track one half",
        "narration": "Start with 3 red, 5 blue, and 8 white triangles on each half.",
        "visualHint": "Color counters show R=3, B=5, W=8."
      },
      {
        "title": "Subtract known pairs",
        "narration": "Remove 2 red-red pairs, 3 blue-blue pairs, and 2 red-white pairs.",
        "visualHint": "Counters update to R=0, B=2, W=7 on each half."
      },
      {
        "title": "Pair remaining triangles",
        "narration": "The remaining blue triangles pair with whites, leaving 5 whites on each half.",
        "visualHint": "5 white-white pairs remain; choice B is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "red": 3,
        "blue": 5,
        "white": 8,
        "whitePairs": 5
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "counting",
      "logic",
      "folding",
      "diagram"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2001/problem-24-folded-triangles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2001-25",
    "title": "2001 AMC 8 Problem 25: Four-Digit Multiple",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2001,
    "problemNumber": 25,
    "category": "Number Theory",
    "subcategory": "Divisibility and permutations",
    "difficulty": 4,
    "statement": "There are 24 four-digit whole numbers that use each of the four digits 2, 4, 5 and 7 exactly once. Only one of these four-digit numbers is a multiple of another one. Which of the following is it?",
    "choices": [
      {
        "label": "A",
        "text": "5724"
      },
      {
        "label": "B",
        "text": "7245"
      },
      {
        "label": "C",
        "text": "7254"
      },
      {
        "label": "D",
        "text": "7425"
      },
      {
        "label": "E",
        "text": "7542"
      }
    ],
    "answer": "D",
    "shortAnswer": "7425",
    "solutionSteps": [
      {
        "title": "Look for a smaller partner",
        "body": "If a listed number is a multiple of another permutation, dividing by 2 or 3 is the most useful quick check because larger factors would make the partner too small or not four digits with the required digits."
      },
      {
        "title": "Test likely divisions",
        "body": "The key successful check is 7425 divided by 3.",
        "equation": "7425 ÷ 3 = 2475"
      },
      {
        "title": "Verify the partner",
        "body": "2475 also uses exactly the digits 2, 4, 5 and 7 once. Therefore 7425 is a multiple of another allowed number, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the candidates",
        "narration": "List the five answer choices.",
        "visualHint": "5724, 7245, 7254, 7425, 7542 appear."
      },
      {
        "title": "Try divisibility",
        "narration": "Check whether dividing a candidate gives another number using the same four digits.",
        "visualHint": "7425 ÷ 3 = 2475 is highlighted."
      },
      {
        "title": "Confirm the digits",
        "narration": "2475 uses 2, 4, 5, and 7 exactly once.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "7425 ÷ 3 = 2475"
      }
    },
    "tags": [
      "AMC 8",
      "2001",
      "number theory",
      "digits",
      "divisibility",
      "permutations"
    ],
    "sourceName": "2001 AMC 8",
    "license": "CC BY-NC-SA"
  }
];

/**
 * Structured import: 2002 AMC 8 Problems 1–25.
 * 2002 entries are kept inline in sampleProblems.ts, with recreated SVG diagrams referenced by imageUrls.
 */
const amc2002Problems: Problem[] = [
  {
    "id": "amc8-2002-01",
    "title": "2002 AMC 8 Problem 1: Circle and Two Lines",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 1,
    "category": "Geometry",
    "subcategory": "Intersections",
    "difficulty": 1,
    "statement": "A circle and two distinct lines are drawn on a sheet of paper. What is the largest possible number of points of intersection of these figures?",
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
        "text": "6"
      }
    ],
    "answer": "D",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Maximize line-circle intersections",
        "body": "Each line can intersect the circle in at most two points.",
        "equation": "2 + 2"
      },
      {
        "title": "Add the line-line intersection",
        "body": "The two distinct lines can intersect each other once if they are not parallel.",
        "equation": "2 + 2 + 1 = 5"
      },
      {
        "title": "Choose the answer",
        "body": "The largest possible number of intersection points is 5, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Draw the circle",
        "narration": "Start with one circle on the page.",
        "visualHint": "A circle appears."
      },
      {
        "title": "Add two secant lines",
        "narration": "Draw two lines so each cuts the circle twice.",
        "visualHint": "Four line-circle intersection points appear."
      },
      {
        "title": "Count the line crossing",
        "narration": "Let the two lines cross each other once inside or outside the circle.",
        "visualHint": "The fifth point is highlighted, and choice D is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "idea": "2+2+1 intersections"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "intersections",
      "circles",
      "lines"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-02",
    "title": "2002 AMC 8 Problem 2: Five-Dollar and Two-Dollar Bills",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 2,
    "category": "Number Theory",
    "subcategory": "Linear combinations",
    "difficulty": 2,
    "statement": "How many different combinations of $5 bills and $2 bills can be used to make a total of $17? Order does not matter in this problem.",
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
        "text": "6"
      }
    ],
    "answer": "A",
    "shortAnswer": "2",
    "solutionSteps": [
      {
        "title": "Set up the equation",
        "body": "Let f be the number of $5 bills and t be the number of $2 bills.",
        "equation": "5f + 2t = 17"
      },
      {
        "title": "Test possible $5 bills",
        "body": "The number of $5 bills must be odd to leave an even amount for $2 bills: f = 1 or f = 3.",
        "equation": "f=1 → t=6;\  f=3 → t=1"
      },
      {
        "title": "Count combinations",
        "body": "There are exactly 2 combinations, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the target",
        "narration": "Put $17 at the top of a small table.",
        "visualHint": "A table has columns for $5 bills and $2 bills."
      },
      {
        "title": "Try $5 bills",
        "narration": "Only 1 or 3 five-dollar bills work.",
        "visualHint": "Rows (1,6) and (3,1) remain."
      },
      {
        "title": "Count the rows",
        "narration": "There are two valid combinations.",
        "visualHint": "Choice A is highlighted."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "5f+2t=17"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "number theory",
      "combinations",
      "money"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-03",
    "title": "2002 AMC 8 Problem 3: Smallest Average of Even Integers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 1,
    "statement": "What is the smallest possible average of four distinct positive even integers?",
    "choices": [
      {
        "label": "A",
        "text": "3"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "7"
      }
    ],
    "answer": "C",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Choose the smallest numbers",
        "body": "To minimize the average, use the four smallest distinct positive even integers.",
        "equation": "2,4,6,8"
      },
      {
        "title": "Average them",
        "body": "Add the numbers and divide by 4.",
        "equation": "(2+4+6+8)/4 = 20/4 = 5"
      },
      {
        "title": "Choose the answer",
        "body": "The smallest possible average is 5, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "List even numbers",
        "narration": "Show the first positive even numbers.",
        "visualHint": "2, 4, 6, 8 are highlighted."
      },
      {
        "title": "Add and divide",
        "narration": "Find their average.",
        "visualHint": "20 ÷ 4 = 5 appears."
      },
      {
        "title": "Circle C",
        "narration": "The minimum average is 5.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "(2+4+6+8)/4=5"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "average",
      "integers"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-04",
    "title": "2002 AMC 8 Problem 4: Next Palindrome Year",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 4,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 1,
    "statement": "The year 2002 is a palindrome, a number that reads the same from left to right as it does from right to left. What is the product of the digits of the next year after 2002 that is a palindrome?",
    "choices": [
      {
        "label": "A",
        "text": "0"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "9"
      },
      {
        "label": "D",
        "text": "16"
      },
      {
        "label": "E",
        "text": "25"
      }
    ],
    "answer": "B",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Find the next palindrome",
        "body": "The next year after 2002 that reads the same both ways is 2112."
      },
      {
        "title": "Multiply the digits",
        "body": "Multiply its digits.",
        "equation": "2×1×1×2=4"
      },
      {
        "title": "Choose the answer",
        "body": "The product is 4, so the answer is B."
      }
    ],
    "animationFrames": [
      {
        "title": "Mirror the year",
        "narration": "Move from 2002 to the next four-digit palindrome.",
        "visualHint": "2112 appears with matching outer and inner digits."
      },
      {
        "title": "Multiply digits",
        "narration": "Multiply 2, 1, 1, and 2.",
        "visualHint": "2 × 1 × 1 × 2 = 4."
      },
      {
        "title": "Circle B",
        "narration": "The product is 4.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "2×1×1×2=4"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "number theory",
      "palindrome",
      "digits"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-05",
    "title": "2002 AMC 8 Problem 5: 706 Days Old",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 5,
    "category": "Number Theory",
    "subcategory": "Modular arithmetic",
    "difficulty": 2,
    "statement": "Carlos Montado was born on Saturday, November 9, 2002. On what day of the week will Carlos be 706 days old?",
    "choices": [
      {
        "label": "A",
        "text": "Monday"
      },
      {
        "label": "B",
        "text": "Wednesday"
      },
      {
        "label": "C",
        "text": "Friday"
      },
      {
        "label": "D",
        "text": "Saturday"
      },
      {
        "label": "E",
        "text": "Sunday"
      }
    ],
    "answer": "C",
    "shortAnswer": "Friday",
    "solutionSteps": [
      {
        "title": "Use the weekly cycle",
        "body": "Days of the week repeat every 7 days.",
        "equation": "706 = 7×100 + 6"
      },
      {
        "title": "Move six days forward",
        "body": "Starting from Saturday, six days later is Friday."
      },
      {
        "title": "Choose the answer",
        "body": "Carlos will be 706 days old on a Friday, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Show a week cycle",
        "narration": "Mark Saturday as the starting day.",
        "visualHint": "A seven-day loop appears."
      },
      {
        "title": "Remove full weeks",
        "narration": "700 days brings the day back to Saturday.",
        "visualHint": "706 = 700 + 6."
      },
      {
        "title": "Advance six days",
        "narration": "Count forward six days to Friday.",
        "visualHint": "Friday and choice C are highlighted."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "steps": 6
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "number theory",
      "modular arithmetic",
      "calendar"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-06",
    "title": "2002 AMC 8 Problem 6: Birdbath Overflow Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 6,
    "category": "Algebra",
    "subcategory": "Graphs",
    "difficulty": 2,
    "statement": "A birdbath is designed to overflow so that it will be self-cleaning. Water flows in at the rate of 20 milliliters per minute and drains at the rate of 18 milliliters per minute. Which graph shows the volume of water in the birdbath during the filling time and continuing into the overflow time?",
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
    "answer": "A",
    "shortAnswer": "A",
    "solutionSteps": [
      {
        "title": "Find the net filling rate",
        "body": "Before overflow, the water volume increases at a constant rate.",
        "equation": "20-18=2"
      },
      {
        "title": "Understand overflow",
        "body": "Once the birdbath is full, extra water spills out, so the volume stays constant."
      },
      {
        "title": "Choose the graph",
        "body": "Graph A rises at first and then levels off, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Start filling",
        "narration": "The volume rises steadily because more water enters than drains.",
        "visualHint": "An increasing line segment appears."
      },
      {
        "title": "Reach overflow",
        "narration": "After the birdbath is full, the volume cannot keep increasing.",
        "visualHint": "The graph becomes horizontal."
      },
      {
        "title": "Match graph A",
        "narration": "Only A shows increasing then flat.",
        "visualHint": "Graph A is highlighted."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "correct": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "graphs",
      "rates"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-06-birdbath-graphs.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-07",
    "title": "2002 AMC 8 Problem 7: Sweet Tooth Bar Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Data displays",
    "difficulty": 2,
    "statement": "The students in Mrs. Sawyer's class were asked to do a taste test of five kinds of candy. Each student chose one kind of candy. A bar graph of their preferences is shown. What percent of her class chose candy E?",
    "choices": [
      {
        "label": "A",
        "text": "5"
      },
      {
        "label": "B",
        "text": "12"
      },
      {
        "label": "C",
        "text": "15"
      },
      {
        "label": "D",
        "text": "16"
      },
      {
        "label": "E",
        "text": "20"
      }
    ],
    "answer": "E",
    "shortAnswer": "20%",
    "solutionSteps": [
      {
        "title": "Read the bar graph",
        "body": "The bars show A=6, B=8, C=4, D=2, and E=5 students."
      },
      {
        "title": "Find the total",
        "body": "Add the bar heights to get the class size.",
        "equation": "6+8+4+2+5=25"
      },
      {
        "title": "Compute the percent",
        "body": "Candy E was chosen by 5 out of 25 students.",
        "equation": "5/25×100=20\%"
      }
    ],
    "animationFrames": [
      {
        "title": "Read E",
        "narration": "Highlight the bar for candy E at height 5.",
        "visualHint": "The E bar glows."
      },
      {
        "title": "Add all bars",
        "narration": "Add all five bar heights.",
        "visualHint": "6 + 8 + 4 + 2 + 5 = 25."
      },
      {
        "title": "Convert to percent",
        "narration": "Five out of twenty-five is twenty percent.",
        "visualHint": "5/25 = 20%, then choice E is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "values": [
          6,
          8,
          4,
          2,
          5
        ]
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "bar graph",
      "percent",
      "data"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-07-sweet-tooth-bar-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-08",
    "title": "2002 AMC 8 Problem 8: European Stamps from the 80s",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 8,
    "category": "Algebra",
    "subcategory": "Tables and data",
    "difficulty": 2,
    "statement": "Juan organizes the stamps in his collection by country and by the decade in which they were issued. The prices he paid for them at a stamp shop were: Brazil and France, 6 cents each, Peru 4 cents each, and Spain 5 cents each. Brazil and Peru are South American countries, and France and Spain are in Europe. How many of Juan's European stamps were issued in the '80s?",
    "choices": [
      {
        "label": "A",
        "text": "9"
      },
      {
        "label": "B",
        "text": "15"
      },
      {
        "label": "C",
        "text": "18"
      },
      {
        "label": "D",
        "text": "24"
      },
      {
        "label": "E",
        "text": "42"
      }
    ],
    "answer": "D",
    "shortAnswer": "24",
    "solutionSteps": [
      {
        "title": "Identify Europe",
        "body": "France and Spain are the European countries in the table."
      },
      {
        "title": "Read the 80s column",
        "body": "France has 15 stamps from the 80s, and Spain has 9.",
        "equation": "15+9=24"
      },
      {
        "title": "Choose the answer",
        "body": "There are 24 European stamps from the 80s, so the answer is D."
      }
    ],
    "animationFrames": [
      {
        "title": "Highlight Europe",
        "narration": "Mark France and Spain in the country column.",
        "visualHint": "France and Spain rows glow."
      },
      {
        "title": "Read the 80s column",
        "narration": "Find 15 and 9 in the 80s column.",
        "visualHint": "The cells 15 and 9 are highlighted."
      },
      {
        "title": "Add them",
        "narration": "Add 15 and 9 to get 24.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "cells": "France 80s + Spain 80s"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "data table",
      "data"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-08-10-stamp-table.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-09",
    "title": "2002 AMC 8 Problem 9: Cost of South American Stamps Before the 70s",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Tables and data",
    "difficulty": 2,
    "statement": "Juan organizes the stamps in his collection by country and by the decade in which they were issued. The prices he paid for them at a stamp shop were: Brazil and France, 6 cents each, Peru 4 cents each, and Spain 5 cents each. Brazil and Peru are South American countries, and France and Spain are in Europe. In dollars and cents, how much did Juan's South American stamps issued before the '70s cost him?",
    "choices": [
      {
        "label": "A",
        "text": "$0.40"
      },
      {
        "label": "B",
        "text": "$1.06"
      },
      {
        "label": "C",
        "text": "$1.80"
      },
      {
        "label": "D",
        "text": "$2.38"
      },
      {
        "label": "E",
        "text": "$2.64"
      }
    ],
    "answer": "B",
    "shortAnswer": "$1.06",
    "solutionSteps": [
      {
        "title": "Identify South America and before the 70s",
        "body": "Use Brazil and Peru, and only the 50s and 60s columns."
      },
      {
        "title": "Count the stamps",
        "body": "Brazil has 4+7=11 stamps at 6 cents each. Peru has 6+4=10 stamps at 4 cents each."
      },
      {
        "title": "Compute the cost",
        "body": "Add the two costs.",
        "equation": "11(0.06)+10(0.04)=0.66+0.40=1.06"
      }
    ],
    "animationFrames": [
      {
        "title": "Highlight rows and columns",
        "narration": "Highlight Brazil and Peru in the 50s and 60s columns.",
        "visualHint": "Four cells glow: 4, 7, 6, 4."
      },
      {
        "title": "Compute each country's cost",
        "narration": "Brazil costs 66 cents and Peru costs 40 cents.",
        "visualHint": "11×6¢ and 10×4¢ appear."
      },
      {
        "title": "Add costs",
        "narration": "The total is $1.06.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "11(0.06)+10(0.04)=1.06"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "data table",
      "data"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-08-10-stamp-table.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-10",
    "title": "2002 AMC 8 Problem 10: Average Price of 70s Stamps",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Tables and data",
    "difficulty": 2,
    "statement": "Juan organizes the stamps in his collection by country and by the decade in which they were issued. The prices he paid for them at a stamp shop were: Brazil and France, 6 cents each, Peru 4 cents each, and Spain 5 cents each. Brazil and Peru are South American countries, and France and Spain are in Europe. The average price of Juan's '70s stamps is closest to",
    "choices": [
      {
        "label": "A",
        "text": "3.5 cents"
      },
      {
        "label": "B",
        "text": "4 cents"
      },
      {
        "label": "C",
        "text": "4.5 cents"
      },
      {
        "label": "D",
        "text": "5 cents"
      },
      {
        "label": "E",
        "text": "5.5 cents"
      }
    ],
    "answer": "E",
    "shortAnswer": "5.5 cents",
    "solutionSteps": [
      {
        "title": "Use the 70s column",
        "body": "The 70s counts are Brazil 12, France 12, Peru 6, and Spain 13."
      },
      {
        "title": "Compute total cost",
        "body": "Brazil and France cost 6 cents each, Peru 4 cents, and Spain 5 cents.",
        "equation": "12(6)+12(6)+6(4)+13(5)=233"
      },
      {
        "title": "Divide by total stamps",
        "body": "There are 12+12+6+13=43 stamps, so the average is about 5.42 cents, closest to 5.5 cents.",
        "equation": "233/43≈5.42"
      }
    ],
    "animationFrames": [
      {
        "title": "Highlight the 70s column",
        "narration": "Read the four 70s counts.",
        "visualHint": "12, 12, 6, and 13 glow."
      },
      {
        "title": "Weight by price",
        "narration": "Multiply each count by its country price.",
        "visualHint": "12×6 + 12×6 + 6×4 + 13×5."
      },
      {
        "title": "Average",
        "narration": "Divide by 43 stamps and round to the closest choice.",
        "visualHint": "5.42 is closest to 5.5, so choice E is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "233/43≈5.42"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "data table",
      "weighted average"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-08-10-stamp-table.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-11",
    "title": "2002 AMC 8 Problem 11: Square Tile Sequence",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Sequences",
    "difficulty": 2,
    "statement": "A sequence of squares is made of identical square tiles. The edge of each square is one tile length longer than the edge of the previous square. The first three squares are shown. How many more tiles does the seventh square require than the sixth?",
    "choices": [
      {
        "label": "A",
        "text": "11"
      },
      {
        "label": "B",
        "text": "12"
      },
      {
        "label": "C",
        "text": "13"
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
    "answer": "C",
    "shortAnswer": "13",
    "solutionSteps": [
      {
        "title": "Recognize the pattern",
        "body": "The nth square has side length n, so it uses n² tiles."
      },
      {
        "title": "Compare the sixth and seventh",
        "body": "The seventh square uses 7²=49 tiles, and the sixth uses 6²=36 tiles."
      },
      {
        "title": "Subtract",
        "body": "The difference is 13 tiles.",
        "equation": "49-36=13"
      }
    ],
    "animationFrames": [
      {
        "title": "Show early squares",
        "narration": "Display 1×1, 2×2, and 3×3 squares.",
        "visualHint": "The square side length increases by 1 each time."
      },
      {
        "title": "Jump to sixth and seventh",
        "narration": "Use 6² and 7² for the sixth and seventh squares.",
        "visualHint": "36 and 49 appear."
      },
      {
        "title": "Subtract",
        "narration": "The seventh needs 13 more tiles.",
        "visualHint": "49−36=13, choice C is highlighted."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "equation": "7^2-6^2=13"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "sequence",
      "area"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-11-square-tiles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-12",
    "title": "2002 AMC 8 Problem 12: Spinner Probability",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 12,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "A board game spinner is divided into three regions labeled A, B and C. The probability of the arrow stopping on region A is 1/3 and on region B is 1/2. The probability of the arrow stopping on region C is",
    "choices": [
      {
        "label": "A",
        "text": "1/12"
      },
      {
        "label": "B",
        "text": "1/6"
      },
      {
        "label": "C",
        "text": "1/5"
      },
      {
        "label": "D",
        "text": "1/3"
      },
      {
        "label": "E",
        "text": "2/5"
      }
    ],
    "answer": "B",
    "shortAnswer": "1/6",
    "solutionSteps": [
      {
        "title": "Use total probability",
        "body": "The spinner must land in A, B, or C, so the probabilities add to 1."
      },
      {
        "title": "Subtract A and B",
        "body": "Find the remaining probability for C.",
        "equation": "1-1/3-1/2 = 1/6"
      },
      {
        "title": "Choose the answer",
        "body": "The probability is 1/6, so the answer is B."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the whole spinner",
        "narration": "The whole probability is 1.",
        "visualHint": "A circle labeled total 1 appears."
      },
      {
        "title": "Remove known parts",
        "narration": "Subtract 1/3 and 1/2.",
        "visualHint": "The leftover sector is labeled 1/6."
      },
      {
        "title": "Circle B",
        "narration": "Region C has probability 1/6.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "equation": "1-1/3-1/2=1/6"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "probability",
      "fractions"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-13",
    "title": "2002 AMC 8 Problem 13: Jellybean Box Volume",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 13,
    "category": "Geometry",
    "subcategory": "Volume scaling",
    "difficulty": 2,
    "statement": "For his birthday, Bert gets a box that holds 125 jellybeans when filled to capacity. A few weeks later, Carrie gets a larger box full of jellybeans. Her box is twice as high, twice as wide and twice as long as Bert's. Approximately, how many jellybeans did Carrie get?",
    "choices": [
      {
        "label": "A",
        "text": "250"
      },
      {
        "label": "B",
        "text": "500"
      },
      {
        "label": "C",
        "text": "625"
      },
      {
        "label": "D",
        "text": "750"
      },
      {
        "label": "E",
        "text": "1000"
      }
    ],
    "answer": "E",
    "shortAnswer": "1000",
    "solutionSteps": [
      {
        "title": "Scale volume",
        "body": "Doubling each dimension multiplies volume by 2×2×2."
      },
      {
        "title": "Find the volume factor",
        "body": "The larger box has 8 times the volume.",
        "equation": "2^3=8"
      },
      {
        "title": "Multiply jellybeans",
        "body": "Carrie's box holds about 8 times as many jellybeans.",
        "equation": "125×8=1000"
      }
    ],
    "animationFrames": [
      {
        "title": "Show the small box",
        "narration": "Bert's box holds 125 jellybeans.",
        "visualHint": "A small box is labeled 125."
      },
      {
        "title": "Double all dimensions",
        "narration": "Height, width, and length each double.",
        "visualHint": "2 × 2 × 2 = 8."
      },
      {
        "title": "Scale capacity",
        "narration": "Multiply 125 by 8.",
        "visualHint": "1000 appears and choice E is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "scale": 2,
        "factor": 8
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "volume",
      "scale factor"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-14",
    "title": "2002 AMC 8 Problem 14: Successive Discounts",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 14,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 2,
    "statement": "A merchant offers a large group of items at 30% off. Later, the merchant takes 20% off these sale prices. The total discount is",
    "choices": [
      {
        "label": "A",
        "text": "35%"
      },
      {
        "label": "B",
        "text": "44%"
      },
      {
        "label": "C",
        "text": "50%"
      },
      {
        "label": "D",
        "text": "56%"
      },
      {
        "label": "E",
        "text": "60%"
      }
    ],
    "answer": "B",
    "shortAnswer": "44%",
    "solutionSteps": [
      {
        "title": "Use a $100 starting price",
        "body": "A 30% discount leaves 70% of the original price.",
        "equation": "100×0.70=70"
      },
      {
        "title": "Apply the second discount",
        "body": "Taking 20% off the sale price leaves 80% of 70 dollars.",
        "equation": "70×0.80=56"
      },
      {
        "title": "Find total discount",
        "body": "A final price of $56 means the total discount is $44 out of $100, or 44%."
      }
    ],
    "animationFrames": [
      {
        "title": "Start at 100",
        "narration": "Use $100 to make percentages easy.",
        "visualHint": "A price tag shows $100."
      },
      {
        "title": "Apply 30% off",
        "narration": "The price becomes $70.",
        "visualHint": "100 × 0.70 = 70."
      },
      {
        "title": "Apply 20% off sale price",
        "narration": "The price becomes $56, so the discount is 44%.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "100(0.70)(0.80)=56"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "percent",
      "discount"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-15",
    "title": "2002 AMC 8 Problem 15: Largest Area Polygon",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 15,
    "category": "Geometry",
    "subcategory": "Area on grids",
    "difficulty": 3,
    "statement": "Which of the following polygons has the largest area?",
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
    "answer": "E",
    "shortAnswer": "E",
    "solutionSteps": [
      {
        "title": "Break into simple pieces",
        "body": "Each polygon is drawn on a dot grid, so count unit squares and half-unit triangles."
      },
      {
        "title": "Compare areas",
        "body": "The areas are A=5, B=5, C=5, D=4.5, and E=5.5 square units."
      },
      {
        "title": "Choose the largest",
        "body": "Polygon E has the largest area, so the answer is E."
      }
    ],
    "animationFrames": [
      {
        "title": "Overlay unit squares",
        "narration": "Show a grid over each polygon.",
        "visualHint": "Unit squares and half-triangles appear."
      },
      {
        "title": "Count area",
        "narration": "Compare the five totals.",
        "visualHint": "A=5, B=5, C=5, D=4.5, E=5.5."
      },
      {
        "title": "Highlight E",
        "narration": "E is largest.",
        "visualHint": "Polygon E is outlined."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "areas": [
          5,
          5,
          5,
          4.5,
          5.5
        ]
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "area",
      "dot grid"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-15-polygons.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-16",
    "title": "2002 AMC 8 Problem 16: Right Isosceles Triangles on a 3-4-5 Triangle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 16,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "Right isosceles triangles are constructed on the sides of a 3-4-5 right triangle, as shown. A capital letter represents the area of each triangle. Which one of the following is true?",
    "choices": [
      {
        "label": "A",
        "text": "X + Z = W + Y"
      },
      {
        "label": "B",
        "text": "W + X = Z"
      },
      {
        "label": "C",
        "text": "3X + 4Y = 5Z"
      },
      {
        "label": "D",
        "text": "X + W = 1/2(Y + Z)"
      },
      {
        "label": "E",
        "text": "X + Y = Z"
      }
    ],
    "answer": "E",
    "shortAnswer": "X + Y = Z",
    "solutionSteps": [
      {
        "title": "Find each area",
        "body": "A right isosceles triangle built on side s has legs s and s, so its area is s²/2."
      },
      {
        "title": "Compute the three outer areas",
        "body": "The areas on sides 3, 4, and 5 are X=9/2, Y=16/2, and Z=25/2."
      },
      {
        "title": "Check the relationship",
        "body": "Since 9/2 + 16/2 = 25/2, we have X + Y = Z."
      }
    ],
    "animationFrames": [
      {
        "title": "Label side lengths",
        "narration": "Show the 3, 4, and 5 sides of the central right triangle.",
        "visualHint": "The sides 3, 4, 5 glow."
      },
      {
        "title": "Use area formula",
        "narration": "Each right isosceles triangle has area side²/2.",
        "visualHint": "X=4.5, Y=8, Z=12.5."
      },
      {
        "title": "Add X and Y",
        "narration": "X plus Y equals Z.",
        "visualHint": "Choice E is highlighted."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "equation": "3^2/2+4^2/2=5^2/2"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "right triangle",
      "area",
      "Pythagorean theorem"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-16-right-isosceles-triangles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-17",
    "title": "2002 AMC 8 Problem 17: Contest Score",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Linear equations",
    "difficulty": 2,
    "statement": "In a mathematics contest with ten problems, a student gains 5 points for a correct answer and loses 2 points for an incorrect answer. If Olivia answered every problem and her score was 29, how many correct answers did she have?",
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
    "answer": "C",
    "shortAnswer": "7",
    "solutionSteps": [
      {
        "title": "Let c be correct answers",
        "body": "Then 10-c answers are incorrect."
      },
      {
        "title": "Write the score equation",
        "body": "Correct answers add 5 points and incorrect answers subtract 2 points.",
        "equation": "5c-2(10-c)=29"
      },
      {
        "title": "Solve",
        "body": "Simplify to 7c-20=29, so c=7."
      }
    ],
    "animationFrames": [
      {
        "title": "Set variables",
        "narration": "Let c count correct answers.",
        "visualHint": "Incorrect answers become 10−c."
      },
      {
        "title": "Build score",
        "narration": "Use 5 points for correct and −2 for incorrect.",
        "visualHint": "5c − 2(10−c) = 29."
      },
      {
        "title": "Solve",
        "narration": "c equals 7.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "5c-2(10-c)=29"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "linear equation",
      "contest scoring"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-18",
    "title": "2002 AMC 8 Problem 18: Skating Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 18,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 3,
    "statement": "Gage skated 1 hr 15 min each day for 5 days and 1 hr 30 min each day for 3 days. How long would he have to skate the ninth day in order to average 85 minutes of skating each day for the entire time?",
    "choices": [
      {
        "label": "A",
        "text": "1 hr"
      },
      {
        "label": "B",
        "text": "1 hr 10 min"
      },
      {
        "label": "C",
        "text": "1 hr 20 min"
      },
      {
        "label": "D",
        "text": "1 hr 40 min"
      },
      {
        "label": "E",
        "text": "2 hr"
      }
    ],
    "answer": "E",
    "shortAnswer": "2 hr",
    "solutionSteps": [
      {
        "title": "Convert to minutes",
        "body": "1 hr 15 min is 75 minutes, and 1 hr 30 min is 90 minutes."
      },
      {
        "title": "Find the needed total",
        "body": "A 9-day average of 85 minutes requires 9×85 minutes total.",
        "equation": "9×85=765"
      },
      {
        "title": "Subtract the first 8 days",
        "body": "The first 8 days total 5×75 + 3×90 = 645 minutes, so the ninth day must be 120 minutes, or 2 hours.",
        "equation": "765-645=120"
      }
    ],
    "animationFrames": [
      {
        "title": "Convert times",
        "narration": "Convert the two daily times to 75 and 90 minutes.",
        "visualHint": "1:15 → 75, 1:30 → 90."
      },
      {
        "title": "Compute target total",
        "narration": "Nine days at 85 minutes each is 765 minutes.",
        "visualHint": "9 × 85 = 765."
      },
      {
        "title": "Find missing day",
        "narration": "Subtract the 645 minutes already skated.",
        "visualHint": "120 minutes = 2 hr, choice E is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "9(85)-5(75)-3(90)=120"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "average",
      "time"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-19",
    "title": "2002 AMC 8 Problem 19: Three-Digit Numbers with One Zero",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 19,
    "category": "Counting & Probability",
    "subcategory": "Counting",
    "difficulty": 3,
    "statement": "How many whole numbers between 99 and 999 contain exactly one 0?",
    "choices": [
      {
        "label": "A",
        "text": "72"
      },
      {
        "label": "B",
        "text": "90"
      },
      {
        "label": "C",
        "text": "144"
      },
      {
        "label": "D",
        "text": "162"
      },
      {
        "label": "E",
        "text": "180"
      }
    ],
    "answer": "D",
    "shortAnswer": "162",
    "solutionSteps": [
      {
        "title": "Consider three-digit forms",
        "body": "The zero can be in the tens place or the ones place, but not the hundreds place."
      },
      {
        "title": "Count each case",
        "body": "For a0b, there are 9 choices for a and 9 for b. For ab0, there are again 9 choices for a and 9 for b.",
        "equation": "9×9 + 9×9"
      },
      {
        "title": "Add",
        "body": "The total is 162, so the answer is D.",
        "equation": "81+81=162"
      }
    ],
    "animationFrames": [
      {
        "title": "Place the zero",
        "narration": "Show the two possible patterns: a0b and ab0.",
        "visualHint": "The middle and last digit positions are highlighted."
      },
      {
        "title": "Count choices",
        "narration": "The nonzero digits each have 9 choices.",
        "visualHint": "9×9 for each pattern."
      },
      {
        "title": "Add cases",
        "narration": "81 plus 81 is 162.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "9×9+9×9=162"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "counting",
      "digits",
      "casework"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-20",
    "title": "2002 AMC 8 Problem 20: Shaded Region in Triangle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 20,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 4,
    "statement": "The area of triangle XYZ is 8 square inches. Points A and B are midpoints of congruent segments XY and XZ. Altitude XC bisects YZ. The area, in square inches, of the shaded region is",
    "choices": [
      {
        "label": "A",
        "text": "1 1/2"
      },
      {
        "label": "B",
        "text": "2"
      },
      {
        "label": "C",
        "text": "2 1/2"
      },
      {
        "label": "D",
        "text": "3"
      },
      {
        "label": "E",
        "text": "3 1/2"
      }
    ],
    "answer": "D",
    "shortAnswer": "3",
    "solutionSteps": [
      {
        "title": "Use symmetry",
        "body": "Since XC bisects the base and is an altitude in the isosceles triangle, the left half of triangle XYZ has area 4."
      },
      {
        "title": "Locate the small top triangle",
        "body": "A is the midpoint of XY, and the horizontal segment meets XC halfway up the altitude. The small triangle above the shaded trapezoid has area 1."
      },
      {
        "title": "Subtract",
        "body": "The shaded trapezoid is the left half area minus the small top triangle.",
        "equation": "4-1=3"
      }
    ],
    "animationFrames": [
      {
        "title": "Split the big triangle",
        "narration": "Use altitude XC to divide triangle XYZ into two equal areas.",
        "visualHint": "Each half has area 4."
      },
      {
        "title": "Remove the small top triangle",
        "narration": "The small triangle XAD has area 1.",
        "visualHint": "The small top triangle is unshaded."
      },
      {
        "title": "Compute shaded area",
        "narration": "The shaded region has area 3.",
        "visualHint": "4 − 1 = 3, choice D is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "equation": "4-1=3"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "area",
      "midpoints",
      "similar triangles"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-20-shaded-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-21",
    "title": "2002 AMC 8 Problem 21: At Least as Many Heads as Tails",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 21,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "Harold tosses a coin four times. The probability that he gets at least as many heads as tails is",
    "choices": [
      {
        "label": "A",
        "text": "5/16"
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
        "text": "5/8"
      },
      {
        "label": "E",
        "text": "11/16"
      }
    ],
    "answer": "E",
    "shortAnswer": "11/16",
    "solutionSteps": [
      {
        "title": "List favorable head counts",
        "body": "At least as many heads as tails in 4 tosses means 2, 3, or 4 heads."
      },
      {
        "title": "Count favorable outcomes",
        "body": "There are C(4,2)=6 ways for 2 heads, C(4,3)=4 ways for 3 heads, and 1 way for 4 heads.",
        "equation": "6+4+1=11"
      },
      {
        "title": "Divide by all outcomes",
        "body": "There are 2^4=16 total outcomes, so the probability is 11/16."
      }
    ],
    "animationFrames": [
      {
        "title": "Show four coin slots",
        "narration": "There are sixteen possible outcomes for four coin tosses.",
        "visualHint": "2^4 = 16 appears."
      },
      {
        "title": "Count favorable cases",
        "narration": "Use 2, 3, or 4 heads.",
        "visualHint": "6 + 4 + 1 = 11."
      },
      {
        "title": "Form probability",
        "narration": "The probability is 11/16.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "equation": "(6+4+1)/16=11/16"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "probability",
      "coin flips",
      "combinations"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-22",
    "title": "2002 AMC 8 Problem 22: Surface Area of Six Cubes",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 22,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 3,
    "statement": "Six cubes, each an inch on an edge, are fastened together, as shown. Find the total surface area in square inches. Include the top, bottom, and sides.",
    "choices": [
      {
        "label": "A",
        "text": "18"
      },
      {
        "label": "B",
        "text": "24"
      },
      {
        "label": "C",
        "text": "26"
      },
      {
        "label": "D",
        "text": "30"
      },
      {
        "label": "E",
        "text": "36"
      }
    ],
    "answer": "C",
    "shortAnswer": "26",
    "solutionSteps": [
      {
        "title": "Start with separate cubes",
        "body": "Six separate unit cubes would have 6×6 = 36 exposed faces."
      },
      {
        "title": "Subtract hidden faces",
        "body": "Each shared face hides 2 faces. The figure has 5 cube-to-cube joins, so 10 faces are hidden."
      },
      {
        "title": "Compute surface area",
        "body": "The surface area is 36 − 10 = 26 square inches."
      }
    ],
    "animationFrames": [
      {
        "title": "Count all cube faces",
        "narration": "Six cubes have 36 faces before being attached.",
        "visualHint": "6 × 6 = 36."
      },
      {
        "title": "Find shared faces",
        "narration": "Five attachments hide two faces each.",
        "visualHint": "5 × 2 = 10 hidden faces."
      },
      {
        "title": "Subtract",
        "narration": "The exposed surface area is 26.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "equation": "6×6-5×2=26"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "surface area",
      "cubes"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-22-cubes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-23",
    "title": "2002 AMC 8 Problem 23: Fraction of Darker Floor Tiles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Area fraction",
    "difficulty": 4,
    "statement": "A corner of a tiled floor is shown. If the entire floor is tiled in this way and each of the four corners looks like this one, then what fraction of the tiled floor is made of darker tiles?",
    "choices": [
      {
        "label": "A",
        "text": "1/3"
      },
      {
        "label": "B",
        "text": "4/9"
      },
      {
        "label": "C",
        "text": "1/2"
      },
      {
        "label": "D",
        "text": "5/9"
      },
      {
        "label": "E",
        "text": "5/8"
      }
    ],
    "answer": "B",
    "shortAnswer": "4/9",
    "solutionSteps": [
      {
        "title": "Find the repeating unit",
        "body": "The pattern repeats in 6 by 6 blocks, and the symmetry lets us inspect a 3 by 3 square."
      },
      {
        "title": "Count dark tiles",
        "body": "In the 3 by 3 unit, 4 of the 9 equal small tiles are dark."
      },
      {
        "title": "Write the fraction",
        "body": "Therefore the fraction of the whole floor that is dark is 4/9."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the tile pattern",
        "narration": "Display the repeating floor pattern.",
        "visualHint": "A 6×6 repeat block is outlined."
      },
      {
        "title": "Zoom into a 3×3 block",
        "narration": "Symmetry reduces the count to a 3×3 square.",
        "visualHint": "Four shaded tiles are counted out of nine."
      },
      {
        "title": "Form the fraction",
        "narration": "The dark fraction is four ninths.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "equation": "4/9"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "geometry",
      "area fraction",
      "tiling"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2002/problem-23-tiled-floor.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2002-24",
    "title": "2002 AMC 8 Problem 24: Pear-Orange Juice Blend",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 24,
    "category": "Algebra",
    "subcategory": "Rates and percent",
    "difficulty": 3,
    "statement": "Miki has a dozen oranges of the same size and a dozen pears of the same size. Miki uses her juicer to extract 8 ounces of pear juice from 3 pears and 8 ounces of orange juice from 2 oranges. She makes a pear-orange juice blend from an equal number of pears and oranges. What percent of the blend is pear juice?",
    "choices": [
      {
        "label": "A",
        "text": "30"
      },
      {
        "label": "B",
        "text": "40"
      },
      {
        "label": "C",
        "text": "50"
      },
      {
        "label": "D",
        "text": "60"
      },
      {
        "label": "E",
        "text": "70"
      }
    ],
    "answer": "B",
    "shortAnswer": "40%",
    "solutionSteps": [
      {
        "title": "Find juice per fruit",
        "body": "Each pear gives 8/3 ounces, and each orange gives 8/2 = 4 ounces."
      },
      {
        "title": "Use one pear and one orange",
        "body": "Equal numbers of pears and oranges means the percentage is the same as for one of each."
      },
      {
        "title": "Compute the pear fraction",
        "body": "Pear juice is (8/3)/(8/3+4) = 8/(8+12) = 8/20 = 40%."
      }
    ],
    "animationFrames": [
      {
        "title": "Compare one fruit each",
        "narration": "Use one pear and one orange because the blend uses equal counts.",
        "visualHint": "Pear: 8/3 oz, orange: 4 oz."
      },
      {
        "title": "Make a fraction",
        "narration": "Pear juice over total juice gives the percent.",
        "visualHint": "(8/3)/(8/3+4)."
      },
      {
        "title": "Simplify",
        "narration": "The pear part is 40 percent.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "(8/3)/(8/3+4)=0.40"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "rates",
      "percent"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2002-25",
    "title": "2002 AMC 8 Problem 25: Ott's Share of Group Money",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2002,
    "problemNumber": 25,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 4,
    "statement": "Loki, Moe, Nick and Ott are good friends. Ott had no money, but the others did. Moe gave Ott one-fifth of his money, Loki gave Ott one-fourth of his money and Nick gave Ott one-third of his money. Each gave Ott the same amount of money. What fractional part of the group's money does Ott now have?",
    "choices": [
      {
        "label": "A",
        "text": "1/10"
      },
      {
        "label": "B",
        "text": "1/4"
      },
      {
        "label": "C",
        "text": "1/3"
      },
      {
        "label": "D",
        "text": "2/5"
      },
      {
        "label": "E",
        "text": "1/2"
      }
    ],
    "answer": "B",
    "shortAnswer": "1/4",
    "solutionSteps": [
      {
        "title": "Let each gift be x",
        "body": "If each friend gives Ott x dollars, then Moe had 5x, Loki had 4x, and Nick had 3x originally."
      },
      {
        "title": "Find the group total",
        "body": "The group's total money is 5x + 4x + 3x = 12x."
      },
      {
        "title": "Find Ott's share",
        "body": "Ott receives x from each of three friends, so he has 3x. His share is 3x/12x = 1/4."
      }
    ],
    "animationFrames": [
      {
        "title": "Equal gifts",
        "narration": "Represent each amount given to Ott as x.",
        "visualHint": "Moe, Loki, and Nick each give x."
      },
      {
        "title": "Work backward",
        "narration": "Their original amounts were 5x, 4x, and 3x.",
        "visualHint": "The total is 12x."
      },
      {
        "title": "Compute Ott's part",
        "narration": "Ott now has 3x out of 12x.",
        "visualHint": "3/12 = 1/4, choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "equation": "3x/(5x+4x+3x)=1/4"
      }
    },
    "tags": [
      "AMC 8",
      "2002",
      "algebra",
      "fractions",
      "ratios"
    ],
    "sourceName": "2002 AMC 8",
    "license": "CC BY-NC-SA"
  }
];

const amc2003Problems: Problem[] = [
  {
    "id": "amc8-2003-01",
    "title": "2003 AMC 8 Problem 1: Cube Counts",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 1,
    "category": "Geometry",
    "subcategory": "Solid geometry",
    "difficulty": 1,
    "statement": "Jamie counted the number of edges of a cube, Jimmy counted the number of corners, and Judy counted the number of faces. They then added the three numbers. What was the resulting sum?",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "16"
      },
      {
        "label": "C",
        "text": "20"
      },
      {
        "label": "D",
        "text": "22"
      },
      {
        "label": "E",
        "text": "26"
      }
    ],
    "answer": "E",
    "shortAnswer": "26",
    "solutionSteps": [
      {
        "title": "Count edges, corners, and faces",
        "body": "A cube has 12 edges, 8 corners, and 6 faces."
      },
      {
        "title": "Add them",
        "body": "Add the three counts.",
        "equation": "12+8+6=26"
      },
      {
        "title": "Choose the result",
        "body": "The sum is 26, so the answer is E."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "solid geometry"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-02",
    "title": "2003 AMC 8 Problem 2: Smallest Prime Factor",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 2,
    "category": "Number Theory",
    "subcategory": "Prime factors",
    "difficulty": 1,
    "statement": "Which of the following numbers has the smallest prime factor?",
    "choices": [
      {
        "label": "A",
        "text": "55"
      },
      {
        "label": "B",
        "text": "57"
      },
      {
        "label": "C",
        "text": "58"
      },
      {
        "label": "D",
        "text": "59"
      },
      {
        "label": "E",
        "text": "61"
      }
    ],
    "answer": "C",
    "shortAnswer": "58",
    "solutionSteps": [
      {
        "title": "Look for factor 2",
        "body": "The smallest prime number is 2, so any even choice has the smallest possible prime factor."
      },
      {
        "title": "Find the even number",
        "body": "Among the choices, only 58 is even."
      },
      {
        "title": "Conclude",
        "body": "Therefore 58 has the smallest prime factor, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "number theory",
      "prime factors",
      "prime"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-03",
    "title": "2003 AMC 8 Problem 3: Burger Without Filler",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 1,
    "statement": "A burger at Ricky C's weighs 120 grams, of which 30 grams are filler. What percent of the burger is not filler?",
    "choices": [
      {
        "label": "A",
        "text": "60%"
      },
      {
        "label": "B",
        "text": "65%"
      },
      {
        "label": "C",
        "text": "70%"
      },
      {
        "label": "D",
        "text": "75%"
      },
      {
        "label": "E",
        "text": "90%"
      }
    ],
    "answer": "D",
    "shortAnswer": "75%",
    "solutionSteps": [
      {
        "title": "Find the non-filler mass",
        "body": "Subtract the filler from the total mass.",
        "equation": "120-30=90"
      },
      {
        "title": "Convert to a percent",
        "body": "The non-filler part is 90 out of 120 grams.",
        "equation": "90/120=3/4=75%"
      },
      {
        "title": "Choose the answer",
        "body": "The answer is 75%, choice D."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "algebra",
      "percent",
      "percent"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-04",
    "title": "2003 AMC 8 Problem 4: Bicycles and Tricycles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Systems of equations",
    "difficulty": 2,
    "statement": "A group of children riding on bicycles and tricycles rode past Billy Bob's house. Billy Bob counted 7 children and 19 wheels. How many tricycles were there?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "7"
      }
    ],
    "answer": "C",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Set up variables",
        "body": "Let b be bicycles and t be tricycles. There are 7 riders total.",
        "equation": "b+t=7"
      },
      {
        "title": "Count wheels",
        "body": "Bicycles have 2 wheels and tricycles have 3 wheels.",
        "equation": "2b+3t=19"
      },
      {
        "title": "Solve",
        "body": "Subtract 2(b+t)=14 from the wheel equation to get t=5.",
        "equation": "2b+3t-(2b+2t)=19-14=5"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "algebra",
      "systems of equations"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-05",
    "title": "2003 AMC 8 Problem 5: Two Percents of a Number",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 1,
    "statement": "If 20% of a number is 12, what is 30% of the same number?",
    "choices": [
      {
        "label": "A",
        "text": "15"
      },
      {
        "label": "B",
        "text": "18"
      },
      {
        "label": "C",
        "text": "20"
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
    "answer": "B",
    "shortAnswer": "18",
    "solutionSteps": [
      {
        "title": "Find the whole number",
        "body": "If 20% is 12, then the whole number is five times as large.",
        "equation": "12÷5=60"
      },
      {
        "title": "Find 30%",
        "body": "30% of 60 is 18.",
        "equation": "0.30×60=18"
      },
      {
        "title": "Choose the answer",
        "body": "The answer is 18, choice B."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "algebra",
      "percent",
      "percent"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-06",
    "title": "2003 AMC 8 Problem 6: Squares Around a Triangle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "Given the areas of the three squares in the figure, what is the area of the interior triangle?",
    "choices": [
      {
        "label": "A",
        "text": "13"
      },
      {
        "label": "B",
        "text": "30"
      },
      {
        "label": "C",
        "text": "60"
      },
      {
        "label": "D",
        "text": "300"
      },
      {
        "label": "E",
        "text": "1800"
      }
    ],
    "answer": "B",
    "shortAnswer": "30",
    "solutionSteps": [
      {
        "title": "Turn square areas into side lengths",
        "body": "The side lengths of the squares are the square roots of 25, 144, and 169: 5, 12, and 13."
      },
      {
        "title": "Identify the triangle legs",
        "body": "The interior triangle has legs 5 and 12; the 13-side square confirms a 5-12-13 right triangle."
      },
      {
        "title": "Find the area",
        "body": "Use one-half base times height.",
        "equation": "(1/2)(5)(12)=30"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "area"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-06-squares-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-07",
    "title": "2003 AMC 8 Problem 7: Jenny's Test Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 2,
    "statement": "Blake and Jenny each took four 100-point tests. Blake averaged 78 on the four tests. Jenny scored 10 points higher than Blake on the first test, 10 points lower than him on the second test, and 20 points higher on both the third and fourth tests. What is the difference between Jenny's average and Blake's average on these four tests?",
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
        "text": "20"
      },
      {
        "label": "D",
        "text": "25"
      },
      {
        "label": "E",
        "text": "40"
      }
    ],
    "answer": "A",
    "shortAnswer": "10",
    "solutionSteps": [
      {
        "title": "Add Jenny's differences",
        "body": "Compared with Blake, Jenny's total score changes by +10, -10, +20, and +20.",
        "equation": "10-10+20+20=40"
      },
      {
        "title": "Convert total change to average change",
        "body": "The 40 extra points are spread over 4 tests.",
        "equation": "40÷4=10"
      },
      {
        "title": "Conclude",
        "body": "Jenny's average is 10 points higher, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "algebra",
      "averages"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-08",
    "title": "2003 AMC 8 Problem 8: Fewest Cookies",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "Problems 8, 9 and 10 use the same cookie-shape data. Four friends, Art, Roger, Paul and Trisha, bake cookies of the same thickness. Art's cookies are trapezoids, Roger's are rectangles, Paul's are parallelograms, and Trisha's are triangles, as shown. Each friend uses the same amount of dough, and Art makes exactly 12 cookies. Who gets the fewest cookies from one batch of cookie dough?",
    "choices": [
      {
        "label": "A",
        "text": "Art"
      },
      {
        "label": "B",
        "text": "Roger"
      },
      {
        "label": "C",
        "text": "Paul"
      },
      {
        "label": "D",
        "text": "Trisha"
      },
      {
        "label": "E",
        "text": "There is a tie for fewest."
      }
    ],
    "answer": "A",
    "shortAnswer": "Art",
    "solutionSteps": [
      {
        "title": "Compare areas",
        "body": "Art's trapezoid has area (3+5)/2 times 3 = 12 square inches. Roger's rectangle has area 8, and Paul and Trisha each have area 6."
      },
      {
        "title": "Connect area to number of cookies",
        "body": "With the same amount of dough, larger cookies mean fewer cookies."
      },
      {
        "title": "Choose the largest cookie",
        "body": "Art's cookie is largest, so Art gets the fewest cookies."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "area"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-08-10-cookie-shapes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-09",
    "title": "2003 AMC 8 Problem 9: Cookie Price",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 9,
    "category": "Geometry",
    "subcategory": "Area and proportional reasoning",
    "difficulty": 3,
    "statement": "Problems 8, 9 and 10 use the same cookie-shape data. Four friends, Art, Roger, Paul and Trisha, bake cookies of the same thickness. Art's cookies are trapezoids, Roger's are rectangles, Paul's are parallelograms, and Trisha's are triangles, as shown. Each friend uses the same amount of dough, and Art makes exactly 12 cookies. Art's cookies sell for 60 cents each. To earn the same amount from a single batch, how much should one of Roger's cookies cost in cents?",
    "choices": [
      {
        "label": "A",
        "text": "18"
      },
      {
        "label": "B",
        "text": "25"
      },
      {
        "label": "C",
        "text": "40"
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
    "shortAnswer": "40",
    "solutionSteps": [
      {
        "title": "Find the batch area",
        "body": "Art's cookie area is 12 square inches and he makes 12 cookies, so each batch uses 144 square inches of dough.",
        "equation": "12×12=144"
      },
      {
        "title": "Find Roger's cookie count",
        "body": "Roger's rectangle area is 4 by 2, or 8 square inches. He makes 144/8=18 cookies."
      },
      {
        "title": "Match the revenue",
        "body": "Art earns 12×60=720 cents. Roger needs 720/18=40 cents per cookie."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "area and proportional reasoning"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-08-10-cookie-shapes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-10",
    "title": "2003 AMC 8 Problem 10: Trisha's Cookie Count",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 10,
    "category": "Geometry",
    "subcategory": "Area and proportional reasoning",
    "difficulty": 2,
    "statement": "Problems 8, 9 and 10 use the same cookie-shape data. Four friends, Art, Roger, Paul and Trisha, bake cookies of the same thickness. Art's cookies are trapezoids, Roger's are rectangles, Paul's are parallelograms, and Trisha's are triangles, as shown. How many cookies will be in one batch of Trisha's cookies?",
    "choices": [
      {
        "label": "A",
        "text": "10"
      },
      {
        "label": "B",
        "text": "12"
      },
      {
        "label": "C",
        "text": "16"
      },
      {
        "label": "D",
        "text": "18"
      },
      {
        "label": "E",
        "text": "24"
      }
    ],
    "answer": "E",
    "shortAnswer": "24",
    "solutionSteps": [
      {
        "title": "Use Art's batch area",
        "body": "Art makes 12 cookies of area 12, so the batch area is 144 square inches."
      },
      {
        "title": "Find Trisha's cookie area",
        "body": "Trisha's triangle has base 3 and height 4.",
        "equation": "(1/2)(3)(4)=6"
      },
      {
        "title": "Divide dough by cookie area",
        "body": "Trisha makes 144/6=24 cookies."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "area and proportional reasoning"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-08-10-cookie-shapes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-11",
    "title": "2003 AMC 8 Problem 11: Sale After Markup",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 2,
    "statement": "Business is a little slow at Lou's Fine Shoes, so Lou decides to have a sale. On Friday, Lou increases all of Thursday's prices by 10 percent. Over the weekend, Lou advertises the sale: \"Ten percent off the listed price. Sale starts Monday.\" How much does a pair of shoes cost on Monday that cost 40 dollars on Thursday?",
    "choices": [
      {
        "label": "A",
        "text": "36"
      },
      {
        "label": "B",
        "text": "39.60"
      },
      {
        "label": "C",
        "text": "40"
      },
      {
        "label": "D",
        "text": "40.40"
      },
      {
        "label": "E",
        "text": "44"
      }
    ],
    "answer": "B",
    "shortAnswer": "$39.60",
    "solutionSteps": [
      {
        "title": "Increase by 10%",
        "body": "A $40 price becomes 110% of $40.",
        "equation": "40×1.10=44"
      },
      {
        "title": "Take 10% off the new price",
        "body": "The sale price is 90% of $44.",
        "equation": "44×0.90=39.60"
      },
      {
        "title": "Conclude",
        "body": "The Monday price is $39.60, choice B."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "algebra",
      "percent",
      "discount"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-12",
    "title": "2003 AMC 8 Problem 12: Visible Dice Faces",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 12,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "When a fair six-sided die is tossed on a table top, the bottom face cannot be seen. What is the probability that the product of the faces that can be seen is divisible by 6?",
    "choices": [
      {
        "label": "A",
        "text": "1/3"
      },
      {
        "label": "B",
        "text": "1/2"
      },
      {
        "label": "C",
        "text": "2/3"
      },
      {
        "label": "D",
        "text": "5/6"
      },
      {
        "label": "E",
        "text": "1"
      }
    ],
    "answer": "E",
    "shortAnswer": "1",
    "solutionSteps": [
      {
        "title": "Think about the hidden face",
        "body": "The visible product is the product of five of the six numbers 1 through 6."
      },
      {
        "title": "Check divisibility by 6",
        "body": "A product divisible by 6 needs factors 2 and 3. No matter which one face is hidden, the visible faces still include enough factors to make 6."
      },
      {
        "title": "Probability",
        "body": "Every possible hidden face works, so the probability is 1."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "counting & probability",
      "probability"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-13",
    "title": "2003 AMC 8 Problem 13: Painted Cubes",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 13,
    "category": "Geometry",
    "subcategory": "Solid geometry",
    "difficulty": 3,
    "statement": "Fourteen white cubes are put together to form the figure shown. The complete surface of the figure, including the bottom, is painted red. The figure is then separated into individual cubes. How many of the individual cubes have exactly four red faces?",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "8"
      },
      {
        "label": "D",
        "text": "10"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "B",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Translate red faces to hidden faces",
        "body": "A cube has exactly four red faces if exactly two of its faces were touching other cubes."
      },
      {
        "title": "Inspect the structure",
        "body": "The cubes in the middle positions touch exactly two neighboring cubes."
      },
      {
        "title": "Count them",
        "body": "There are 6 such cubes, so the answer is B."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "solid geometry"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-13-cubes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-14",
    "title": "2003 AMC 8 Problem 14: TWO + TWO = FOUR",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 14,
    "category": "Logic",
    "subcategory": "Cryptarithm",
    "difficulty": 4,
    "statement": "In this addition problem, each letter stands for a different digit: TWO + TWO = FOUR. If T = 7 and the letter O represents an even number, what is the only possible value for W?",
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
        "text": "3"
      },
      {
        "label": "E",
        "text": "4"
      }
    ],
    "answer": "D",
    "shortAnswer": "3",
    "solutionSteps": [
      {
        "title": "Ones column",
        "body": "Since T=7, the thousands digit F must come from the carry. The solution starts by forcing O=4 because 7+7 gives a carry pattern ending in 4 in the sum."
      },
      {
        "title": "Use the O column",
        "body": "With O=4, the ones digit R is 8."
      },
      {
        "title": "Test possible W values",
        "body": "W must be less than 5 and cannot repeat a used digit. The only possible value that keeps all letters different and the addition valid is W=3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "logic",
      "cryptarithm"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-14-cryptarithm.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-15",
    "title": "2003 AMC 8 Problem 15: Minimum Cubes from Views",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 15,
    "category": "Geometry",
    "subcategory": "Solid geometry",
    "difficulty": 3,
    "statement": "A figure is constructed from unit cubes. Each cube shares at least one face with another cube. What is the minimum number of cubes needed to build a figure with the front and side views shown?",
    "choices": [
      {
        "label": "A",
        "text": "3"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "7"
      }
    ],
    "answer": "B",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Use the views as constraints",
        "body": "The front view requires two stacked cubes in one column and one cube beside the lower cube."
      },
      {
        "title": "Match cubes across views",
        "body": "The side view has the same L-shape, so some cubes can satisfy both views at once."
      },
      {
        "title": "Minimum construction",
        "body": "A 4-cube arrangement can produce both views, and fewer cannot satisfy the height and width requirements."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "solid geometry"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-15-front-side.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-16",
    "title": "2003 AMC 8 Problem 16: Theme Park Seating",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 16,
    "category": "Counting & Probability",
    "subcategory": "Counting",
    "difficulty": 2,
    "statement": "Ali, Bonnie, Carlo, and Dianna are going to drive together to a nearby theme park. The car they are using has 4 seats: 1 driver seat, 1 front passenger seat, and 2 back passenger seats. Bonnie and Carlo are the only ones who know how to drive the car. How many possible seating arrangements are there?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "12"
      },
      {
        "label": "E",
        "text": "24"
      }
    ],
    "answer": "D",
    "shortAnswer": "12",
    "solutionSteps": [
      {
        "title": "Choose the driver",
        "body": "Only Bonnie or Carlo can drive, giving 2 choices."
      },
      {
        "title": "Arrange the other seats",
        "body": "After the driver is chosen, the remaining 3 people can fill the passenger seats in 3×2×1 ways."
      },
      {
        "title": "Multiply",
        "body": "The total is 2×3×2=12 arrangements."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "counting & probability",
      "counting"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-17",
    "title": "2003 AMC 8 Problem 17: Jim's Siblings",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 17,
    "category": "Logic",
    "subcategory": "Table reasoning",
    "difficulty": 3,
    "statement": "The six children listed in the table are from two families of three siblings each. Each child has blue or brown eyes and black or blond hair. Children from the same family have at least one of these characteristics in common. Which two children are Jim's siblings?",
    "choices": [
      {
        "label": "A",
        "text": "Nadeen and Austin"
      },
      {
        "label": "B",
        "text": "Benjamin and Sue"
      },
      {
        "label": "C",
        "text": "Benjamin and Austin"
      },
      {
        "label": "D",
        "text": "Nadeen and Tevyn"
      },
      {
        "label": "E",
        "text": "Austin and Sue"
      }
    ],
    "answer": "E",
    "shortAnswer": "Austin and Sue",
    "solutionSteps": [
      {
        "title": "List Jim's possible siblings",
        "body": "Jim has brown eyes and blond hair, so a sibling must share brown eyes or blond hair with him."
      },
      {
        "title": "Check groups of three",
        "body": "Austin and Sue both share blond hair with Jim, and they also share a characteristic with each other."
      },
      {
        "title": "Conclude",
        "body": "Jim's siblings are Austin and Sue, choice E."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "logic",
      "table reasoning"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-17-sibling-table.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-18",
    "title": "2003 AMC 8 Problem 18: Sarah's Party Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 18,
    "category": "Logic",
    "subcategory": "Graphs",
    "difficulty": 4,
    "statement": "Each of the twenty dots on the graph represents one of Sarah's classmates. Classmates who are friends are connected with a line segment. For her birthday party, Sarah is inviting all of her friends and all of those classmates who are friends with at least one of her friends. How many classmates will not be invited to Sarah's party?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "7"
      }
    ],
    "answer": "D",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Invite direct friends",
        "body": "Start with every dot connected directly to Sarah."
      },
      {
        "title": "Invite friends of friends",
        "body": "Then include every dot connected to one of Sarah's friends."
      },
      {
        "title": "Count the leftovers",
        "body": "The remaining uninvited classmates are the isolated dot, a small separate group of three, and two dots too far away in the graph, for a total of 6."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "logic",
      "graphs"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-18-friendship-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-19",
    "title": "2003 AMC 8 Problem 19: Common Multiples",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 19,
    "category": "Number Theory",
    "subcategory": "LCM",
    "difficulty": 3,
    "statement": "How many integers between 1000 and 2000 have all three of the numbers 15, 20, and 25 as factors?",
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
    "answer": "C",
    "shortAnswer": "3",
    "solutionSteps": [
      {
        "title": "Find the LCM",
        "body": "A number divisible by 15, 20, and 25 must be divisible by their least common multiple.",
        "equation": "15=3×5, 20=2^2×5, 25=5^2"
      },
      {
        "title": "Compute the LCM",
        "body": "Use the largest powers of each prime.",
        "equation": "LCM=2^2×3×5^2=300"
      },
      {
        "title": "Count multiples",
        "body": "The multiples of 300 between 1000 and 2000 are 1200, 1500, and 1800."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "number theory",
      "lcm"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-20",
    "title": "2003 AMC 8 Problem 20: Clock Angle at 4:20",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 20,
    "category": "Geometry",
    "subcategory": "Clock angles",
    "difficulty": 3,
    "statement": "What is the measure of the acute angle formed by the hands of the clock at 4:20 PM?",
    "choices": [
      {
        "label": "A",
        "text": "0"
      },
      {
        "label": "B",
        "text": "5"
      },
      {
        "label": "C",
        "text": "8"
      },
      {
        "label": "D",
        "text": "10"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "10°",
    "solutionSteps": [
      {
        "title": "Place the minute hand",
        "body": "At 20 minutes, the minute hand points exactly at the 4."
      },
      {
        "title": "Move the hour hand",
        "body": "At 4:20, the hour hand has moved one-third of the way from 4 to 5."
      },
      {
        "title": "Find the angle",
        "body": "One hour mark is 30°, so one-third of that is 10°."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "clock-angle",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "clock angles"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2003-21",
    "title": "2003 AMC 8 Problem 21: Trapezoid Side Length",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 21,
    "category": "Geometry",
    "subcategory": "Trapezoids",
    "difficulty": 4,
    "statement": "The area of trapezoid ABCD is 164 square centimeters. The altitude is 8 cm, AB is 10 cm, and CD is 17 cm. What is BC, in centimeters?",
    "choices": [
      {
        "label": "A",
        "text": "9"
      },
      {
        "label": "B",
        "text": "10"
      },
      {
        "label": "C",
        "text": "12"
      },
      {
        "label": "D",
        "text": "15"
      },
      {
        "label": "E",
        "text": "20"
      }
    ],
    "answer": "B",
    "shortAnswer": "10",
    "solutionSteps": [
      {
        "title": "Use trapezoid area",
        "body": "The area formula gives the sum of the bases.",
        "equation": "164=8(BC+AD)/2, so BC+AD=41"
      },
      {
        "title": "Find horizontal offsets",
        "body": "With height 8, side AB=10 gives a 6-unit horizontal offset, and side CD=17 gives a 15-unit offset."
      },
      {
        "title": "Relate the bases",
        "body": "Therefore AD = BC + 6 + 15 = BC + 21. So BC + AD = BC + BC + 21 = 41, giving BC=10."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "trapezoids"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-21-trapezoid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-22",
    "title": "2003 AMC 8 Problem 22: Largest Shaded Region",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 22,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 4,
    "statement": "The figures are composed of squares and circles. Which figure has a shaded region with largest area?",
    "choices": [
      {
        "label": "A",
        "text": "A only"
      },
      {
        "label": "B",
        "text": "B only"
      },
      {
        "label": "C",
        "text": "C only"
      },
      {
        "label": "D",
        "text": "both A and B"
      },
      {
        "label": "E",
        "text": "all are equal"
      }
    ],
    "answer": "C",
    "shortAnswer": "C only",
    "solutionSteps": [
      {
        "title": "Figures A and B",
        "body": "In both A and B, the shaded area is the square area minus the total circle area, which is 4-π."
      },
      {
        "title": "Figure C",
        "body": "The circle has radius 1, so its area is π. The inscribed square has diagonal 2 and area 2."
      },
      {
        "title": "Compare",
        "body": "Figure C has shaded area π-2, which is larger than 4-π, so C is largest."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "area"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-22-shaded-regions.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-23",
    "title": "2003 AMC 8 Problem 23: Cat and Mouse Pattern",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 23,
    "category": "Number Theory",
    "subcategory": "Cycles",
    "difficulty": 3,
    "statement": "In the pattern, the cat moves clockwise through the four squares, and the mouse moves counterclockwise through the eight exterior segments of the four squares. If the pattern is continued, where would the cat and mouse be after the 247th move?",
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
    "answer": "A",
    "shortAnswer": "A",
    "solutionSteps": [
      {
        "title": "Cat cycle",
        "body": "The cat repeats every 4 moves. Since 247 leaves remainder 3 when divided by 4, the cat is in the same square as after move 3."
      },
      {
        "title": "Mouse cycle",
        "body": "The mouse repeats every 8 moves. Since 247 leaves remainder 7 when divided by 8, the mouse is in the same position as after move 7."
      },
      {
        "title": "Match the picture",
        "body": "That combination matches choice A."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "number theory",
      "cycles"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-23-cat-mouse-pattern.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-24",
    "title": "2003 AMC 8 Problem 24: Ship Distance Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 24,
    "category": "Algebra",
    "subcategory": "Graphs",
    "difficulty": 4,
    "statement": "A ship travels from point A to point B along a semicircular path, centered at Island X. Then it travels along a straight path from B to C. Which graph best shows the ship's distance from Island X as it moves along its course?",
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
        "title": "Semicircle part",
        "body": "Every point on the semicircle is the same distance from X, so the graph starts horizontal."
      },
      {
        "title": "Straight-line part",
        "body": "Along segment BC, the distance to X first decreases until the closest point, then increases."
      },
      {
        "title": "Match the graph",
        "body": "The graph with a horizontal start followed by a curved dip is choice B."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "algebra",
      "graphs"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-24-ship-distance-graphs.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2003-25",
    "title": "2003 AMC 8 Problem 25: Folded Triangle Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2003,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 5,
    "statement": "In the figure, the area of square WXYZ is 25 square centimeters. The four smaller squares have sides 1 cm long. In triangle ABC, AB = AC, and when triangle ABC is folded over side BC, point A coincides with O, the center of square WXYZ. What is the area of triangle ABC, in square centimeters?",
    "choices": [
      {
        "label": "A",
        "text": "15/4"
      },
      {
        "label": "B",
        "text": "21/4"
      },
      {
        "label": "C",
        "text": "27/4"
      },
      {
        "label": "D",
        "text": "21/2"
      },
      {
        "label": "E",
        "text": "27/2"
      }
    ],
    "answer": "C",
    "shortAnswer": "27/4",
    "solutionSteps": [
      {
        "title": "Find BC",
        "body": "Since the large square has area 25, its side length is 5. The points B and C are each 1 cm from the top and bottom, so BC=5-1-1=3."
      },
      {
        "title": "Find the altitude",
        "body": "Folding sends A to the center O, so the altitude from A to BC equals the distance from BC to O. That distance is 1+1+5/2=9/2."
      },
      {
        "title": "Compute area",
        "body": "Use one-half base times height.",
        "equation": "(1/2)(3)(9/2)=27/4"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the key quantities and what is being asked.",
        "visualHint": "Important numbers are highlighted."
      },
      {
        "title": "Compute",
        "narration": "Use the relationship from the problem to calculate the answer.",
        "visualHint": "The calculation is shown step by step."
      },
      {
        "title": "Choose",
        "narration": "Match the result to the answer choices.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2003",
      "geometry",
      "area"
    ],
    "sourceName": "2003 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2003/problem-25-folded-triangle.svg"
    ],
    "needsDiagram": true
  }
];

const amc2004Problems: Problem[] = [
  {
    "id": "amc8-2004-01",
    "title": "2004 AMC 8 Problem 1: Map Scale",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Proportions",
    "difficulty": 1,
    "statement": "On a map, a 12-centimeter length represents 72 kilometers. How many kilometers does a 17-centimeter length represent?",
    "choices": [
      {
        "label": "A",
        "text": "6"
      },
      {
        "label": "B",
        "text": "102"
      },
      {
        "label": "C",
        "text": "204"
      },
      {
        "label": "D",
        "text": "864"
      },
      {
        "label": "E",
        "text": "1224"
      }
    ],
    "answer": "B",
    "shortAnswer": "102",
    "solutionSteps": [
      {
        "title": "Find the scale",
        "body": "Divide the real distance by the map distance to find kilometers per centimeter.",
        "equation": "72 ÷ 12 = 6"
      },
      {
        "title": "Scale 17 centimeters",
        "body": "Each centimeter represents 6 kilometers.",
        "equation": "17 × 6 = 102"
      },
      {
        "title": "Conclude",
        "body": "A 17-centimeter length represents 102 kilometers."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "proportions"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-02",
    "title": "2004 AMC 8 Problem 2: Rearranging 2004",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 2,
    "category": "Counting & Probability",
    "subcategory": "Counting",
    "difficulty": 1,
    "statement": "How many different four-digit numbers can be formed by rearranging the four digits in 2004?",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "16"
      },
      {
        "label": "D",
        "text": "24"
      },
      {
        "label": "E",
        "text": "81"
      }
    ],
    "answer": "B",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Choose the first digit",
        "body": "The first digit cannot be 0, so it must be 2 or 4."
      },
      {
        "title": "Arrange the remaining digits",
        "body": "After choosing the first digit, the other nonzero digit can go in any of the three remaining positions."
      },
      {
        "title": "Multiply",
        "body": "There are 2 choices for the first digit and 3 positions for the other nonzero digit.",
        "equation": "2 × 3 = 6"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "counting & probability",
      "counting"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-03",
    "title": "2004 AMC 8 Problem 3: Enough Meals",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 1,
    "statement": "Twelve friends met for dinner at Oscar's Overstuffed Oyster House, and each ordered one meal. The portions were so large, there was enough food for 18 people. If they shared, how many meals should they have ordered to have just enough food for the 12 of them?",
    "choices": [
      {
        "label": "A",
        "text": "8"
      },
      {
        "label": "B",
        "text": "9"
      },
      {
        "label": "C",
        "text": "10"
      },
      {
        "label": "D",
        "text": "15"
      },
      {
        "label": "E",
        "text": "18"
      }
    ],
    "answer": "A",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Set the rate",
        "body": "Twelve meals feed 18 people, so one meal feeds 18/12 people."
      },
      {
        "title": "Scale to 12 people",
        "body": "The number of meals needed is 12 divided by 18/12.",
        "equation": "12 ÷ (18/12) = 8"
      },
      {
        "title": "Conclude",
        "body": "They should have ordered 8 meals."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "ratios"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-04",
    "title": "2004 AMC 8 Problem 4: Choosing Starters",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 4,
    "category": "Counting & Probability",
    "subcategory": "Combinations",
    "difficulty": 1,
    "statement": "Ms. Hamilton’s eighth-grade class wants to participate in the annual three-person-team basketball tournament. Lance, Sally, Joy, and Fred are chosen for the team. In how many ways can the three starters be chosen?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "8"
      },
      {
        "label": "E",
        "text": "10"
      }
    ],
    "answer": "B",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Choose who sits out",
        "body": "Choosing 3 starters from 4 people is the same as choosing the 1 person who does not start."
      },
      {
        "title": "Count choices",
        "body": "There are 4 possible people to leave out."
      },
      {
        "title": "Conclude",
        "body": "There are 4 possible starting teams."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "counting & probability",
      "combinations"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-05",
    "title": "2004 AMC 8 Problem 5: Single-Elimination Tournament",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 5,
    "category": "Counting & Probability",
    "subcategory": "Counting",
    "difficulty": 1,
    "statement": "Ms. Hamilton's eighth-grade class wants to participate in the annual three-person-team basketball tournament. The losing team of each game is eliminated from the tournament. If sixteen teams compete, how many games will be played to determine the winner?",
    "choices": [
      {
        "label": "A",
        "text": "4"
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
        "text": "15"
      },
      {
        "label": "E",
        "text": "16"
      }
    ],
    "answer": "D",
    "shortAnswer": "15",
    "solutionSteps": [
      {
        "title": "Use eliminations",
        "body": "Each game eliminates exactly one team."
      },
      {
        "title": "Leave one champion",
        "body": "To go from 16 teams to 1 champion, 15 teams must be eliminated."
      },
      {
        "title": "Conclude",
        "body": "Therefore, 15 games are played."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "counting & probability",
      "counting"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-06",
    "title": "2004 AMC 8 Problem 6: Sally’s Shooting Percentage",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 6,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 2,
    "statement": "After Sally takes 20 shots, she has made 55% of her shots. After she takes 5 more shots, she raises her percentage to 56%. How many of the last 5 shots did she make?",
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
    "answer": "C",
    "shortAnswer": "3",
    "solutionSteps": [
      {
        "title": "Find original makes",
        "body": "Sally made 55% of 20 shots.",
        "equation": "0.55 × 20 = 11"
      },
      {
        "title": "Find final makes",
        "body": "After 25 shots total, making 56% means she made 14 shots.",
        "equation": "0.56 × 25 = 14"
      },
      {
        "title": "Subtract",
        "body": "She made 14 − 11 = 3 of the last 5 shots."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "percent"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-07",
    "title": "2004 AMC 8 Problem 7: Target Heart Rate",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 1,
    "statement": "An athlete's target heart rate, in beats per minute, is 80% of the theoretical maximum heart rate. The maximum heart rate is found by subtracting the athlete's age, in years, from 220. To the nearest whole number, what is the target heart rate of an athlete who is 26 years old?",
    "choices": [
      {
        "label": "A",
        "text": "134"
      },
      {
        "label": "B",
        "text": "155"
      },
      {
        "label": "C",
        "text": "176"
      },
      {
        "label": "D",
        "text": "194"
      },
      {
        "label": "E",
        "text": "243"
      }
    ],
    "answer": "B",
    "shortAnswer": "155",
    "solutionSteps": [
      {
        "title": "Find maximum heart rate",
        "body": "Subtract the athlete’s age from 220.",
        "equation": "220 − 26 = 194"
      },
      {
        "title": "Take 80%",
        "body": "The target heart rate is 80% of 194.",
        "equation": "0.80 × 194 = 155.2"
      },
      {
        "title": "Round",
        "body": "To the nearest whole number, this is 155."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "percent"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-08",
    "title": "2004 AMC 8 Problem 8: Digit Sum 7",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 8,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 1,
    "statement": "Find the number of two-digit positive integers whose digits total 7.",
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
    "answer": "B",
    "shortAnswer": "7",
    "solutionSteps": [
      {
        "title": "List possible tens digits",
        "body": "The tens digit can be 1, 2, 3, 4, 5, 6, or 7."
      },
      {
        "title": "Determine units digit",
        "body": "For each tens digit, the units digit is forced so the sum is 7."
      },
      {
        "title": "Count",
        "body": "There are 7 such numbers: 16, 25, 34, 43, 52, 61, and 70."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "number theory",
      "digits"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-09",
    "title": "2004 AMC 8 Problem 9: Average of Last Three",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 2,
    "statement": "The average of the five numbers in a list is 54. The average of the first two numbers is 48. What is the average of the last three numbers?",
    "choices": [
      {
        "label": "A",
        "text": "55"
      },
      {
        "label": "B",
        "text": "56"
      },
      {
        "label": "C",
        "text": "57"
      },
      {
        "label": "D",
        "text": "58"
      },
      {
        "label": "E",
        "text": "59"
      }
    ],
    "answer": "D",
    "shortAnswer": "58",
    "solutionSteps": [
      {
        "title": "Find total sum",
        "body": "Five numbers with average 54 have total 270.",
        "equation": "5 × 54 = 270"
      },
      {
        "title": "Find first two sum",
        "body": "The first two numbers have average 48, so their sum is 96.",
        "equation": "2 × 48 = 96"
      },
      {
        "title": "Average the last three",
        "body": "The last three sum to 270 − 96 = 174, so their average is 174 ÷ 3 = 58."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "averages"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-10",
    "title": "2004 AMC 8 Problem 10: Handy Aaron’s Pay",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Time and money",
    "difficulty": 2,
    "statement": "Handy Aaron helped a neighbor 1 1/4 hours on Monday, 50 minutes on Tuesday, from 8:20 to 10:45 on Wednesday morning, and a half-hour on Friday. He is paid $3 per hour. How much did he earn for the week?",
    "choices": [
      {
        "label": "A",
        "text": "$8"
      },
      {
        "label": "B",
        "text": "$9"
      },
      {
        "label": "C",
        "text": "$10"
      },
      {
        "label": "D",
        "text": "$12"
      },
      {
        "label": "E",
        "text": "$15"
      }
    ],
    "answer": "E",
    "shortAnswer": "$15",
    "solutionSteps": [
      {
        "title": "Convert times to minutes",
        "body": "Monday is 75 minutes, Tuesday is 50 minutes, Wednesday is 145 minutes, and Friday is 30 minutes."
      },
      {
        "title": "Add the time",
        "body": "The total is 75 + 50 + 145 + 30 = 300 minutes = 5 hours."
      },
      {
        "title": "Multiply by pay rate",
        "body": "At $3 per hour, he earns 5 × 3 = $15."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "time and money"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-11",
    "title": "2004 AMC 8 Problem 11: Rearranging Five Numbers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 11,
    "category": "Logic",
    "subcategory": "Ordering",
    "difficulty": 3,
    "statement": "The numbers −2, 4, 6, 9 and 12 are rearranged according to these rules: 1. The largest is not first, but it is in one of the first three places. 2. The smallest is not last, but it is in one of the last three places. 3. The median is not first or last. What is the average of the first and last numbers?",
    "choices": [
      {
        "label": "A",
        "text": "3.5"
      },
      {
        "label": "B",
        "text": "5"
      },
      {
        "label": "C",
        "text": "6.5"
      },
      {
        "label": "D",
        "text": "7.5"
      },
      {
        "label": "E",
        "text": "8"
      }
    ],
    "answer": "C",
    "shortAnswer": "6.5",
    "solutionSteps": [
      {
        "title": "Place restricted numbers",
        "body": "The largest 12, smallest −2, and median 6 must all be in the middle three positions."
      },
      {
        "title": "Find the endpoints",
        "body": "That leaves 4 and 9 as the first and last numbers in some order."
      },
      {
        "title": "Average endpoints",
        "body": "Their average is (4 + 9)/2 = 6.5."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "logic",
      "ordering"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-12",
    "title": "2004 AMC 8 Problem 12: Cell Phone Battery",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 3,
    "statement": "Niki usually leaves her cell phone on. If her cell phone is on but she is not actually using it, the battery will last for 24 hours. If she is using it constantly, the battery will last for only 3 hours. Since the last recharge, her phone has been on 9 hours, and during that time she has used it for 60 minutes. If she does not use it any more but leaves the phone on, how many more hours will the battery last?",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "8"
      },
      {
        "label": "C",
        "text": "11"
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
    "answer": "B",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Use battery rates",
        "body": "Idle use drains 1/24 of the battery per hour, and active use drains 1/3 per hour."
      },
      {
        "title": "Compute used battery",
        "body": "There were 8 idle hours and 1 active hour.",
        "equation": "8/24 + 1/3 = 1/3 + 1/3 = 2/3"
      },
      {
        "title": "Find remaining idle time",
        "body": "One-third of the battery remains, and idle use drains 1/24 per hour, so it lasts 8 more hours."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "rates"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-13",
    "title": "2004 AMC 8 Problem 13: Oldest to Youngest",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 13,
    "category": "Logic",
    "subcategory": "Truth statements",
    "difficulty": 3,
    "statement": "Amy, Bill and Celine are friends with different ages. Exactly one of the following statements is true. I. Bill is the oldest. II. Amy is not the oldest. III. Celine is not the youngest. Rank the friends from oldest to youngest.",
    "choices": [
      {
        "label": "A",
        "text": "Bill, Amy, Celine"
      },
      {
        "label": "B",
        "text": "Amy, Bill, Celine"
      },
      {
        "label": "C",
        "text": "Celine, Amy, Bill"
      },
      {
        "label": "D",
        "text": "Celine, Bill, Amy"
      },
      {
        "label": "E",
        "text": "Amy, Celine, Bill"
      }
    ],
    "answer": "E",
    "shortAnswer": "Amy, Celine, Bill",
    "solutionSteps": [
      {
        "title": "Test Bill oldest",
        "body": "If Bill were oldest, then Amy is not oldest too, making two statements true. So Bill is not oldest."
      },
      {
        "title": "Test Amy not oldest",
        "body": "If Amy were not oldest, then Celine would be oldest, making Celine not youngest also true. Again two statements would be true."
      },
      {
        "title": "Conclude",
        "body": "Only statement III is true, so Amy is oldest, Celine is middle, and Bill is youngest."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "logic",
      "truth statements"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-14",
    "title": "2004 AMC 8 Problem 14: Geoboard Quadrilateral",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 14,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 4,
    "statement": "What is the area enclosed by the geoboard quadrilateral shown?",
    "choices": [
      {
        "label": "A",
        "text": "15"
      },
      {
        "label": "B",
        "text": "18 1/2"
      },
      {
        "label": "C",
        "text": "22 1/2"
      },
      {
        "label": "D",
        "text": "27"
      },
      {
        "label": "E",
        "text": "41"
      }
    ],
    "answer": "C",
    "shortAnswer": "22 1/2",
    "solutionSteps": [
      {
        "title": "Use Pick’s Theorem",
        "body": "For a polygon on lattice points, area = I + B/2 − 1, where I is the number of interior lattice points and B is the number of boundary lattice points."
      },
      {
        "title": "Count points",
        "body": "The figure has 21 interior points and 5 boundary points."
      },
      {
        "title": "Calculate",
        "body": "Area = 21 + 5/2 − 1 = 22 1/2."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "geometry",
      "area"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-14-geoboard.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2004-15",
    "title": "2004 AMC 8 Problem 15: Hexagonal Tile Border",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 15,
    "category": "Geometry",
    "subcategory": "Patterns",
    "difficulty": 3,
    "statement": "Thirteen dark and six bright hexagonal tiles were used to create the figure shown. If a new figure is created by attaching a border of bright tiles with the same size and shape as the others, what will be the difference between the total number of bright tiles and the total number of dark tiles in the new figure?",
    "choices": [
      {
        "label": "A",
        "text": "5"
      },
      {
        "label": "B",
        "text": "7"
      },
      {
        "label": "C",
        "text": "11"
      },
      {
        "label": "D",
        "text": "12"
      },
      {
        "label": "E",
        "text": "18"
      }
    ],
    "answer": "C",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "Recognize rings",
        "body": "The first ring around the center has 6 tiles, and the second ring has 12 tiles."
      },
      {
        "title": "Add the new border",
        "body": "The next ring has 18 bright tiles."
      },
      {
        "title": "Compare totals",
        "body": "Bright tiles: 6 + 18 = 24. Dark tiles: 1 + 12 = 13. The difference is 11."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "geometry",
      "patterns"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-15-hex-tiles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2004-16",
    "title": "2004 AMC 8 Problem 16: Orange Juice Mixture",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 16,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 2,
    "statement": "Two 600 mL pitchers contain orange juice. One pitcher is 1/3 full and the other pitcher is 2/5 full. Water is added to fill each pitcher completely, then both pitchers are poured into one large container. What fraction of the mixture in the large container is orange juice?",
    "choices": [
      {
        "label": "A",
        "text": "1/8"
      },
      {
        "label": "B",
        "text": "3/16"
      },
      {
        "label": "C",
        "text": "11/30"
      },
      {
        "label": "D",
        "text": "11/19"
      },
      {
        "label": "E",
        "text": "11/15"
      }
    ],
    "answer": "C",
    "shortAnswer": "11/30",
    "solutionSteps": [
      {
        "title": "Find orange juice amounts",
        "body": "The first pitcher has 600 × 1/3 = 200 mL of orange juice. The second has 600 × 2/5 = 240 mL."
      },
      {
        "title": "Find total mixture",
        "body": "Together they contain 440 mL of orange juice in 1200 mL of total liquid."
      },
      {
        "title": "Simplify",
        "body": "The fraction is 440/1200 = 11/30."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "fractions"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-17",
    "title": "2004 AMC 8 Problem 17: Sharing Pencils",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 17,
    "category": "Counting & Probability",
    "subcategory": "Stars and bars",
    "difficulty": 3,
    "statement": "Three friends have a total of 6 identical pencils, and each one has at least one pencil. In how many ways can this happen?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "3"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "10"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "10",
    "solutionSteps": [
      {
        "title": "Give each friend one pencil",
        "body": "After giving one pencil to each friend, 3 pencils remain to distribute freely."
      },
      {
        "title": "Use stars and bars",
        "body": "The number of positive solutions to a + b + c = 6 is C(5,2)."
      },
      {
        "title": "Calculate",
        "body": "C(5,2) = 10 ways."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "counting & probability",
      "stars and bars"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-18",
    "title": "2004 AMC 8 Problem 18: Dart Region Worth 6",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 18,
    "category": "Logic",
    "subcategory": "Elimination",
    "difficulty": 4,
    "statement": "Five friends compete in a dart-throwing contest. Each one has two darts to throw at the same circular target, and each individual’s score is the sum of the scores in the target regions that are hit. The scores for the target regions are the whole numbers 1 through 10. Each throw hits the target in a region with a different value. The scores are: Alice 16 points, Ben 4 points, Cindy 7 points, Dave 11 points, and Ellen 17 points. Who hits the region worth 6 points?",
    "choices": [
      {
        "label": "A",
        "text": "Alice"
      },
      {
        "label": "B",
        "text": "Ben"
      },
      {
        "label": "C",
        "text": "Cindy"
      },
      {
        "label": "D",
        "text": "Dave"
      },
      {
        "label": "E",
        "text": "Ellen"
      }
    ],
    "answer": "A",
    "shortAnswer": "Alice",
    "solutionSteps": [
      {
        "title": "Start with Ben",
        "body": "Ben’s score 4 must be 1 + 3 because no two throws hit the same region."
      },
      {
        "title": "Force Cindy and Dave",
        "body": "Cindy’s 7 must be 2 + 5 after 1 and 3 are used. Dave’s 11 must be 4 + 7."
      },
      {
        "title": "Finish the remaining scores",
        "body": "The remaining regions are 6, 8, 9, and 10. Alice’s 16 must be 6 + 10, so Alice hit 6."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "logic",
      "elimination"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-18-darts.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2004-19",
    "title": "2004 AMC 8 Problem 19: Remainder 2",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 19,
    "category": "Number Theory",
    "subcategory": "LCM",
    "difficulty": 3,
    "statement": "A whole number larger than 2 leaves a remainder of 2 when divided by each of the numbers 3, 4, 5, and 6. The smallest such number lies between which two numbers?",
    "choices": [
      {
        "label": "A",
        "text": "40 and 49"
      },
      {
        "label": "B",
        "text": "60 and 79"
      },
      {
        "label": "C",
        "text": "100 and 129"
      },
      {
        "label": "D",
        "text": "210 and 249"
      },
      {
        "label": "E",
        "text": "320 and 369"
      }
    ],
    "answer": "B",
    "shortAnswer": "60 and 79",
    "solutionSteps": [
      {
        "title": "Subtract the remainder",
        "body": "If the number is x, then x − 2 is divisible by 3, 4, 5, and 6."
      },
      {
        "title": "Find the LCM",
        "body": "The least common multiple of 3, 4, 5, and 6 is 60."
      },
      {
        "title": "Add back 2",
        "body": "The smallest number is 60 + 2 = 62, which lies between 60 and 79."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "number theory",
      "lcm"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-20",
    "title": "2004 AMC 8 Problem 20: People and Chairs",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 20,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 3,
    "statement": "Two-thirds of the people in a room are seated in three-fourths of the chairs. The rest of the people are standing. If there are 6 empty chairs, how many people are in the room?",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "18"
      },
      {
        "label": "C",
        "text": "24"
      },
      {
        "label": "D",
        "text": "27"
      },
      {
        "label": "E",
        "text": "36"
      }
    ],
    "answer": "D",
    "shortAnswer": "27",
    "solutionSteps": [
      {
        "title": "Find taken chairs",
        "body": "If 3/4 of the chairs are taken, then 1/4 are empty. Six empty chairs means 18 chairs are taken."
      },
      {
        "title": "Relate seated people",
        "body": "Those 18 seated people are 2/3 of all the people."
      },
      {
        "title": "Solve",
        "body": "If (2/3)x = 18, then x = 27."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "fractions"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-21",
    "title": "2004 AMC 8 Problem 21: Even Spinner Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 21,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "Spinners A and B are spun. On each spinner, the arrow is equally likely to land on each number. What is the probability that the product of the two spinners’ numbers is even?",
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
    "answer": "D",
    "shortAnswer": "2/3",
    "solutionSteps": [
      {
        "title": "Use the complement",
        "body": "The product is odd only if both spinner results are odd."
      },
      {
        "title": "Compute odd probabilities",
        "body": "Spinner A has two odd numbers out of four, so P(odd) = 1/2. Spinner B has two odd numbers out of three, so P(odd) = 2/3."
      },
      {
        "title": "Subtract from 1",
        "body": "P(product even) = 1 − (1/2)(2/3) = 2/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "counting & probability",
      "probability"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-21-spinners.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2004-22",
    "title": "2004 AMC 8 Problem 22: Married Men at a Party",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 22,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 4,
    "statement": "At a party there are only single women and married men with their wives. The probability that a randomly selected woman is single is 2/5. What fraction of the people in the room are married men?",
    "choices": [
      {
        "label": "A",
        "text": "1/3"
      },
      {
        "label": "B",
        "text": "3/8"
      },
      {
        "label": "C",
        "text": "2/5"
      },
      {
        "label": "D",
        "text": "5/12"
      },
      {
        "label": "E",
        "text": "3/5"
      }
    ],
    "answer": "B",
    "shortAnswer": "3/8",
    "solutionSteps": [
      {
        "title": "Choose a convenient number",
        "body": "Suppose there are 5 women. Since 2/5 are single, 2 are single and 3 are married."
      },
      {
        "title": "Add husbands",
        "body": "The 3 married women each have a husband present, so there are 3 married men."
      },
      {
        "title": "Find the fraction",
        "body": "There are 8 people total, so the fraction who are married men is 3/8."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "algebra",
      "fractions"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2004-23",
    "title": "2004 AMC 8 Problem 23: Distance from Home",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Graphs",
    "difficulty": 4,
    "statement": "Tess runs counterclockwise around rectangular block JKLM. She lives at corner J. Which graph could represent her straight-line distance from home?",
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
    "answer": "D",
    "shortAnswer": "Graph D",
    "solutionSteps": [
      {
        "title": "Start at home",
        "body": "At corner J, Tess’s distance from home starts at 0."
      },
      {
        "title": "Track the rectangle",
        "body": "As she runs along the first side, distance increases. Around the far corner near L, her distance is greatest, then it decreases as she returns."
      },
      {
        "title": "Choose the shape",
        "body": "The only graph with one middle maximum and ending back at 0 is graph D."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "geometry",
      "graphs"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-23-distance-graphs.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2004-24",
    "title": "2004 AMC 8 Problem 24: Parallelogram Height",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 24,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 5,
    "statement": "In the figure, ABCD is a rectangle and EFGH is a parallelogram. Using the measurements given in the figure, what is the length d of the segment that is perpendicular to HE and FG?",
    "choices": [
      {
        "label": "A",
        "text": "6.8"
      },
      {
        "label": "B",
        "text": "7.1"
      },
      {
        "label": "C",
        "text": "7.6"
      },
      {
        "label": "D",
        "text": "7.8"
      },
      {
        "label": "E",
        "text": "8.1"
      }
    ],
    "answer": "C",
    "shortAnswer": "7.6",
    "solutionSteps": [
      {
        "title": "Find the parallelogram area",
        "body": "The rectangle is 10 by 8, so its area is 80. Subtract the four corner triangles: two with area (1/2)(3)(4) and two with area (1/2)(6)(5).",
        "equation": "80 − 12 − 30 = 38"
      },
      {
        "title": "Find the base",
        "body": "FG is the hypotenuse of a 3-4-5 triangle, so FG = 5."
      },
      {
        "title": "Solve for height",
        "body": "Area = base × height, so 38 = 5d and d = 7.6."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "geometry",
      "area"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-24-parallelogram.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2004-25",
    "title": "2004 AMC 8 Problem 25: Intersecting Squares and Circle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2004,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 5,
    "statement": "Two 4 × 4 squares intersect at right angles, bisecting their intersecting sides, as shown. The circle’s diameter is the segment between the two points of intersection. What is the area of the shaded region created by removing the circle from the squares?",
    "choices": [
      {
        "label": "A",
        "text": "16 − 4π"
      },
      {
        "label": "B",
        "text": "16 − 2π"
      },
      {
        "label": "C",
        "text": "28 − 4π"
      },
      {
        "label": "D",
        "text": "28 − 2π"
      },
      {
        "label": "E",
        "text": "32 − 2π"
      }
    ],
    "answer": "D",
    "shortAnswer": "28 − 2π",
    "solutionSteps": [
      {
        "title": "Find area of the union",
        "body": "Two 4 by 4 squares have total area 32, but their overlap is a 2 by 2 square, area 4. The union area is 32 − 4 = 28."
      },
      {
        "title": "Find circle area",
        "body": "The circle’s diameter is the diagonal of the 2 by 2 overlap square, so radius squared is 2."
      },
      {
        "title": "Subtract the circle",
        "body": "The circle area is 2π, so the shaded area is 28 − 2π."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the question",
        "narration": "Identify the important numbers, labels, and what the problem asks for.",
        "visualHint": "Key quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Apply the main idea to reduce the problem to a short calculation.",
        "visualHint": "The relevant equation or counting setup appears."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2004",
      "geometry",
      "area"
    ],
    "sourceName": "2004 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2004/problem-25-overlapping-squares.svg"
    ],
    "needsDiagram": true
  }
];

const amc2005Problems: Problem[] = [
  {
    "id": "amc8-2005-01",
    "title": "2005 AMC 8 Problem 1: Wrong Operation",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Arithmetic",
    "difficulty": 1,
    "statement": "Connie multiplies a number by 2 and gets 60 as her answer. However, she should have divided the number by 2 to get the correct answer. What is the correct answer?",
    "choices": [
      {
        "label": "A",
        "text": "7.5"
      },
      {
        "label": "B",
        "text": "15"
      },
      {
        "label": "C",
        "text": "30"
      },
      {
        "label": "D",
        "text": "120"
      },
      {
        "label": "E",
        "text": "240"
      }
    ],
    "answer": "B",
    "shortAnswer": "15",
    "solutionSteps": [
      {
        "title": "Find the original number",
        "body": "If x is the number, Connie computed 2x=60.",
        "equation": "2x=60 ⇒ x=30"
      },
      {
        "title": "Use the correct operation",
        "body": "She should divide the number by 2 instead.",
        "equation": "30÷2=15"
      },
      {
        "title": "Conclude",
        "body": "The correct answer is 15."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "arithmetic"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-02",
    "title": "2005 AMC 8 Problem 2: Folder Sale Savings",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 2,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 1,
    "statement": "Karl bought five folders from Pay-A-Lot at a cost of $2.50 each. Pay-A-Lot had a 20%-off sale the following day. How much could Karl have saved on the purchase by waiting a day?",
    "choices": [
      {
        "label": "A",
        "text": "$1.00"
      },
      {
        "label": "B",
        "text": "$2.00"
      },
      {
        "label": "C",
        "text": "$2.50"
      },
      {
        "label": "D",
        "text": "$2.75"
      },
      {
        "label": "E",
        "text": "$5.00"
      }
    ],
    "answer": "C",
    "shortAnswer": "$2.50",
    "solutionSteps": [
      {
        "title": "Find the original total",
        "body": "Five folders cost $2.50 each.",
        "equation": "5×2.50=$12.50"
      },
      {
        "title": "Take 20%",
        "body": "The savings would be 20% of $12.50.",
        "equation": "0.20×12.50=$2.50"
      },
      {
        "title": "Conclude",
        "body": "Karl could have saved $2.50."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "percent"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-03",
    "title": "2005 AMC 8 Problem 3: Diagonal Symmetry",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 3,
    "category": "Geometry",
    "subcategory": "Symmetry",
    "difficulty": 2,
    "statement": "What is the minimum number of small squares that must be colored black so that a line of symmetry lies on the diagonal BD of square ABCD?",
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
    "answer": "D",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Use reflection",
        "body": "For BD to be a line of symmetry, every black square must have a matching reflected black square across diagonal BD."
      },
      {
        "title": "Find unmatched partners",
        "body": "Checking the grid, four reflected partner squares are missing."
      },
      {
        "title": "Conclude",
        "body": "The minimum number of additional black squares is 4."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "symmetry"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-03-symmetry-grid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-04",
    "title": "2005 AMC 8 Problem 4: Square with Equal Perimeter",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 4,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 1,
    "statement": "A square and a triangle have equal perimeters. The lengths of the three sides of the triangle are 6.1 cm, 8.2 cm and 9.7 cm. What is the area of the square in square centimeters?",
    "choices": [
      {
        "label": "A",
        "text": "24"
      },
      {
        "label": "B",
        "text": "25"
      },
      {
        "label": "C",
        "text": "36"
      },
      {
        "label": "D",
        "text": "48"
      },
      {
        "label": "E",
        "text": "64"
      }
    ],
    "answer": "C",
    "shortAnswer": "36",
    "solutionSteps": [
      {
        "title": "Find the triangle perimeter",
        "body": "Add the three side lengths.",
        "equation": "6.1+8.2+9.7=24"
      },
      {
        "title": "Find the square side",
        "body": "The square has the same perimeter, so each side is one-fourth of 24.",
        "equation": "24÷4=6"
      },
      {
        "title": "Find the area",
        "body": "The square area is side squared.",
        "equation": "6^2=36"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "area"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-05",
    "title": "2005 AMC 8 Problem 5: Soda Packs",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 5,
    "category": "Number Theory",
    "subcategory": "Optimization",
    "difficulty": 1,
    "statement": "Soda is sold in packs of 6, 12 and 24 cans. What is the minimum number of packs needed to buy exactly 90 cans of soda?",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "5"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "8"
      },
      {
        "label": "E",
        "text": "15"
      }
    ],
    "answer": "B",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Use large packs first",
        "body": "Three 24-packs give 72 cans.",
        "equation": "90-3×24=18"
      },
      {
        "title": "Finish the remainder",
        "body": "One 12-pack leaves 6 cans, so add one 6-pack."
      },
      {
        "title": "Count packs",
        "body": "The total number of packs is 3+1+1.",
        "equation": "3+1+1=5"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "number theory",
      "optimization"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-06",
    "title": "2005 AMC 8 Problem 6: Comparing Decimals",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 6,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 1,
    "statement": "Suppose d is a digit. For how many values of d is 2.00d5 > 2.005?",
    "choices": [
      {
        "label": "A",
        "text": "0"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "10"
      }
    ],
    "answer": "C",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Compare place values",
        "body": "The numbers agree through the thousandths place until the digit d is compared with 5."
      },
      {
        "title": "Find possible digits",
        "body": "The inequality works when d is 5, 6, 7, 8, or 9."
      },
      {
        "title": "Count them",
        "body": "There are 5 possible values of d."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "number theory",
      "digits"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-07",
    "title": "2005 AMC 8 Problem 7: Direct Distance",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 7,
    "category": "Geometry",
    "subcategory": "Pythagorean theorem",
    "difficulty": 2,
    "statement": "Bill walks 1/2 mile south, then 3/4 mile east, and finally 1/2 mile south. How many miles is he, in a direct line, from his starting point?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "1 1/4"
      },
      {
        "label": "C",
        "text": "1 1/2"
      },
      {
        "label": "D",
        "text": "1 3/4"
      },
      {
        "label": "E",
        "text": "2"
      }
    ],
    "answer": "B",
    "shortAnswer": "1 1/4",
    "solutionSteps": [
      {
        "title": "Combine vertical movement",
        "body": "He walks south 1/2 mile and then another 1/2 mile, for 1 mile south total."
      },
      {
        "title": "Make a right triangle",
        "body": "The horizontal leg is 3/4 and the vertical leg is 1."
      },
      {
        "title": "Use a 3-4-5 triangle",
        "body": "The legs 3/4 and 1 match a scaled 3-4-5 triangle, so the hypotenuse is 5/4.",
        "equation": "5/4=1 1/4"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "pythagorean theorem"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-08",
    "title": "2005 AMC 8 Problem 8: Odd Expressions",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 8,
    "category": "Number Theory",
    "subcategory": "Parity",
    "difficulty": 2,
    "statement": "Suppose m and n are positive odd integers. Which of the following must also be an odd integer?",
    "choices": [
      {
        "label": "A",
        "text": "m + 3n"
      },
      {
        "label": "B",
        "text": "3m − n"
      },
      {
        "label": "C",
        "text": "3m^2 + 3n^2"
      },
      {
        "label": "D",
        "text": "(nm + 3)^2"
      },
      {
        "label": "E",
        "text": "3mn"
      }
    ],
    "answer": "E",
    "shortAnswer": "3mn",
    "solutionSteps": [
      {
        "title": "Use parity",
        "body": "Odd times odd is odd, so mn is odd and 3mn is odd."
      },
      {
        "title": "Check the others",
        "body": "The other expressions are even when m and n are odd."
      },
      {
        "title": "Conclude",
        "body": "The expression that must be odd is 3mn."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "number theory",
      "parity"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-09",
    "title": "2005 AMC 8 Problem 9: Isosceles Quadrilateral Diagonal",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 9,
    "category": "Geometry",
    "subcategory": "Triangles",
    "difficulty": 2,
    "statement": "In quadrilateral ABCD, sides AB and BC both have length 10, sides CD and DA both have length 17, and the measure of angle ADC is 60°. What is the length of diagonal AC?",
    "choices": [
      {
        "label": "A",
        "text": "13.5"
      },
      {
        "label": "B",
        "text": "14"
      },
      {
        "label": "C",
        "text": "15.5"
      },
      {
        "label": "D",
        "text": "17"
      },
      {
        "label": "E",
        "text": "18.5"
      }
    ],
    "answer": "D",
    "shortAnswer": "17",
    "solutionSteps": [
      {
        "title": "Focus on triangle ADC",
        "body": "Since AD=CD=17, triangle ADC is isosceles."
      },
      {
        "title": "Use the 60-degree angle",
        "body": "The angle at D is 60°. In an isosceles triangle with vertex angle 60°, all three angles are 60°."
      },
      {
        "title": "Conclude",
        "body": "Triangle ADC is equilateral, so AC=AD=17."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "triangles"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-09-quadrilateral.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-10",
    "title": "2005 AMC 8 Problem 10: Walking and Running",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 2,
    "statement": "Joe had walked half way from home to school when he realized he was late. He ran the rest of the way to school. He ran 3 times as fast as he walked. Joe took 6 minutes to walk half way to school. How many minutes did it take Joe to get from home to school?",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "7.3"
      },
      {
        "label": "C",
        "text": "7.7"
      },
      {
        "label": "D",
        "text": "8"
      },
      {
        "label": "E",
        "text": "8.3"
      }
    ],
    "answer": "D",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Use the walking time",
        "body": "Joe took 6 minutes to walk half the distance."
      },
      {
        "title": "Running is three times faster",
        "body": "For the same half-distance, running takes one-third as much time.",
        "equation": "6÷3=2"
      },
      {
        "title": "Add the times",
        "body": "The total time is walking time plus running time.",
        "equation": "6+2=8"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "rates"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-11",
    "title": "2005 AMC 8 Problem 11: Discount and Tax Order",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 2,
    "statement": "The sales tax rate in Rubenenkoville is 6%. During a sale at the Bergville Coat Closet, the price of a coat is discounted 20% from its $90.00 price. Two clerks, Jack and Jill, calculate the bill independently. Jack rings up $90.00 and adds 6% sales tax, then subtracts 20% from this total. Jill rings up $90.00, subtracts 20% of the price, then adds 6% of the discounted price for sales tax. What is Jack's total minus Jill's total?",
    "choices": [
      {
        "label": "A",
        "text": "−$1.06"
      },
      {
        "label": "B",
        "text": "−$0.53"
      },
      {
        "label": "C",
        "text": "$0"
      },
      {
        "label": "D",
        "text": "$0.53"
      },
      {
        "label": "E",
        "text": "$1.06"
      }
    ],
    "answer": "C",
    "shortAnswer": "$0",
    "solutionSteps": [
      {
        "title": "Write Jack’s calculation",
        "body": "Jack multiplies by 1.06 and then by 0.80.",
        "equation": "90(1.06)(0.80)"
      },
      {
        "title": "Write Jill’s calculation",
        "body": "Jill multiplies by 0.80 and then by 1.06.",
        "equation": "90(0.80)(1.06)"
      },
      {
        "title": "Use commutativity",
        "body": "The products are equal, so Jack’s total minus Jill’s total is $0."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "percent"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-12",
    "title": "2005 AMC 8 Problem 12: Big Al Bananas",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Arithmetic sequences",
    "difficulty": 2,
    "statement": "Big Al, the ape, ate 100 bananas from May 1 through May 5. Each day he ate six more bananas than on the previous day. How many bananas did Big Al eat on May 5?",
    "choices": [
      {
        "label": "A",
        "text": "20"
      },
      {
        "label": "B",
        "text": "22"
      },
      {
        "label": "C",
        "text": "30"
      },
      {
        "label": "D",
        "text": "32"
      },
      {
        "label": "E",
        "text": "34"
      }
    ],
    "answer": "D",
    "shortAnswer": "32",
    "solutionSteps": [
      {
        "title": "Let May 5 be n",
        "body": "The amounts over the five days are n−24, n−18, n−12, n−6, and n."
      },
      {
        "title": "Use the total",
        "body": "Their sum is 100.",
        "equation": "(n-24)+(n-18)+(n-12)+(n-6)+n=100"
      },
      {
        "title": "Solve",
        "body": "This gives 5n−60=100, so n=32."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "equation",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "arithmetic sequences"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-13",
    "title": "2005 AMC 8 Problem 13: L-Shaped Polygon Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 13,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "The area of polygon ABCDEF is 52 with AB=8, BC=9 and FA=5. What is DE+EF?",
    "choices": [
      {
        "label": "A",
        "text": "7"
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
    "answer": "C",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Find DE",
        "body": "The full height BC is 9 and AF is 5, so DE=9−5=4."
      },
      {
        "title": "Use the outside rectangle",
        "body": "The outside rectangle has area 8×9=72. The missing rectangle has height 4 and width EF."
      },
      {
        "title": "Solve for EF",
        "body": "The polygon area is 52, so 72−4EF=52. Thus EF=5 and DE+EF=9."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "area"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-13-l-shaped-polygon.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-14",
    "title": "2005 AMC 8 Problem 14: Conference Games",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 14,
    "category": "Counting & Probability",
    "subcategory": "Counting",
    "difficulty": 3,
    "statement": "The Little Twelve Basketball Conference has two divisions, with six teams in each division. Each team plays each of the other teams in its own division twice and every team in the other division once. How many conference games are scheduled?",
    "choices": [
      {
        "label": "A",
        "text": "80"
      },
      {
        "label": "B",
        "text": "96"
      },
      {
        "label": "C",
        "text": "100"
      },
      {
        "label": "D",
        "text": "108"
      },
      {
        "label": "E",
        "text": "192"
      }
    ],
    "answer": "B",
    "shortAnswer": "96",
    "solutionSteps": [
      {
        "title": "Games within one division",
        "body": "Six teams have C(6,2)=15 pairings. Each pairing plays twice, so one division has 30 games."
      },
      {
        "title": "Both divisions",
        "body": "There are two divisions, so within-division games total 60."
      },
      {
        "title": "Add cross-division games",
        "body": "Each of 6 teams in one division plays each of 6 in the other: 36 games. Total is 60+36=96."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "counting & probability",
      "counting"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-15",
    "title": "2005 AMC 8 Problem 15: Isosceles Triangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 15,
    "category": "Geometry",
    "subcategory": "Triangle inequality",
    "difficulty": 3,
    "statement": "How many different isosceles triangles have integer side lengths and perimeter 23?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "6"
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
    "answer": "C",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Set variables",
        "body": "Let the equal sides be a and the base be b. Then 2a+b=23."
      },
      {
        "title": "Use triangle inequality",
        "body": "We need 2a>b. Since b=23−2a, this gives 2a>23−2a, so a>5.75."
      },
      {
        "title": "Count possibilities",
        "body": "Also b≥1, so a≤11. Thus a can be 6,7,8,9,10,11, giving 6 triangles."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "triangle inequality"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-16",
    "title": "2005 AMC 8 Problem 16: Martian Socks",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 16,
    "category": "Counting & Probability",
    "subcategory": "Pigeonhole principle",
    "difficulty": 2,
    "statement": "A five-legged Martian has a drawer full of socks, each of which is red, white or blue, and there are at least five socks of each color. The Martian pulls out one sock at a time without looking. How many socks must the Martian remove from the drawer to be certain there will be 5 socks of the same color?",
    "choices": [
      {
        "label": "A",
        "text": "6"
      },
      {
        "label": "B",
        "text": "9"
      },
      {
        "label": "C",
        "text": "12"
      },
      {
        "label": "D",
        "text": "13"
      },
      {
        "label": "E",
        "text": "15"
      }
    ],
    "answer": "D",
    "shortAnswer": "13",
    "solutionSteps": [
      {
        "title": "Worst case before success",
        "body": "The Martian could pull out 4 red, 4 white, and 4 blue socks without having five of any color."
      },
      {
        "title": "Count that case",
        "body": "That is 12 socks total."
      },
      {
        "title": "One more forces five",
        "body": "The 13th sock must make one color reach 5."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "counting & probability",
      "pigeonhole principle"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-17",
    "title": "2005 AMC 8 Problem 17: Greatest Average Speed",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Graphs",
    "difficulty": 2,
    "statement": "The results of a cross-country team's training run are graphed below. Which student has the greatest average speed?",
    "choices": [
      {
        "label": "A",
        "text": "Angela"
      },
      {
        "label": "B",
        "text": "Briana"
      },
      {
        "label": "C",
        "text": "Carla"
      },
      {
        "label": "D",
        "text": "Debra"
      },
      {
        "label": "E",
        "text": "Evelyn"
      }
    ],
    "answer": "E",
    "shortAnswer": "Evelyn",
    "solutionSteps": [
      {
        "title": "Use slope",
        "body": "Average speed is distance divided by time, which is the slope of the line from the origin to the student’s point."
      },
      {
        "title": "Compare slopes",
        "body": "Evelyn’s point is high and far to the left, giving the steepest line from the origin."
      },
      {
        "title": "Conclude",
        "body": "Evelyn has the greatest average speed."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "graphs"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-17-distance-time-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-18",
    "title": "2005 AMC 8 Problem 18: Three-Digit Multiples of 13",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 18,
    "category": "Number Theory",
    "subcategory": "Multiples",
    "difficulty": 2,
    "statement": "How many three-digit numbers are divisible by 13?",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "67"
      },
      {
        "label": "C",
        "text": "69"
      },
      {
        "label": "D",
        "text": "76"
      },
      {
        "label": "E",
        "text": "77"
      }
    ],
    "answer": "C",
    "shortAnswer": "69",
    "solutionSteps": [
      {
        "title": "Find first multiple",
        "body": "The first three-digit multiple of 13 is 104, which is 13×8."
      },
      {
        "title": "Find last multiple",
        "body": "The last three-digit multiple of 13 is 988, which is 13×76."
      },
      {
        "title": "Count integers",
        "body": "The multipliers run from 8 through 76 inclusive.",
        "equation": "76-8+1=69"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "number theory",
      "multiples"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-19",
    "title": "2005 AMC 8 Problem 19: Trapezoid Perimeter",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Pythagorean theorem",
    "difficulty": 3,
    "statement": "What is the perimeter of trapezoid ABCD?",
    "choices": [
      {
        "label": "A",
        "text": "180"
      },
      {
        "label": "B",
        "text": "188"
      },
      {
        "label": "C",
        "text": "196"
      },
      {
        "label": "D",
        "text": "200"
      },
      {
        "label": "E",
        "text": "204"
      }
    ],
    "answer": "A",
    "shortAnswer": "180",
    "solutionSteps": [
      {
        "title": "Drop altitudes",
        "body": "Drop perpendiculars from B and C to the bottom base. This creates a rectangle and two right triangles."
      },
      {
        "title": "Find base pieces",
        "body": "On the left, a 30-24 right triangle has horizontal leg 18. On the right, a 25-24 right triangle has horizontal leg 7."
      },
      {
        "title": "Find perimeter",
        "body": "The bottom base is 18+50+7=75, so the perimeter is 30+50+25+75=180."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "pythagorean theorem"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-19-trapezoid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-20",
    "title": "2005 AMC 8 Problem 20: Clockwise Counterclockwise Game",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 20,
    "category": "Number Theory",
    "subcategory": "Modular arithmetic",
    "difficulty": 3,
    "statement": "Alice and Bob play a game involving a circle whose circumference is divided by 12 equally-spaced points. The points are numbered clockwise, from 1 to 12. Both start on point 12. Alice moves clockwise and Bob, counterclockwise. In a turn of the game, Alice moves 5 points clockwise and Bob moves 9 points counterclockwise. The game ends when they stop on the same point. How many turns will this take?",
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
        "text": "12"
      },
      {
        "label": "D",
        "text": "14"
      },
      {
        "label": "E",
        "text": "24"
      }
    ],
    "answer": "A",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Measure closing distance",
        "body": "Each turn, Alice and Bob move toward coincidence by a combined 5+9=14 point-steps around a 12-point circle."
      },
      {
        "title": "Use multiples of 12",
        "body": "They meet when 14k is a multiple of 12."
      },
      {
        "title": "Find the smallest k",
        "body": "Since gcd(14,12)=2, the smallest k is 12/2=6."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "number theory",
      "modular arithmetic"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-21",
    "title": "2005 AMC 8 Problem 21: Triangles from Dots",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 21,
    "category": "Counting & Probability",
    "subcategory": "Combinations",
    "difficulty": 3,
    "statement": "How many distinct triangles can be drawn using three of the dots below as vertices?",
    "choices": [
      {
        "label": "A",
        "text": "9"
      },
      {
        "label": "B",
        "text": "12"
      },
      {
        "label": "C",
        "text": "18"
      },
      {
        "label": "D",
        "text": "20"
      },
      {
        "label": "E",
        "text": "24"
      }
    ],
    "answer": "C",
    "shortAnswer": "18",
    "solutionSteps": [
      {
        "title": "Choose any three dots",
        "body": "There are 6 dots, so there are C(6,3)=20 triples."
      },
      {
        "title": "Remove straight lines",
        "body": "The three top dots and the three bottom dots each form a straight line, not a triangle."
      },
      {
        "title": "Subtract",
        "body": "The number of triangles is 20−2=18."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "probability",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "counting & probability",
      "combinations"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-21-six-dots.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-22",
    "title": "2005 AMC 8 Problem 22: Best Detergent Buy",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 22,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 4,
    "statement": "A company sells detergent in three different sized boxes: small (S), medium (M) and large (L). The medium size costs 50% more than the small size and contains 20% less detergent than the large size. The large size contains twice as much detergent as the small size and costs 30% more than the medium size. Rank the three sizes from best to worst buy.",
    "choices": [
      {
        "label": "A",
        "text": "SML"
      },
      {
        "label": "B",
        "text": "LMS"
      },
      {
        "label": "C",
        "text": "MSL"
      },
      {
        "label": "D",
        "text": "LSM"
      },
      {
        "label": "E",
        "text": "MLS"
      }
    ],
    "answer": "E",
    "shortAnswer": "MLS",
    "solutionSteps": [
      {
        "title": "Assign convenient values",
        "body": "Let the small box cost $1 and contain 5 oz. Then the large box contains 10 oz."
      },
      {
        "title": "Find medium and large costs",
        "body": "The medium costs $1.50 and contains 8 oz. The large costs 30% more than medium, or $1.95."
      },
      {
        "title": "Compare cost per ounce",
        "body": "S: $0.200/oz, M: $0.1875/oz, L: $0.195/oz, so the order is M, L, S."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "algebra",
      "rates"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-23",
    "title": "2005 AMC 8 Problem 23: Semicircle in Right Triangle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 4,
    "statement": "Isosceles right triangle ABC encloses a semicircle of area 2π. The circle has its center O on hypotenuse AB and is tangent to sides AC and BC. What is the area of triangle ABC?",
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
        "text": "3π"
      },
      {
        "label": "D",
        "text": "10"
      },
      {
        "label": "E",
        "text": "4π"
      }
    ],
    "answer": "B",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Find the full circle",
        "body": "The semicircle has area 2π, so the full circle would have area 4π."
      },
      {
        "title": "Find the radius",
        "body": "If πr²=4π, then r=2, so the diameter is 4."
      },
      {
        "title": "Use symmetry",
        "body": "Doubling the isosceles right triangle makes a square of side 4 and area 16. The original triangle has half that area: 8."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "area"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-23-semicircle-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2005-24",
    "title": "2005 AMC 8 Problem 24: Two-Key Calculator",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 24,
    "category": "Number Theory",
    "subcategory": "Binary",
    "difficulty": 4,
    "statement": "A certain calculator has only two keys [+1] and [x2]. When you press one of the keys, the calculator automatically displays the result. For instance, if the calculator originally displayed \"9\" and you pressed [+1], it would display \"10.\" If you then pressed [x2], it would display \"20.\" Starting with the display \"1,\" what is the fewest number of keystrokes you would need to reach \"200\"?",
    "choices": [
      {
        "label": "A",
        "text": "8"
      },
      {
        "label": "B",
        "text": "9"
      },
      {
        "label": "C",
        "text": "10"
      },
      {
        "label": "D",
        "text": "11"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "B",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Work backward",
        "body": "Reverse the operations: from 200, if even divide by 2; if odd subtract 1."
      },
      {
        "title": "Reverse sequence",
        "body": "200→100→50→25→24→12→6→3→2→1 takes 9 reverse steps."
      },
      {
        "title": "Conclude",
        "body": "Therefore the fewest number of forward keystrokes is 9."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Choice B is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "number theory",
      "binary"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2005-25",
    "title": "2005 AMC 8 Problem 25: Square and Circle Areas",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2005,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 5,
    "statement": "A square with side length 2 and a circle share the same center. The total area of the regions that are inside the circle and outside the square is equal to the total area of the regions that are outside the circle and inside the square. What is the radius of the circle?",
    "choices": [
      {
        "label": "A",
        "text": "2/√π"
      },
      {
        "label": "B",
        "text": "(1+√2)/2"
      },
      {
        "label": "C",
        "text": "3/2"
      },
      {
        "label": "D",
        "text": "√3"
      },
      {
        "label": "E",
        "text": "√π"
      }
    ],
    "answer": "A",
    "shortAnswer": "2/√π",
    "solutionSteps": [
      {
        "title": "Let the overlap be a",
        "body": "Let a be the area common to the square and circle."
      },
      {
        "title": "Set the leftover areas equal",
        "body": "Circle-only area equals square-only area, so πr²−a=4−a."
      },
      {
        "title": "Solve",
        "body": "The a terms cancel, giving πr²=4, so r=2/√π."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers, expressions, and what is being asked.",
        "visualHint": "Important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main idea to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "area-model",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2005",
      "geometry",
      "area"
    ],
    "sourceName": "2005 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2005/problem-25-square-circle.svg"
    ],
    "needsDiagram": true
  }
];

export const sampleProblems: Problem[] = [
  ...legacySampleProblems,
  ...amc2001Problems,
  ...amc2002Problems,
  ...amc2003Problems,
  ...amc2004Problems,
  ...amc2005Problems,
];

export { legacySampleProblems, amc2001Problems, amc2002Problems, amc2003Problems, amc2004Problems, amc2005Problems };
