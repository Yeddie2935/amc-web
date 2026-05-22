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

const amc2006Problems: Problem[] = [
  {
    "id": "amc8-2006-01",
    "title": "2006 AMC 8 Problem 1: Rounding Purchases",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Rounding and estimation",
    "difficulty": 1,
    "statement": "Mindy made three purchases for $1.98, $5.04, and $9.89. What was her total, to the nearest dollar?",
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
        "text": "16"
      },
      {
        "label": "D",
        "text": "17"
      },
      {
        "label": "E",
        "text": "18"
      }
    ],
    "answer": "D",
    "shortAnswer": "17",
    "solutionSteps": [
      {
        "title": "Round each price",
        "body": "To the nearest dollar, $1.98 rounds to $2, $5.04 rounds to $5, and $9.89 rounds to $10.",
        "equation": "2+5+10=17"
      },
      {
        "title": "Choose the nearest total",
        "body": "The rounded total is 17 dollars."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "arithmetic",
      "rounding"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-02",
    "title": "2006 AMC 8 Problem 2: AMC Score",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 2,
    "category": "Other",
    "subcategory": "Contest scoring",
    "difficulty": 1,
    "statement": "On the AMC 8 contest Billy answers 13 questions correctly, answers 7 questions incorrectly and doesn't answer the last 5. What is his score?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "13"
      },
      {
        "label": "D",
        "text": "19"
      },
      {
        "label": "E",
        "text": "26"
      }
    ],
    "answer": "C",
    "shortAnswer": "13",
    "solutionSteps": [
      {
        "title": "Use AMC 8 scoring",
        "body": "The AMC 8 gives 1 point for each correct answer and 0 points for incorrect or blank answers."
      },
      {
        "title": "Count correct answers",
        "body": "Billy answered 13 questions correctly, so his score is 13."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "correct": 13,
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "scoring",
      "arithmetic"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-03",
    "title": "2006 AMC 8 Problem 3: Lap Time Improvement",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 1,
    "statement": "Elisa swims laps in the pool. When she first started, she completed 10 laps in 25 minutes. Now, she can finish 12 laps in 24 minutes. By how many minutes has she improved her lap time?",
    "choices": [
      {
        "label": "A",
        "text": "1/2"
      },
      {
        "label": "B",
        "text": "3/4"
      },
      {
        "label": "C",
        "text": "1"
      },
      {
        "label": "D",
        "text": "2"
      },
      {
        "label": "E",
        "text": "3"
      }
    ],
    "answer": "A",
    "shortAnswer": "1/2",
    "solutionSteps": [
      {
        "title": "Find the old lap time",
        "body": "At first, Elisa took 25 minutes for 10 laps.",
        "equation": "25/10=2.5"
      },
      {
        "title": "Find the new lap time",
        "body": "Now she takes 24 minutes for 12 laps.",
        "equation": "24/12=2"
      },
      {
        "title": "Subtract",
        "body": "Her lap time improved by 2.5−2=0.5 minute, or 1/2 minute."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
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
        "oldTime": 2.5,
        "newTime": 2,
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "rates",
      "unit rate"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-04",
    "title": "2006 AMC 8 Problem 4: Spinner Direction",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 4,
    "category": "Geometry",
    "subcategory": "Rotations",
    "difficulty": 1,
    "statement": "Initially, a spinner points west. Chenille moves it clockwise 2 1/4 revolutions and then counterclockwise 3 3/4 revolutions. In what direction does the spinner point after the two moves?",
    "choices": [
      {
        "label": "A",
        "text": "north"
      },
      {
        "label": "B",
        "text": "east"
      },
      {
        "label": "C",
        "text": "south"
      },
      {
        "label": "D",
        "text": "west"
      },
      {
        "label": "E",
        "text": "northwest"
      }
    ],
    "answer": "B",
    "shortAnswer": "east",
    "solutionSteps": [
      {
        "title": "Find the net turn",
        "body": "The counterclockwise turn exceeds the clockwise turn by 3 3/4−2 1/4=1 1/2 revolutions."
      },
      {
        "title": "Apply the turn",
        "body": "Starting west, a net 1 full revolution returns to west, and another 1/2 revolution points east."
      }
    ],
    "animationFrames": [
      {
        "title": "Start west",
        "narration": "Show the spinner pointing west.",
        "visualHint": "The arrow starts at W."
      },
      {
        "title": "Find net rotation",
        "narration": "Subtract the clockwise rotations from the counterclockwise rotations.",
        "visualHint": "3 3/4 − 2 1/4 = 1 1/2 counterclockwise."
      },
      {
        "title": "Rotate to east",
        "narration": "One full turn returns to west; the extra half turn points east.",
        "visualHint": "The arrow ends at E and choice B is circled."
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
      "2006",
      "geometry",
      "rotation"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-04-spinner.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-05",
    "title": "2006 AMC 8 Problem 5: Midpoint Square Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 5,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "Points A, B, C, and D are midpoints of the sides of the larger square. If the larger square has area 60, what is the area of the smaller square?",
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
        "text": "24"
      },
      {
        "label": "D",
        "text": "30"
      },
      {
        "label": "E",
        "text": "40"
      }
    ],
    "answer": "D",
    "shortAnswer": "30",
    "solutionSteps": [
      {
        "title": "Use midpoint geometry",
        "body": "Connecting the side midpoints forms a smaller square whose diagonals are the side lengths of the larger square."
      },
      {
        "title": "Compare areas",
        "body": "The four corner triangles together have the same area as the inner square, so the inner square is half the large square."
      },
      {
        "title": "Calculate",
        "body": "Half of 60 is 30."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the midpoint square",
        "narration": "Highlight the square formed by the four side midpoints.",
        "visualHint": "The inner diamond ABCD is shown inside the larger square."
      },
      {
        "title": "Match triangles",
        "narration": "The four corner triangles together match the area of the inner square.",
        "visualHint": "Corner triangles are paired with the inner square pieces."
      },
      {
        "title": "Take half",
        "narration": "The smaller square is half of 60.",
        "visualHint": "60/2=30; choice D is circled."
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
      "2006",
      "geometry",
      "area"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-05-midpoint-square.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-06",
    "title": "2006 AMC 8 Problem 6: Perimeter of a T",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Perimeter",
    "difficulty": 1,
    "statement": "The letter T is formed by placing two 2 × 4 inch rectangles next to each other, as shown. What is the perimeter of the T, in inches?",
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
        "text": "24"
      }
    ],
    "answer": "C",
    "shortAnswer": "20",
    "solutionSteps": [
      {
        "title": "Start with two separate rectangles",
        "body": "One 2 by 4 rectangle has perimeter 2(2+4)=12, so two separate rectangles have perimeter 24."
      },
      {
        "title": "Remove the shared edge",
        "body": "When joined, the shared length 2 is counted twice in the separate perimeters, so subtract 4."
      },
      {
        "title": "Compute",
        "body": "24−4=20."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "geometry",
      "perimeter"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-06-t-rectangles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-07",
    "title": "2006 AMC 8 Problem 7: Circle Radii",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 7,
    "category": "Geometry",
    "subcategory": "Circle formulas",
    "difficulty": 2,
    "statement": "Circle X has a radius of π. Circle Y has a circumference of 8π. Circle Z has an area of 9π. List the circles in order from smallest to largest radius.",
    "choices": [
      {
        "label": "A",
        "text": "X, Y, Z"
      },
      {
        "label": "B",
        "text": "Z, X, Y"
      },
      {
        "label": "C",
        "text": "Y, X, Z"
      },
      {
        "label": "D",
        "text": "Z, Y, X"
      },
      {
        "label": "E",
        "text": "X, Z, Y"
      }
    ],
    "answer": "B",
    "shortAnswer": "Z, X, Y",
    "solutionSteps": [
      {
        "title": "Find Y's radius",
        "body": "For circle Y, 2πr=8π, so r=4."
      },
      {
        "title": "Find Z's radius",
        "body": "For circle Z, πr²=9π, so r=3."
      },
      {
        "title": "Compare with X",
        "body": "Circle X has radius π, which is between 3 and 4. The order is Z, X, Y."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "geometry",
      "circles"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-08",
    "title": "2006 AMC 8 Problem 8: Radio Survey Table",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 8,
    "category": "Algebra",
    "subcategory": "Tables and percentages",
    "difficulty": 2,
    "statement": "The table shows some of the results of a survey by radio station KACL. What percentage of the males surveyed listen to the station?",
    "choices": [
      {
        "label": "A",
        "text": "39"
      },
      {
        "label": "B",
        "text": "48"
      },
      {
        "label": "C",
        "text": "52"
      },
      {
        "label": "D",
        "text": "55"
      },
      {
        "label": "E",
        "text": "75"
      }
    ],
    "answer": "E",
    "shortAnswer": "75%",
    "solutionSteps": [
      {
        "title": "Find male listeners",
        "body": "Total listeners are 136 and female listeners are 58, so male listeners are 136−58=78."
      },
      {
        "title": "Find total males",
        "body": "Males consist of 78 listeners and 26 non-listeners, for a total of 104 males."
      },
      {
        "title": "Convert to a percent",
        "body": "78/104=3/4=75%."
      }
    ],
    "animationFrames": [
      {
        "title": "Fill the missing table values",
        "narration": "Use row and column totals to find male listeners and total males.",
        "visualHint": "136−58=78 and 78+26=104 are filled into the table."
      },
      {
        "title": "Form the percentage",
        "narration": "Divide male listeners by total males.",
        "visualHint": "78/104 simplifies to 3/4."
      },
      {
        "title": "Convert to percent",
        "narration": "Three-fourths is 75%.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "percent",
      "table"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-08-radio-table.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-09",
    "title": "2006 AMC 8 Problem 9: Telescoping Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 2,
    "statement": "What is the product of 3/2 × 4/3 × 5/4 × ⋯ × 2006/2005?",
    "choices": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "1002"
      },
      {
        "label": "C",
        "text": "1003"
      },
      {
        "label": "D",
        "text": "2005"
      },
      {
        "label": "E",
        "text": "2006"
      }
    ],
    "answer": "C",
    "shortAnswer": "1003",
    "solutionSteps": [
      {
        "title": "Look for cancellation",
        "body": "Each denominator cancels with the previous or next numerator."
      },
      {
        "title": "Keep only the endpoints",
        "body": "Everything cancels except 2006 in the numerator and 2 in the denominator."
      },
      {
        "title": "Compute",
        "body": "2006/2=1003."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "fractions",
      "telescoping"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-10",
    "title": "2006 AMC 8 Problem 10: Rectangle Area Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Graphs",
    "difficulty": 2,
    "statement": "Jorge's teacher asks him to plot all the ordered pairs (w,l) of positive integers for which w is the width and l is the length of a rectangle with area 12. What should his graph look like?",
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
        "title": "Write the area relationship",
        "body": "A rectangle with area 12 satisfies wl=12."
      },
      {
        "title": "Solve for l",
        "body": "The length is l=12/w, so as w increases, l decreases."
      },
      {
        "title": "Match the graph",
        "body": "Only graph A shows this inverse relationship using positive integer points."
      }
    ],
    "animationFrames": [
      {
        "title": "Plot factor pairs",
        "narration": "Show pairs such as (1,12), (2,6), (3,4), (4,3), (6,2), and (12,1).",
        "visualHint": "Dots trace a decreasing pattern."
      },
      {
        "title": "Explain the inverse pattern",
        "narration": "If the width gets larger, the length must get smaller to keep area 12.",
        "visualHint": "l=12/w appears."
      },
      {
        "title": "Choose graph A",
        "narration": "Graph A matches the decreasing curve of factor pairs.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "graphs",
      "factors"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-10-graph-choices.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-11",
    "title": "2006 AMC 8 Problem 11: Digit Sums",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 11,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 3,
    "statement": "How many two-digit numbers have digits whose sum is a perfect square?",
    "choices": [
      {
        "label": "A",
        "text": "13"
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
        "text": "19"
      }
    ],
    "answer": "C",
    "shortAnswer": "17",
    "solutionSteps": [
      {
        "title": "List possible square sums",
        "body": "Two digits can sum to at most 18, so the possible positive square sums are 1, 4, 9, and 16."
      },
      {
        "title": "Count each case",
        "body": "There is 1 number with digit sum 1, 4 numbers with digit sum 4, 9 with digit sum 9, and 3 with digit sum 16."
      },
      {
        "title": "Add",
        "body": "1+4+9+3=17."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "number theory",
      "digits"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-12",
    "title": "2006 AMC 8 Problem 12: Combined Test Score",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Weighted average",
    "difficulty": 2,
    "statement": "Antonette gets 70% on a 10-problem test, 80% on a 20-problem test, and 90% on a 30-problem test. If the three tests are combined into one 60-problem test, which percent is closest to her overall score?",
    "choices": [
      {
        "label": "A",
        "text": "40"
      },
      {
        "label": "B",
        "text": "77"
      },
      {
        "label": "C",
        "text": "80"
      },
      {
        "label": "D",
        "text": "83"
      },
      {
        "label": "E",
        "text": "87"
      }
    ],
    "answer": "D",
    "shortAnswer": "83",
    "solutionSteps": [
      {
        "title": "Find correct answers",
        "body": "70% of 10 is 7, 80% of 20 is 16, and 90% of 30 is 27."
      },
      {
        "title": "Add correct answers",
        "body": "Antonette got 7+16+27=50 correct out of 60."
      },
      {
        "title": "Convert to percent",
        "body": "50/60≈83.3%, so the closest choice is 83."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
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
      "2006",
      "percent",
      "weighted average"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-13",
    "title": "2006 AMC 8 Problem 13: Two Bikers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 13,
    "category": "Algebra",
    "subcategory": "Distance-rate-time",
    "difficulty": 3,
    "statement": "Cassie leaves Escanaba at 8:30 AM heading for Marquette on her bike. She bikes at a uniform rate of 12 miles per hour. Brian leaves Marquette at 9:00 AM heading for Escanaba on his bike. He bikes at a uniform rate of 16 miles per hour. They both bike on the same 62-mile route between Escanaba and Marquette. At what time in the morning do they meet?",
    "choices": [
      {
        "label": "A",
        "text": "10:00"
      },
      {
        "label": "B",
        "text": "10:15"
      },
      {
        "label": "C",
        "text": "10:30"
      },
      {
        "label": "D",
        "text": "11:00"
      },
      {
        "label": "E",
        "text": "11:30"
      }
    ],
    "answer": "D",
    "shortAnswer": "11:00",
    "solutionSteps": [
      {
        "title": "Account for Cassie's head start",
        "body": "By 9:00 AM, Cassie has ridden 0.5×12=6 miles, leaving 62−6=56 miles between them."
      },
      {
        "title": "Use combined speed",
        "body": "Together they close the distance at 12+16=28 miles per hour."
      },
      {
        "title": "Find the meeting time",
        "body": "56/28=2 hours after 9:00 AM, so they meet at 11:00 AM."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "rates",
      "distance"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-14",
    "title": "2006 AMC 8 Problem 14: Reading Time Difference",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 14,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 2,
    "statement": "Problems 14, 15 and 16 involve Mrs. Reed's English assignment. The students in Mrs. Reed's English class are reading the same 760-page novel. Alice reads a page in 20 seconds, Bob reads a page in 45 seconds and Chandra reads a page in 30 seconds. If Bob and Chandra both read the whole book, Bob will spend how many more seconds reading than Chandra?",
    "choices": [
      {
        "label": "A",
        "text": "7,600"
      },
      {
        "label": "B",
        "text": "11,400"
      },
      {
        "label": "C",
        "text": "12,500"
      },
      {
        "label": "D",
        "text": "15,200"
      },
      {
        "label": "E",
        "text": "22,800"
      }
    ],
    "answer": "B",
    "shortAnswer": "11,400",
    "solutionSteps": [
      {
        "title": "Compare seconds per page",
        "body": "Bob takes 45 seconds per page and Chandra takes 30 seconds per page, a difference of 15 seconds per page."
      },
      {
        "title": "Apply to 760 pages",
        "body": "Over 760 pages, the time difference is 760×15=11,400 seconds."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "rates",
      "reading"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-15",
    "title": "2006 AMC 8 Problem 15: Team Reading Split",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 3,
    "statement": "Problems 14, 15 and 16 involve Mrs. Reed's English assignment. The students are reading the same 760-page novel. Alice reads a page in 20 seconds, Bob in 45 seconds and Chandra in 30 seconds. Chandra and Bob team read the novel: Chandra reads from page 1 to a certain page and Bob reads from the next page through page 760. What is the last page that Chandra should read so that they spend the same amount of time reading?",
    "choices": [
      {
        "label": "A",
        "text": "425"
      },
      {
        "label": "B",
        "text": "444"
      },
      {
        "label": "C",
        "text": "456"
      },
      {
        "label": "D",
        "text": "484"
      },
      {
        "label": "E",
        "text": "506"
      }
    ],
    "answer": "C",
    "shortAnswer": "456",
    "solutionSteps": [
      {
        "title": "Compare their reading speeds",
        "body": "Chandra takes 30 seconds per page and Bob takes 45 seconds per page. For equal time, Bob reads 2 pages for every 3 pages Chandra reads."
      },
      {
        "title": "Use the 3:2 page ratio",
        "body": "Chandra should read 3/(3+2)=3/5 of the book."
      },
      {
        "title": "Compute pages",
        "body": "(3/5)×760=456, so Chandra should finish page 456."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "rates",
      "ratio"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-16",
    "title": "2006 AMC 8 Problem 16: Three-Person Team Reading",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 16,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 3,
    "statement": "Problems 14, 15 and 16 involve Mrs. Reed's English assignment. The students are reading the same 760-page novel. Alice reads a page in 20 seconds, Bob in 45 seconds and Chandra in 30 seconds. Before Chandra and Bob start reading, Alice says she would like to team read with them. If they divide the book into three sections so that each reads for the same length of time, how many seconds will each have to read?",
    "choices": [
      {
        "label": "A",
        "text": "6400"
      },
      {
        "label": "B",
        "text": "6600"
      },
      {
        "label": "C",
        "text": "6800"
      },
      {
        "label": "D",
        "text": "7000"
      },
      {
        "label": "E",
        "text": "7200"
      }
    ],
    "answer": "E",
    "shortAnswer": "7200",
    "solutionSteps": [
      {
        "title": "Use reading speeds",
        "body": "In the same amount of time, the page counts are inversely proportional to seconds per page: Alice:Chandra:Bob = 1/20:1/30:1/45."
      },
      {
        "title": "Simplify the ratio",
        "body": "The ratio is 9:6:4, so Bob reads 4/(9+6+4)=4/19 of 760 pages, which is 160 pages."
      },
      {
        "title": "Find the equal time",
        "body": "Bob takes 45 seconds per page, so 160×45=7200 seconds."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "rates",
      "ratio"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-17",
    "title": "2006 AMC 8 Problem 17: Spinner Sum Parity",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 17,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "Jeff rotates spinners P, Q, and R and adds the resulting numbers. What is the probability that his sum is an odd number?",
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
    "answer": "B",
    "shortAnswer": "1/3",
    "solutionSteps": [
      {
        "title": "Use parity",
        "body": "Spinner Q always lands on an even number, and spinner R always lands on an odd number."
      },
      {
        "title": "Decide what P must be",
        "body": "Even + odd is odd, so P must also be even to make the total odd."
      },
      {
        "title": "Find the probability",
        "body": "Spinner P has one even sector, 2, out of three equal sectors, so the probability is 1/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Classify each spinner",
        "narration": "Mark Q as always even and R as always odd.",
        "visualHint": "Q sectors are all even; R sectors are all odd."
      },
      {
        "title": "Find what P needs",
        "narration": "Even plus odd is odd, so P must be even.",
        "visualHint": "The number 2 on spinner P is highlighted."
      },
      {
        "title": "Compute probability",
        "narration": "Only one of the three equal sectors on P works.",
        "visualHint": "1 out of 3 sectors; choice B is circled."
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
      "2006",
      "probability",
      "parity"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-17-spinners.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-18",
    "title": "2006 AMC 8 Problem 18: Surface Area of Painted Cube",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 18,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 3,
    "statement": "A cube with 3-inch edges is made using 27 cubes with 1-inch edges. Nineteen of the smaller cubes are white and eight are black. If the eight black cubes are placed at the corners of the larger cube, what fraction of the surface area of the larger cube is white?",
    "choices": [
      {
        "label": "A",
        "text": "1/9"
      },
      {
        "label": "B",
        "text": "1/4"
      },
      {
        "label": "C",
        "text": "4/9"
      },
      {
        "label": "D",
        "text": "5/9"
      },
      {
        "label": "E",
        "text": "19/27"
      }
    ],
    "answer": "D",
    "shortAnswer": "5/9",
    "solutionSteps": [
      {
        "title": "Find total outer faces",
        "body": "A 3 by 3 by 3 cube has surface area 6×3×3=54 unit-square faces."
      },
      {
        "title": "Count black outer faces",
        "body": "Each corner cube shows 3 outer faces, and there are 8 black corner cubes, so 8×3=24 outer faces are black."
      },
      {
        "title": "Find the white fraction",
        "body": "The remaining 54−24=30 faces are white, and 30/54=5/9."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "geometry",
      "surface area"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-19",
    "title": "2006 AMC 8 Problem 19: Congruent Triangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Congruence",
    "difficulty": 3,
    "statement": "Triangle ABC is an isosceles triangle with AB = BC. Point D is the midpoint of both BC and AE, and CE is 11 units long. Triangle ABD is congruent to triangle ECD. What is the length of BD?",
    "choices": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "4.5"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "5.5"
      },
      {
        "label": "E",
        "text": "6"
      }
    ],
    "answer": "D",
    "shortAnswer": "5.5",
    "solutionSteps": [
      {
        "title": "Use congruence",
        "body": "Since triangle ABD is congruent to triangle ECD and CE=11, the corresponding side AB is also 11."
      },
      {
        "title": "Use the isosceles condition",
        "body": "AB=BC, so BC=11."
      },
      {
        "title": "Use midpoint D",
        "body": "D is the midpoint of BC, so BD=BC/2=11/2=5.5."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2006",
      "geometry",
      "congruence"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-19-congruent-triangles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-20",
    "title": "2006 AMC 8 Problem 20: Tournament Wins",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 20,
    "category": "Counting & Probability",
    "subcategory": "Counting games",
    "difficulty": 3,
    "statement": "A singles tournament had six players. Each player played every other player only once, with no ties. If Helen won 4 games, Ines won 3 games, Janet won 2 games, Kendra won 2 games and Lara won 2 games, how many games did Monica win?",
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
    "answer": "C",
    "shortAnswer": "2",
    "solutionSteps": [
      {
        "title": "Count total games",
        "body": "With 6 players and each pair playing once, the total number of games is 6×5/2=15."
      },
      {
        "title": "Count known wins",
        "body": "The known players won 4+3+2+2+2=13 games."
      },
      {
        "title": "Find Monica's wins",
        "body": "Every game has one winner, so Monica won 15−13=2 games."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "counting",
      "tournament"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-21",
    "title": "2006 AMC 8 Problem 21: Aquarium Water Rise",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 21,
    "category": "Geometry",
    "subcategory": "Volume",
    "difficulty": 3,
    "statement": "An aquarium has a rectangular base that measures 100 cm by 40 cm and has a height of 50 cm. The aquarium is filled with water to a depth of 37 cm. A rock with volume 1000 cm^3 is then placed in the aquarium and completely submerged. By how many centimeters does the water level rise?",
    "choices": [
      {
        "label": "A",
        "text": "0.25"
      },
      {
        "label": "B",
        "text": "0.5"
      },
      {
        "label": "C",
        "text": "1"
      },
      {
        "label": "D",
        "text": "1.25"
      },
      {
        "label": "E",
        "text": "2.5"
      }
    ],
    "answer": "A",
    "shortAnswer": "0.25",
    "solutionSteps": [
      {
        "title": "Find the base area",
        "body": "The base area is 100×40=4000 square centimeters."
      },
      {
        "title": "Relate volume to height",
        "body": "A rise of h centimeters adds 4000h cubic centimeters of water volume."
      },
      {
        "title": "Use the rock volume",
        "body": "4000h=1000, so h=1000/4000=0.25 cm."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "geometry",
      "volume"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-22",
    "title": "2006 AMC 8 Problem 22: Number Pyramid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 22,
    "category": "Algebra",
    "subcategory": "Optimization",
    "difficulty": 4,
    "statement": "Three different one-digit positive integers are placed in the bottom row of cells. Numbers in adjacent cells are added and the sum is placed in the cell above them. In the second row, continue the same process to obtain a number in the top cell. What is the difference between the largest and smallest numbers possible in the top cell?",
    "choices": [
      {
        "label": "A",
        "text": "16"
      },
      {
        "label": "B",
        "text": "24"
      },
      {
        "label": "C",
        "text": "25"
      },
      {
        "label": "D",
        "text": "26"
      },
      {
        "label": "E",
        "text": "35"
      }
    ],
    "answer": "D",
    "shortAnswer": "26",
    "solutionSteps": [
      {
        "title": "Write the top value",
        "body": "If the bottom row is A, B, C, then the middle row is A+B and B+C, so the top is A+2B+C."
      },
      {
        "title": "Minimize",
        "body": "The center number counts twice, so put 1 in the center and 2 and 3 on the outside: 2+2(1)+3=7."
      },
      {
        "title": "Maximize and subtract",
        "body": "Put 9 in the center and 7 and 8 on the outside: 7+2(9)+8=33. The difference is 33−7=26."
      }
    ],
    "animationFrames": [
      {
        "title": "Build the formula",
        "narration": "Let the bottom row be A, B, C and add upward.",
        "visualHint": "The top cell becomes A+2B+C."
      },
      {
        "title": "Make the smallest top",
        "narration": "Because the center is counted twice, place 1 in the center for the minimum.",
        "visualHint": "2,1,3 gives top 7."
      },
      {
        "title": "Make the largest top",
        "narration": "Place 9 in the center for the maximum.",
        "visualHint": "7,9,8 gives top 33, and 33−7=26."
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
      "2006",
      "algebra",
      "optimization"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-22-number-pyramid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-23",
    "title": "2006 AMC 8 Problem 23: Gold Coin Remainders",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 23,
    "category": "Number Theory",
    "subcategory": "Remainders",
    "difficulty": 4,
    "statement": "A box contains gold coins. If the coins are equally divided among six people, four coins are left over. If the coins are equally divided among five people, three coins are left over. If the box holds the smallest number of coins that meets these two conditions, how many coins are left when equally divided among seven people?",
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
        "text": "5"
      }
    ],
    "answer": "A",
    "shortAnswer": "0",
    "solutionSteps": [
      {
        "title": "Notice the common pattern",
        "body": "The number leaves remainder 4 when divided by 6 and remainder 3 when divided by 5. In both cases, adding 2 makes it divisible."
      },
      {
        "title": "Use the least common multiple",
        "body": "The smallest positive number divisible by both 6 and 5 is 30, so the smallest coin count is 30−2=28."
      },
      {
        "title": "Divide by 7",
        "body": "28 is divisible by 7, so the remainder is 0."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
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
      "2006",
      "number theory",
      "remainders"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2006-24",
    "title": "2006 AMC 8 Problem 24: Letter Multiplication",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 24,
    "category": "Number Theory",
    "subcategory": "Digit puzzle",
    "difficulty": 4,
    "statement": "In the multiplication problem ABA × CD = CDCD, A, B, C, and D are different digits. What is A+B?",
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
    "answer": "A",
    "shortAnswer": "1",
    "solutionSteps": [
      {
        "title": "Factor the product",
        "body": "CDCD is 101 times the two-digit number CD."
      },
      {
        "title": "Compare factors",
        "body": "Since ABA × CD = 101 × CD, and CD is nonzero, ABA=101."
      },
      {
        "title": "Read off A and B",
        "body": "ABA=101 means A=1 and B=0, so A+B=1."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key numbers and what is being asked.",
        "visualHint": "The important quantities are highlighted."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main relationship to simplify the problem.",
        "visualHint": "The relevant equation, count, or diagram relationship is shown."
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
      "2006",
      "number theory",
      "digit puzzle"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-24-multiplication.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2006-25",
    "title": "2006 AMC 8 Problem 25: Hidden Prime Cards",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2006,
    "problemNumber": 25,
    "category": "Number Theory",
    "subcategory": "Prime numbers",
    "difficulty": 5,
    "statement": "Barry wrote 6 different numbers, one on each side of 3 cards, and laid the cards on a table, as shown. The sums of the two numbers on each of the three cards are equal. The three numbers on the hidden sides are prime numbers. What is the average of the hidden prime numbers?",
    "choices": [
      {
        "label": "A",
        "text": "13"
      },
      {
        "label": "B",
        "text": "14"
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
        "text": "17"
      }
    ],
    "answer": "B",
    "shortAnswer": "14",
    "solutionSteps": [
      {
        "title": "Use parity",
        "body": "The visible numbers 44 and 38 are even, while 59 is odd. To make the common sum work with three different primes, the hidden prime behind 59 must be the only even prime, 2."
      },
      {
        "title": "Find the common sum",
        "body": "The common sum is 59+2=61."
      },
      {
        "title": "Find the other hidden primes",
        "body": "The hidden numbers are 61−44=17 and 61−38=23."
      },
      {
        "title": "Average",
        "body": "The average is (2+17+23)/3=42/3=14."
      }
    ],
    "animationFrames": [
      {
        "title": "Show the cards",
        "narration": "Display the visible numbers 44, 59, and 38.",
        "visualHint": "Three cards show 44, 59, and 38."
      },
      {
        "title": "Use parity",
        "narration": "Since 59 is odd, the hidden prime on that card must be 2 to create an odd common sum.",
        "visualHint": "59+2=61 is shown as the common sum."
      },
      {
        "title": "Reveal the hidden primes",
        "narration": "Subtract the visible numbers from 61 to find 17 and 23, then average.",
        "visualHint": "2, 17, and 23 average to 14; choice B is circled."
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
      "2006",
      "number theory",
      "prime numbers"
    ],
    "sourceName": "2006 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2006/problem-25-prime-cards.svg"
    ],
    "needsDiagram": true
  }
];



const amc2007Problems: Problem[] = [
  {
    "id": "amc8-2007-01",
    "title": "2007 AMC 8 Problem 1: Final Week Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 1,
    "statement": "Theresa's parents have agreed to buy her tickets to see her favorite band if she spends an average of 10 hours per week helping around the house for 6 weeks. For the first 5 weeks she helps around the house for 8, 11, 7, 12, and 10 hours. How many hours must she work for the final week to earn the tickets?",
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
        "text": "11"
      },
      {
        "label": "D",
        "text": "12"
      },
      {
        "label": "E",
        "text": "13"
      }
    ],
    "answer": "D",
    "shortAnswer": "12",
    "solutionSteps": [
      {
        "title": "Find the total required hours",
        "body": "To average 10 hours for 6 weeks, Theresa needs 10 × 6 = 60 total hours.",
        "equation": "10\\times 6=60"
      },
      {
        "title": "Add the first five weeks",
        "body": "Her first five weeks total 8 + 11 + 7 + 12 + 10 = 48 hours.",
        "equation": "8+11+7+12+10=48"
      },
      {
        "title": "Find the final week",
        "body": "She still needs 60 − 48 = 12 hours, so the answer is D.",
        "equation": "60-48=12"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "algebra",
      "average",
      "arithmetic"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-02",
    "title": "2007 AMC 8 Problem 2: Pasta Bar Graph Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 2,
    "category": "Other",
    "subcategory": "Bar graphs",
    "difficulty": 1,
    "statement": "650 students were surveyed about their pasta preferences. The choices were lasagna, manicotti, ravioli and spaghetti. The results of the survey are displayed in the bar graph. What is the ratio of the number of students who preferred spaghetti to the number of students who preferred manicotti?",
    "choices": [
      {
        "label": "A",
        "text": "2/5"
      },
      {
        "label": "B",
        "text": "1/2"
      },
      {
        "label": "C",
        "text": "5/4"
      },
      {
        "label": "D",
        "text": "5/3"
      },
      {
        "label": "E",
        "text": "5/2"
      }
    ],
    "answer": "E",
    "shortAnswer": "5/2",
    "solutionSteps": [
      {
        "title": "Read the bars",
        "body": "The spaghetti bar is 250 students, and the manicotti bar is 100 students.",
        "equation": "spaghetti=250,\\ manicotti=100"
      },
      {
        "title": "Make the ratio",
        "body": "The requested ratio is spaghetti to manicotti, so use 250/100.",
        "equation": "250:100"
      },
      {
        "title": "Simplify",
        "body": "Divide both numbers by 50 to get 5:2, so the ratio is 5/2.",
        "equation": "250/100=5/2"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "data",
      "bar graph",
      "ratio"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-02-pasta-bar-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-03",
    "title": "2007 AMC 8 Problem 3: Prime Factors of 250",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 3,
    "category": "Number Theory",
    "subcategory": "Prime factorization",
    "difficulty": 1,
    "statement": "What is the sum of the two smallest prime factors of 250?",
    "choices": [
      {
        "label": "A",
        "text": "2"
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
        "text": "10"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "C",
    "shortAnswer": "7",
    "solutionSteps": [
      {
        "title": "Factor 250",
        "body": "Break 250 into prime factors.",
        "equation": "250=2\\times5^3"
      },
      {
        "title": "Identify the two smallest prime factors",
        "body": "The distinct prime factors are 2 and 5.",
        "equation": "2,5"
      },
      {
        "title": "Add them",
        "body": "Their sum is 2 + 5 = 7.",
        "equation": "2+5=7"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "number theory",
      "prime factors"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-04",
    "title": "2007 AMC 8 Problem 4: Ghost Windows",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 4,
    "category": "Counting & Probability",
    "subcategory": "Counting choices",
    "difficulty": 1,
    "statement": "A haunted house has six windows. In how many ways can Georgie the Ghost enter the house by one window and leave by a different window?",
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
        "text": "30"
      },
      {
        "label": "E",
        "text": "36"
      }
    ],
    "answer": "D",
    "shortAnswer": "30",
    "solutionSteps": [
      {
        "title": "Choose an entrance",
        "body": "There are 6 choices for the window Georgie enters."
      },
      {
        "title": "Choose a different exit",
        "body": "After choosing the entrance, 5 windows remain for the exit."
      },
      {
        "title": "Multiply",
        "body": "There are 6 × 5 = 30 possible enter-exit choices.",
        "equation": "6\\times5=30"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "counting",
      "multiplication principle"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-05",
    "title": "2007 AMC 8 Problem 5: Saving for a Bike",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Linear equations",
    "difficulty": 1,
    "statement": "Chandler wants to buy a 500 dollar mountain bike. For his birthday, his grandparents send him 50 dollars, his aunt sends him 35 dollars and his cousin gives him 15 dollars. He earns 16 dollars per week for his paper route. He will use all of his birthday money and all of the money he earns from his paper route. In how many weeks will he be able to buy the mountain bike?",
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
        "text": "26"
      },
      {
        "label": "D",
        "text": "27"
      },
      {
        "label": "E",
        "text": "28"
      }
    ],
    "answer": "B",
    "shortAnswer": "25",
    "solutionSteps": [
      {
        "title": "Add birthday money",
        "body": "His birthday money is 50 + 35 + 15 = 100 dollars.",
        "equation": "50+35+15=100"
      },
      {
        "title": "Find the remaining amount",
        "body": "He needs 500 − 100 = 400 more dollars.",
        "equation": "500-100=400"
      },
      {
        "title": "Divide by weekly earnings",
        "body": "At 16 dollars per week, he needs 400 ÷ 16 = 25 weeks.",
        "equation": "400/16=25"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "algebra",
      "linear equations",
      "arithmetic"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-06",
    "title": "2007 AMC 8 Problem 6: Long-Distance Call Cost Decrease",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 6,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 2,
    "statement": "The average cost of a long-distance call in the USA in 1985 was 41 cents per minute, and the average cost of a long-distance call in the USA in 2005 was 7 cents per minute. Find the approximate percent decrease in the cost per minute of a long-distance call.",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "17"
      },
      {
        "label": "C",
        "text": "34"
      },
      {
        "label": "D",
        "text": "41"
      },
      {
        "label": "E",
        "text": "80"
      }
    ],
    "answer": "E",
    "shortAnswer": "80",
    "solutionSteps": [
      {
        "title": "Find the decrease",
        "body": "The cost decreased by 41 − 7 = 34 cents.",
        "equation": "41-7=34"
      },
      {
        "title": "Compare to the original",
        "body": "Percent decrease uses the original cost, so compute 34/41.",
        "equation": "34/41\\approx0.83"
      },
      {
        "title": "Choose the closest percent",
        "body": "0.83 is about 83%, so the closest choice is 80%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "algebra",
      "percents"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-07",
    "title": "2007 AMC 8 Problem 7: Age Average After Someone Leaves",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 2,
    "statement": "The average age of 5 people in a room is 30 years. An 18-year-old person leaves the room. What is the average age of the four remaining people?",
    "choices": [
      {
        "label": "A",
        "text": "25"
      },
      {
        "label": "B",
        "text": "26"
      },
      {
        "label": "C",
        "text": "29"
      },
      {
        "label": "D",
        "text": "33"
      },
      {
        "label": "E",
        "text": "36"
      }
    ],
    "answer": "D",
    "shortAnswer": "33",
    "solutionSteps": [
      {
        "title": "Find the original total age",
        "body": "Five people with average age 30 have total age 5 × 30 = 150.",
        "equation": "5\\times30=150"
      },
      {
        "title": "Remove the 18-year-old",
        "body": "The remaining total is 150 − 18 = 132.",
        "equation": "150-18=132"
      },
      {
        "title": "Average the remaining four",
        "body": "132 ÷ 4 = 33, so the new average is 33 years.",
        "equation": "132/4=33"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
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
      "2007",
      "algebra",
      "average"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-08",
    "title": "2007 AMC 8 Problem 8: Trapezoid Triangle Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "In trapezoid ABCD, AD is perpendicular to DC, AD = AB = 3, and DC = 6. In addition, E is on DC, and BE is parallel to AD. Find the area of triangle BEC.",
    "choices": [
      {
        "label": "A",
        "text": "3"
      },
      {
        "label": "B",
        "text": "4.5"
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
        "text": "18"
      }
    ],
    "answer": "B",
    "shortAnswer": "4.5",
    "solutionSteps": [
      {
        "title": "Recognize the square",
        "body": "Since AD = AB = 3 and BE is parallel to AD, ABED is a 3 by 3 square."
      },
      {
        "title": "Find EC",
        "body": "The whole base DC is 6, and DE is 3, so EC = 3.",
        "equation": "EC=6-3=3"
      },
      {
        "title": "Use triangle area",
        "body": "Triangle BEC has base EC = 3 and height BE = 3, so its area is 1/2 × 3 × 3 = 4.5.",
        "equation": "\\frac12\\cdot3\\cdot3=4.5"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "geometry",
      "area",
      "trapezoid"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-08-trapezoid-bec.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-09",
    "title": "2007 AMC 8 Problem 9: Four-by-Four Digit Grid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 9,
    "category": "Logic",
    "subcategory": "Latin square",
    "difficulty": 2,
    "statement": "To complete the grid below, each of the digits 1 through 4 must occur once in each row and once in each column. What number will occupy the lower right-hand square?",
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
        "text": "cannot be determined"
      }
    ],
    "answer": "B",
    "shortAnswer": "2",
    "solutionSteps": [
      {
        "title": "Use column restrictions",
        "body": "The first row already has 1 and 2, and the second column already has 3, forcing the top-right part of the grid."
      },
      {
        "title": "Complete the last column",
        "body": "The last column must contain 1, 2, 3, and 4 exactly once."
      },
      {
        "title": "Determine the lower-right square",
        "body": "After the forced placements, the lower-right square must be 2."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "logic",
      "grid",
      "deduction"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-09-latin-square-grid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-10",
    "title": "2007 AMC 8 Problem 10: Nested Factor-Sum Function",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 10,
    "category": "Number Theory",
    "subcategory": "Divisors",
    "difficulty": 2,
    "statement": "For any positive integer n, define [n] to be the sum of the positive factors of n. For example, [6] = 1 + 2 + 3 + 6 = 12. Find [[11]].",
    "choices": [
      {
        "label": "A",
        "text": "13"
      },
      {
        "label": "B",
        "text": "20"
      },
      {
        "label": "C",
        "text": "24"
      },
      {
        "label": "D",
        "text": "28"
      },
      {
        "label": "E",
        "text": "30"
      }
    ],
    "answer": "D",
    "shortAnswer": "28",
    "solutionSteps": [
      {
        "title": "Evaluate the inner expression",
        "body": "Since 11 is prime, its positive factors are 1 and 11, so [11] = 12.",
        "equation": "[11]=1+11=12"
      },
      {
        "title": "Evaluate the outer expression",
        "body": "Now find [12] by adding all positive factors of 12.",
        "equation": "[12]=1+2+3+4+6+12"
      },
      {
        "title": "Add",
        "body": "The sum is 28, so [[11]] = 28.",
        "equation": "1+2+3+4+6+12=28"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "number theory",
      "factors",
      "functions"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-11",
    "title": "2007 AMC 8 Problem 11: Tile Matching",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 11,
    "category": "Logic",
    "subcategory": "Spatial reasoning",
    "difficulty": 3,
    "statement": "Tiles I, II, III and IV are translated so one tile coincides with each of the rectangles A, B, C and D. In the final arrangement, the two numbers on any side common to two adjacent tiles must be the same. Which of the tiles is translated to rectangle C?",
    "choices": [
      {
        "label": "A",
        "text": "I"
      },
      {
        "label": "B",
        "text": "II"
      },
      {
        "label": "C",
        "text": "III"
      },
      {
        "label": "D",
        "text": "IV"
      },
      {
        "label": "E",
        "text": "cannot be determined"
      }
    ],
    "answer": "D",
    "shortAnswer": "IV",
    "solutionSteps": [
      {
        "title": "Start with unique numbers",
        "body": "Tile III has a 0 and a 5, which do not match any other outside edge except in one forced position."
      },
      {
        "title": "Place Tile III",
        "body": "Tile III must go in rectangle D so its unmatched 0 and 5 face the outside."
      },
      {
        "title": "Match the left edge",
        "body": "Tile III has 1 on its left edge, so the tile in rectangle C must have 1 on its right edge. That tile is IV."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2007",
      "logic",
      "spatial reasoning",
      "matching"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-11-tile-matching.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-12",
    "title": "2007 AMC 8 Problem 12: Hexagram Area Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 12,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "A unit hexagram is composed of a regular hexagon of side length 1 and its 6 equilateral triangular extensions, as shown in the diagram. What is the ratio of the area of the extensions to the area of the original hexagon?",
    "choices": [
      {
        "label": "A",
        "text": "1:1"
      },
      {
        "label": "B",
        "text": "6:5"
      },
      {
        "label": "C",
        "text": "3:2"
      },
      {
        "label": "D",
        "text": "2:1"
      },
      {
        "label": "E",
        "text": "3:1"
      }
    ],
    "answer": "A",
    "shortAnswer": "1:1",
    "solutionSteps": [
      {
        "title": "Split the hexagon",
        "body": "A regular hexagon of side length 1 can be divided into 6 congruent equilateral triangles."
      },
      {
        "title": "Compare to the extensions",
        "body": "Each extension is also an equilateral triangle with side length 1."
      },
      {
        "title": "Compare total areas",
        "body": "There are 6 extension triangles and 6 congruent triangles inside the hexagon, so the areas are equal: 1:1."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "geometry",
      "area",
      "hexagon"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-12-hexagram.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-13",
    "title": "2007 AMC 8 Problem 13: Equal Venn Sets",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 13,
    "category": "Counting & Probability",
    "subcategory": "Sets",
    "difficulty": 3,
    "statement": "Sets A and B, shown in the Venn diagram, have the same number of elements. Their union has 2007 elements and their intersection has 1001 elements. Find the number of elements in A.",
    "choices": [
      {
        "label": "A",
        "text": "503"
      },
      {
        "label": "B",
        "text": "1006"
      },
      {
        "label": "C",
        "text": "1504"
      },
      {
        "label": "D",
        "text": "1507"
      },
      {
        "label": "E",
        "text": "1510"
      }
    ],
    "answer": "C",
    "shortAnswer": "1504",
    "solutionSteps": [
      {
        "title": "Let each set have x elements",
        "body": "Since A and B have the same number of elements, call each size x."
      },
      {
        "title": "Use the union formula",
        "body": "|A ∪ B| = |A| + |B| − |A ∩ B|, so 2007 = x + x − 1001.",
        "equation": "2007=2x-1001"
      },
      {
        "title": "Solve",
        "body": "2x = 3008, so x = 1504.",
        "equation": "x=1504"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "venn",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2007",
      "counting",
      "sets",
      "venn diagram"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-13-venn.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-14",
    "title": "2007 AMC 8 Problem 14: Isosceles Triangle Side",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 14,
    "category": "Geometry",
    "subcategory": "Pythagorean theorem",
    "difficulty": 3,
    "statement": "The base of isosceles triangle ABC is 24 and its area is 60. What is the length of one of the congruent sides?",
    "choices": [
      {
        "label": "A",
        "text": "5"
      },
      {
        "label": "B",
        "text": "8"
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
        "text": "18"
      }
    ],
    "answer": "C",
    "shortAnswer": "13",
    "solutionSteps": [
      {
        "title": "Find the height",
        "body": "Using area = 1/2 × base × height, 60 = 1/2 × 24 × h, so h = 5.",
        "equation": "60=12h\\Rightarrow h=5"
      },
      {
        "title": "Bisect the base",
        "body": "The altitude of an isosceles triangle splits the base 24 into two segments of length 12."
      },
      {
        "title": "Use the Pythagorean theorem",
        "body": "One congruent side is the hypotenuse of a right triangle with legs 5 and 12, so the side is 13.",
        "equation": "5^2+12^2=13^2"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "geometry",
      "pythagorean theorem",
      "area"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-14-isosceles-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-15",
    "title": "2007 AMC 8 Problem 15: Impossible Inequality",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Inequalities",
    "difficulty": 3,
    "statement": "Let a, b and c be numbers with 0 < a < b < c. Which of the following is impossible?",
    "choices": [
      {
        "label": "A",
        "text": "a + c < b"
      },
      {
        "label": "B",
        "text": "a · b < c"
      },
      {
        "label": "C",
        "text": "a + b < c"
      },
      {
        "label": "D",
        "text": "a · c < b"
      },
      {
        "label": "E",
        "text": "c / b = a"
      }
    ],
    "answer": "A",
    "shortAnswer": "a + c < b",
    "solutionSteps": [
      {
        "title": "Use the order",
        "body": "Since b < c and a is positive, adding a to c makes it even larger."
      },
      {
        "title": "Compare",
        "body": "Because c > b, we have a + c > b, not a + c < b.",
        "equation": "0<a,\\ b<c\\Rightarrow b<a+c"
      },
      {
        "title": "Conclude",
        "body": "So a + c < b is impossible."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "algebra",
      "inequalities"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-16",
    "title": "2007 AMC 8 Problem 16: Circle Circumference-Area Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 16,
    "category": "Algebra",
    "subcategory": "Graphs",
    "difficulty": 3,
    "statement": "Amanda Reckonwith draws five circles with radii 1, 2, 3, 4 and 5. Then for each circle she plots the point (C, A), where C is its circumference and A is its area. Which of the following could be her graph?",
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
    "answer": "A",
    "shortAnswer": "Graph A",
    "solutionSteps": [
      {
        "title": "Write the coordinates",
        "body": "For radius r, C = 2πr and A = πr²."
      },
      {
        "title": "Compare growth",
        "body": "The C-values grow evenly, but the A-values grow faster and faster because of r²."
      },
      {
        "title": "Choose the graph",
        "body": "The correct graph has evenly spaced x-values and increasingly spaced y-values, which is Graph A."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2007",
      "algebra",
      "graphs",
      "circles"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-16-circle-graph-options.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-17",
    "title": "2007 AMC 8 Problem 17: Paint Mixture Percent",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 2,
    "statement": "A mixture of 30 liters of paint is 25% red tint, 30% yellow tint and 45% water. Five liters of yellow tint are added to the original mixture. What is the percent of yellow tint in the new mixture?",
    "choices": [
      {
        "label": "A",
        "text": "25"
      },
      {
        "label": "B",
        "text": "35"
      },
      {
        "label": "C",
        "text": "40"
      },
      {
        "label": "D",
        "text": "45"
      },
      {
        "label": "E",
        "text": "50"
      }
    ],
    "answer": "C",
    "shortAnswer": "40",
    "solutionSteps": [
      {
        "title": "Find the original yellow tint",
        "body": "30% of 30 liters is 9 liters of yellow tint.",
        "equation": "0.30\\times30=9"
      },
      {
        "title": "Add yellow tint",
        "body": "After adding 5 liters, there are 14 liters of yellow tint."
      },
      {
        "title": "Find the new percent",
        "body": "The total mixture is 35 liters, so 14/35 = 40%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2007",
      "algebra",
      "percents",
      "mixtures"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-18",
    "title": "2007 AMC 8 Problem 18: Last Digits of a Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 18,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 3,
    "statement": "The product of the two 99-digit numbers 303,030,303,...,030,303 and 505,050,505,...,050,505 has thousands digit A and units digit B. What is the sum of A and B?",
    "choices": [
      {
        "label": "A",
        "text": "3"
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
        "text": "10"
      }
    ],
    "answer": "D",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Only the last four digits matter",
        "body": "To find the thousands and units digits of the product, it is enough to multiply the last four digits."
      },
      {
        "title": "Multiply",
        "body": "The relevant last parts are 0303 and 0505, so compute 303 × 505 = 153015.",
        "equation": "303\\times505=153015"
      },
      {
        "title": "Read the last four digits",
        "body": "The product ends in 3015, so A = 3 and B = 5. Their sum is 8.",
        "equation": "3+5=8"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "number theory",
      "digits",
      "multiplication"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-19",
    "title": "2007 AMC 8 Problem 19: Difference of Consecutive Squares",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 19,
    "category": "Number Theory",
    "subcategory": "Squares",
    "difficulty": 3,
    "statement": "Pick two consecutive positive integers whose sum is less than 100. Square both of those integers and then find the difference of the squares. Which of the following could be the difference?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "64"
      },
      {
        "label": "C",
        "text": "79"
      },
      {
        "label": "D",
        "text": "96"
      },
      {
        "label": "E",
        "text": "131"
      }
    ],
    "answer": "C",
    "shortAnswer": "79",
    "solutionSteps": [
      {
        "title": "Represent the integers",
        "body": "Let the consecutive integers be n and n + 1."
      },
      {
        "title": "Subtract the squares",
        "body": "The difference is (n + 1)² − n² = 2n + 1.",
        "equation": "(n+1)^2-n^2=2n+1"
      },
      {
        "title": "Use the restriction",
        "body": "Since n + (n + 1) < 100, the difference 2n + 1 is odd and less than 100. The only matching choice is 79."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "number theory",
      "squares",
      "consecutive integers"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-20",
    "title": "2007 AMC 8 Problem 20: Unicorns Season Record",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 20,
    "category": "Algebra",
    "subcategory": "Equations",
    "difficulty": 4,
    "statement": "Before district play, the Unicorns had won 45% of their basketball games. During district play, they won six more games and lost two, to finish the season having won half their games. How many games did the Unicorns play in all?",
    "choices": [
      {
        "label": "A",
        "text": "48"
      },
      {
        "label": "B",
        "text": "50"
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
        "text": "60"
      }
    ],
    "answer": "A",
    "shortAnswer": "48",
    "solutionSteps": [
      {
        "title": "Let x be games before district play",
        "body": "Before district play, the Unicorns had won 0.45x games."
      },
      {
        "title": "Add district play",
        "body": "They won 6 and lost 2, so they played x + 8 total games and won 0.45x + 6."
      },
      {
        "title": "Set final wins to half",
        "body": "Solve 0.45x + 6 = (x + 8)/2 to get x = 40, so the full season had 48 games.",
        "equation": "0.45x+6=\\frac{x+8}{2}\\Rightarrow x=40"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "algebra",
      "equations",
      "percent"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-21",
    "title": "2007 AMC 8 Problem 21: Winning Card Pair",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 21,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "Two cards are dealt from a deck of four red cards labeled A, B, C, D and four green cards labeled A, B, C, D. A winning pair is two of the same color or two of the same letter. What is the probability of drawing a winning pair?",
    "choices": [
      {
        "label": "A",
        "text": "2/7"
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
        "text": "4/7"
      },
      {
        "label": "E",
        "text": "5/8"
      }
    ],
    "answer": "D",
    "shortAnswer": "4/7",
    "solutionSteps": [
      {
        "title": "Fix the first card",
        "body": "After the first card is dealt, 7 cards remain."
      },
      {
        "title": "Count winning second cards",
        "body": "There are 3 cards with the same color and 1 card with the same letter."
      },
      {
        "title": "Find the probability",
        "body": "That gives 4 winning cards out of 7 remaining cards, so the probability is 4/7.",
        "equation": "4/7"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "probability",
      "cards",
      "counting"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-22",
    "title": "2007 AMC 8 Problem 22: Lemming Distance Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 22,
    "category": "Geometry",
    "subcategory": "Distance",
    "difficulty": 4,
    "statement": "A lemming sits at a corner of a square with side length 10 meters. The lemming runs 6.2 meters along a diagonal toward the opposite corner. It stops, makes a 90° right turn and runs 2 more meters. A scientist measures the shortest distance between the lemming and each side of the square. What is the average of these four distances in meters?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "4.5"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6.2"
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
        "title": "Use any point inside the square",
        "body": "For any point inside a 10 by 10 square, the distances to the left and right sides add to 10."
      },
      {
        "title": "Use the other direction",
        "body": "Similarly, the distances to the top and bottom sides also add to 10."
      },
      {
        "title": "Average the four distances",
        "body": "The four distances have total 20, so their average is 20 ÷ 4 = 5."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "geometry",
      "distance",
      "invariants"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-22-lemming-square.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-23",
    "title": "2007 AMC 8 Problem 23: Pinwheel Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 4,
    "statement": "What is the area of the shaded pinwheel shown in the 5 × 5 grid?",
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
        "title": "Start with the whole grid",
        "body": "The 5 by 5 grid has area 25."
      },
      {
        "title": "Count unshaded area",
        "body": "The unshaded area consists of four 1 by 1 corner squares and four triangles with total area 15, for a total of 19."
      },
      {
        "title": "Subtract",
        "body": "The shaded area is 25 − 19 = 6."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "geometry",
      "area",
      "grid"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-23-pinwheel-grid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2007-24",
    "title": "2007 AMC 8 Problem 24: Three-Digit Multiple of 3",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 24,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "A bag contains four pieces of paper, each labeled with one of the digits 1, 2, 3 or 4, with no repeats. Three of these pieces are drawn, one at a time without replacement, to construct a three-digit number. What is the probability that the three-digit number is a multiple of 3?",
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
    "answer": "C",
    "shortAnswer": "1/2",
    "solutionSteps": [
      {
        "title": "Use divisibility by 3",
        "body": "A number is divisible by 3 exactly when the sum of its digits is divisible by 3."
      },
      {
        "title": "Choose the digit sets",
        "body": "The possible sets are {1,2,3} and {2,3,4}. These occur when 4 or 1 is left out."
      },
      {
        "title": "Find the probability",
        "body": "Two of the four possible omitted digits work, so the probability is 2/4 = 1/2."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "probability",
      "divisibility",
      "digits"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2007-25",
    "title": "2007 AMC 8 Problem 25: Dartboard Odd Score",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2007,
    "problemNumber": 25,
    "category": "Counting & Probability",
    "subcategory": "Geometric probability",
    "difficulty": 5,
    "statement": "On the dart board shown in the figure below, the outer circle has radius 6 and the inner circle has radius 3. Three radii divide each circle into three congruent regions, with point values shown. The probability that a dart will hit a given region is proportional to the area of the region. When two darts hit this board, the score is the sum of the point values of the regions hit. What is the probability that the score is odd?",
    "choices": [
      {
        "label": "A",
        "text": "17/36"
      },
      {
        "label": "B",
        "text": "35/72"
      },
      {
        "label": "C",
        "text": "1/2"
      },
      {
        "label": "D",
        "text": "37/72"
      },
      {
        "label": "E",
        "text": "19/36"
      }
    ],
    "answer": "B",
    "shortAnswer": "35/72",
    "solutionSteps": [
      {
        "title": "Find one-dart probabilities",
        "body": "The inner circle has area 9π and the outer ring has area 27π, so each inner sector has area 3π and each outer sector has area 9π."
      },
      {
        "title": "Probability of hitting 1 or 2",
        "body": "The 1 regions have total area 21π, so P(1)=21/36=7/12. The 2 regions have total area 15π, so P(2)=5/12."
      },
      {
        "title": "Two darts give an odd sum",
        "body": "An odd sum needs one 1 and one 2, in either order: 2 × (7/12)(5/12) = 35/72.",
        "equation": "2\\cdot\\frac{7}{12}\\cdot\\frac{5}{12}=\\frac{35}{72}"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2007",
      "probability",
      "area",
      "dartboard"
    ],
    "sourceName": "2007 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2007/problem-25-dartboard.svg"
    ],
    "needsDiagram": true
  }
];

const amc2008Problems: Problem[] = [
  {
    "id": "amc8-2008-01",
    "title": "2008 AMC 8 Problem 1: Carnival Money Left",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Arithmetic",
    "difficulty": 1,
    "statement": "Susan had 50 dollars to spend at the carnival. She spent 12 dollars on food and twice as much on rides. How many dollars did she have left to spend?",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "14"
      },
      {
        "label": "C",
        "text": "26"
      },
      {
        "label": "D",
        "text": "38"
      },
      {
        "label": "E",
        "text": "50"
      }
    ],
    "answer": "B",
    "shortAnswer": "14",
    "solutionSteps": [
      {
        "title": "Find the ride cost",
        "body": "She spent twice as much on rides as on food, so rides cost 2 × 12 = 24 dollars.",
        "equation": "2×12=24"
      },
      {
        "title": "Add spending",
        "body": "Altogether she spent 12 + 24 = 36 dollars.",
        "equation": "12+24=36"
      },
      {
        "title": "Subtract from her budget",
        "body": "She started with 50 dollars, so she had 50 − 36 = 14 dollars left.",
        "equation": "50-36=14"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "arithmetic",
      "money"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-02",
    "title": "2008 AMC 8 Problem 2: BEST OF LUCK Code",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 2,
    "category": "Logic",
    "subcategory": "Coding",
    "difficulty": 1,
    "statement": "The ten-letter code BEST OF LUCK represents the ten digits 0–9, in order. What 4-digit number is represented by the code word CLUE?",
    "choices": [
      {
        "label": "A",
        "text": "8671"
      },
      {
        "label": "B",
        "text": "8672"
      },
      {
        "label": "C",
        "text": "9781"
      },
      {
        "label": "D",
        "text": "9782"
      },
      {
        "label": "E",
        "text": "9872"
      }
    ],
    "answer": "A",
    "shortAnswer": "8671",
    "solutionSteps": [
      {
        "title": "Match letters to digits",
        "body": "The letters B,E,S,T,O,F,L,U,C,K represent 0,1,2,3,4,5,6,7,8,9 in order."
      },
      {
        "title": "Read CLUE",
        "body": "C = 8, L = 6, U = 7, and E = 1."
      },
      {
        "title": "Form the number",
        "body": "Therefore CLUE represents 8671."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2008",
      "logic",
      "coding",
      "digits"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-03",
    "title": "2008 AMC 8 Problem 3: Friday the 13th",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 3,
    "category": "Number Theory",
    "subcategory": "Calendar arithmetic",
    "difficulty": 1,
    "statement": "If February is a month that contains Friday the 13th, what day of the week is February 1?",
    "choices": [
      {
        "label": "A",
        "text": "Sunday"
      },
      {
        "label": "B",
        "text": "Monday"
      },
      {
        "label": "C",
        "text": "Wednesday"
      },
      {
        "label": "D",
        "text": "Thursday"
      },
      {
        "label": "E",
        "text": "Saturday"
      }
    ],
    "answer": "A",
    "shortAnswer": "Sunday",
    "solutionSteps": [
      {
        "title": "Go back by weeks",
        "body": "If February 13 is Friday, then February 6 is also Friday."
      },
      {
        "title": "Go back five days",
        "body": "February 1 is five days before Friday, February 6."
      },
      {
        "title": "Name the day",
        "body": "Five days before Friday is Sunday."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "calendar",
      "modular arithmetic"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-04",
    "title": "2008 AMC 8 Problem 4: Triangle and Trapezoids",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 4,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 1,
    "statement": "In the figure, the outer equilateral triangle has area 16, the inner equilateral triangle has area 1, and the three trapezoids are congruent. What is the area of one of the trapezoids?",
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
        "title": "Find the surrounding area",
        "body": "The area inside the large triangle but outside the small triangle is 16 − 1 = 15.",
        "equation": "16-1=15"
      },
      {
        "title": "Split equally",
        "body": "This area is divided into three congruent trapezoids."
      },
      {
        "title": "Divide by 3",
        "body": "Each trapezoid has area 15 ÷ 3 = 5.",
        "equation": "15/3=5"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "geometry",
      "area",
      "triangles"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-04-equilateral-trapezoids.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-05",
    "title": "2008 AMC 8 Problem 5: Palindrome Odometer",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 1,
    "statement": "Barney Schwinn notices that the odometer on his bicycle reads 1441, a palindrome, because it reads the same forward and backward. After riding 4 more hours that day and 6 the next, he notices that the odometer shows another palindrome, 1661. What was his average speed in miles per hour?",
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
        "text": "18"
      },
      {
        "label": "D",
        "text": "20"
      },
      {
        "label": "E",
        "text": "22"
      }
    ],
    "answer": "E",
    "shortAnswer": "22",
    "solutionSteps": [
      {
        "title": "Find the distance traveled",
        "body": "The odometer changed from 1441 to 1661, so Barney rode 220 miles.",
        "equation": "1661-1441=220"
      },
      {
        "title": "Find the time",
        "body": "He rode 4 hours plus 6 hours, or 10 hours total.",
        "equation": "4+6=10"
      },
      {
        "title": "Compute speed",
        "body": "Average speed is distance divided by time: 220 ÷ 10 = 22 mph.",
        "equation": "220/10=22"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "rates",
      "arithmetic"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-06",
    "title": "2008 AMC 8 Problem 6: Gray and White Squares Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Area ratios",
    "difficulty": 2,
    "statement": "In the figure, what is the ratio of the area of the gray squares to the area of the white squares?",
    "choices": [
      {
        "label": "A",
        "text": "3 : 10"
      },
      {
        "label": "B",
        "text": "3 : 8"
      },
      {
        "label": "C",
        "text": "3 : 7"
      },
      {
        "label": "D",
        "text": "3 : 5"
      },
      {
        "label": "E",
        "text": "1 : 1"
      }
    ],
    "answer": "D",
    "shortAnswer": "3 : 5",
    "solutionSteps": [
      {
        "title": "Use the same unit size",
        "body": "The large gray square can be split into four small squares of the same size as the surrounding tiles."
      },
      {
        "title": "Count gray and white pieces",
        "body": "There are 6 gray small-square units and 10 white small-square units."
      },
      {
        "title": "Simplify the ratio",
        "body": "The ratio 6:10 simplifies to 3:5.",
        "equation": "6:10=3:5"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "geometry",
      "area",
      "ratio"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-06-gray-white-squares.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-07",
    "title": "2008 AMC 8 Problem 7: Equivalent Fractions",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Proportions",
    "difficulty": 1,
    "statement": "If 3/5 = M/45 = 60/N, what is M + N?",
    "choices": [
      {
        "label": "A",
        "text": "27"
      },
      {
        "label": "B",
        "text": "29"
      },
      {
        "label": "C",
        "text": "45"
      },
      {
        "label": "D",
        "text": "105"
      },
      {
        "label": "E",
        "text": "127"
      }
    ],
    "answer": "E",
    "shortAnswer": "127",
    "solutionSteps": [
      {
        "title": "Solve for M",
        "body": "Since M/45 = 3/5, M = 45 × 3/5 = 27.",
        "equation": "M=45*3/5=27"
      },
      {
        "title": "Solve for N",
        "body": "Since 60/N = 3/5, cross multiply to get 3N = 300, so N = 100.",
        "equation": "3N=300 => N=100"
      },
      {
        "title": "Add",
        "body": "M + N = 27 + 100 = 127.",
        "equation": "27+100=127"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "fractions",
      "proportions"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-08",
    "title": "2008 AMC 8 Problem 8: Candy Sales Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 8,
    "category": "Other",
    "subcategory": "Bar graphs",
    "difficulty": 1,
    "statement": "Candy sales from the Boosters Club from January through April are shown. What were the average sales per month in dollars?",
    "choices": [
      {
        "label": "A",
        "text": "60"
      },
      {
        "label": "B",
        "text": "70"
      },
      {
        "label": "C",
        "text": "75"
      },
      {
        "label": "D",
        "text": "80"
      },
      {
        "label": "E",
        "text": "85"
      }
    ],
    "answer": "D",
    "shortAnswer": "80",
    "solutionSteps": [
      {
        "title": "Read the bars",
        "body": "The monthly sales are 100, 60, 40, and 120 dollars."
      },
      {
        "title": "Add the sales",
        "body": "The total sales are 100 + 60 + 40 + 120 = 320 dollars.",
        "equation": "100+60+40+120=320"
      },
      {
        "title": "Average over four months",
        "body": "320 ÷ 4 = 80 dollars per month.",
        "equation": "320/4=80"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "data",
      "bar graph",
      "average"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-08-candy-bar-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-09",
    "title": "2008 AMC 8 Problem 9: Two-Year Investment Change",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 2,
    "statement": "In 2005 Tycoon Tammy invested 100 dollars for two years. During the first year her investment suffered a 15% loss, but during the second year the remaining investment showed a 20% gain. Over the two-year period, what was the change in Tammy's investment?",
    "choices": [
      {
        "label": "A",
        "text": "5% loss"
      },
      {
        "label": "B",
        "text": "2% loss"
      },
      {
        "label": "C",
        "text": "1% gain"
      },
      {
        "label": "D",
        "text": "2% gain"
      },
      {
        "label": "E",
        "text": "5% gain"
      }
    ],
    "answer": "D",
    "shortAnswer": "2% gain",
    "solutionSteps": [
      {
        "title": "Apply the loss",
        "body": "After a 15% loss, 100 dollars becomes 85 dollars.",
        "equation": "100*0.85=85"
      },
      {
        "title": "Apply the gain",
        "body": "A 20% gain changes 85 dollars to 85 × 1.20 = 102 dollars.",
        "equation": "85*1.2=102"
      },
      {
        "title": "Compare to the original",
        "body": "102 dollars is 2 dollars more than 100 dollars, so this is a 2% gain."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "percent change"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-10",
    "title": "2008 AMC 8 Problem 10: Combined Room Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Weighted averages",
    "difficulty": 2,
    "statement": "The average age of the 6 people in Room A is 40. The average age of the 4 people in Room B is 25. If the two groups are combined, what is the average age of all the people?",
    "choices": [
      {
        "label": "A",
        "text": "32.5"
      },
      {
        "label": "B",
        "text": "33"
      },
      {
        "label": "C",
        "text": "33.5"
      },
      {
        "label": "D",
        "text": "34"
      },
      {
        "label": "E",
        "text": "35"
      }
    ],
    "answer": "D",
    "shortAnswer": "34",
    "solutionSteps": [
      {
        "title": "Find Room A total",
        "body": "Room A has total age 6 × 40 = 240.",
        "equation": "6*40=240"
      },
      {
        "title": "Find Room B total",
        "body": "Room B has total age 4 × 25 = 100.",
        "equation": "4*25=100"
      },
      {
        "title": "Average all 10 people",
        "body": "The combined total is 340 over 10 people, so the average is 34.",
        "equation": "(240+100)/10=34"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
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
      "2008",
      "algebra",
      "weighted average"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-11",
    "title": "2008 AMC 8 Problem 11: Dogs and Cats",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 11,
    "category": "Counting & Probability",
    "subcategory": "Set counting",
    "difficulty": 2,
    "statement": "Each of the 39 students in the eighth grade at Lincoln Middle School has one dog or one cat or both a dog and a cat. Twenty students have a dog and 26 students have a cat. How many students have both a dog and a cat?",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "13"
      },
      {
        "label": "C",
        "text": "19"
      },
      {
        "label": "D",
        "text": "39"
      },
      {
        "label": "E",
        "text": "46"
      }
    ],
    "answer": "A",
    "shortAnswer": "7",
    "solutionSteps": [
      {
        "title": "Use inclusion-exclusion",
        "body": "Dog owners plus cat owners counts students with both pets twice."
      },
      {
        "title": "Set up the equation",
        "body": "39 = 20 + 26 − both.",
        "equation": "39=20+26-x"
      },
      {
        "title": "Solve",
        "body": "The number with both is 20 + 26 − 39 = 7.",
        "equation": "20+26-39=7"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Choice A is circled."
      }
    ],
    "animation": {
      "type": "venn",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2008",
      "sets",
      "counting",
      "inclusion-exclusion"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-12",
    "title": "2008 AMC 8 Problem 12: Bouncing Ball",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Geometric sequences",
    "difficulty": 2,
    "statement": "A ball is dropped from a height of 3 meters. On its first bounce it rises to a height of 2 meters. It keeps falling and bouncing to 2/3 of the height it reached in the previous bounce. On which bounce will it not rise to a height of 0.5 meters?",
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
        "title": "List bounce heights",
        "body": "The first bounce rises to 2 meters, and each later bounce is 2/3 of the previous height."
      },
      {
        "title": "Compute until below 0.5",
        "body": "The bounce heights are 2, 4/3, 8/9, 16/27, and 32/81."
      },
      {
        "title": "Compare",
        "body": "16/27 is still above 0.5, but 32/81 is below 0.5, so it happens on the 5th bounce."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "sequences",
      "fractions"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-13",
    "title": "2008 AMC 8 Problem 13: Pairwise Box Weights",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 13,
    "category": "Algebra",
    "subcategory": "Systems",
    "difficulty": 2,
    "statement": "Mr. Harman needs to know the combined weight in pounds of three boxes he wants to mail. However, the only available scale is not accurate for weights less than 100 pounds or more than 150 pounds. So the boxes are weighed in pairs in every possible way. The results are 122, 125 and 127 pounds. What is the combined weight in pounds of the three boxes?",
    "choices": [
      {
        "label": "A",
        "text": "160"
      },
      {
        "label": "B",
        "text": "170"
      },
      {
        "label": "C",
        "text": "187"
      },
      {
        "label": "D",
        "text": "195"
      },
      {
        "label": "E",
        "text": "354"
      }
    ],
    "answer": "C",
    "shortAnswer": "187",
    "solutionSteps": [
      {
        "title": "Add the pair weights",
        "body": "Adding the three pair weights gives 122 + 125 + 127 = 374.",
        "equation": "122+125+127=374"
      },
      {
        "title": "Notice double counting",
        "body": "Each individual box is included in exactly two of the pair weights."
      },
      {
        "title": "Divide by 2",
        "body": "So the total weight of the three boxes is 374 ÷ 2 = 187 pounds.",
        "equation": "374/2=187"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "systems",
      "double counting"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-14",
    "title": "2008 AMC 8 Problem 14: Three-Letter Grid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 14,
    "category": "Counting & Probability",
    "subcategory": "Arrangements",
    "difficulty": 3,
    "statement": "Three A's, three B's, and three C's are placed in the nine spaces so that each row and column contain one of each letter. If A is placed in the upper left corner, how many arrangements are possible?",
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
    "answer": "C",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Place the remaining A's",
        "body": "With A fixed in the upper left, there are 2 possible ways to complete the positions of the other A's."
      },
      {
        "title": "Place the B's",
        "body": "For each A placement, there are 2 possible ways to place the B's while keeping one of each letter in every row and column."
      },
      {
        "title": "Finish with C's",
        "body": "The C's are then forced, so there are 2 × 2 = 4 arrangements.",
        "equation": "2*2=4"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "counting",
      "arrangements",
      "grid"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-14-letter-grid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-15",
    "title": "2008 AMC 8 Problem 15: Basketball Averages",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Divisibility",
    "difficulty": 3,
    "statement": "In Theresa's first 8 basketball games, she scored 7, 4, 3, 6, 8, 3, 1 and 5 points. In her ninth game, she scored fewer than 10 points and her points-per-game average for the nine games was an integer. Similarly in her tenth game, she scored fewer than 10 points and her points-per-game average for the 10 games was also an integer. What is the product of the number of points she scored in the ninth and tenth games?",
    "choices": [
      {
        "label": "A",
        "text": "35"
      },
      {
        "label": "B",
        "text": "40"
      },
      {
        "label": "C",
        "text": "48"
      },
      {
        "label": "D",
        "text": "56"
      },
      {
        "label": "E",
        "text": "72"
      }
    ],
    "answer": "B",
    "shortAnswer": "40",
    "solutionSteps": [
      {
        "title": "Add the first 8 games",
        "body": "The first 8 scores sum to 37.",
        "equation": "7+4+3+6+8+3+1+5=37"
      },
      {
        "title": "Make the 9-game total divisible by 9",
        "body": "The next multiple of 9 above 37 is 45, so she scored 8 points in game 9."
      },
      {
        "title": "Make the 10-game total divisible by 10",
        "body": "The next 10-game total must be a multiple of 10, so she scored 5 points in game 10. The product is 8 × 5 = 40."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "averages",
      "divisibility"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-16",
    "title": "2008 AMC 8 Problem 16: Seven-Cube Shape Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 16,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 3,
    "statement": "A shape is created by joining seven unit cubes, as shown. What is the ratio of the volume in cubic units to the surface area in square units?",
    "choices": [
      {
        "label": "A",
        "text": "1 : 6"
      },
      {
        "label": "B",
        "text": "7 : 36"
      },
      {
        "label": "C",
        "text": "1 : 5"
      },
      {
        "label": "D",
        "text": "7 : 30"
      },
      {
        "label": "E",
        "text": "6 : 25"
      }
    ],
    "answer": "D",
    "shortAnswer": "7 : 30",
    "solutionSteps": [
      {
        "title": "Find the volume",
        "body": "The shape is made of seven unit cubes, so its volume is 7 cubic units."
      },
      {
        "title": "Find exposed faces",
        "body": "The shape has five protruding unit cubes around a central cube, giving 5 × 6 = 30 exposed unit faces in this arrangement."
      },
      {
        "title": "Write the ratio",
        "body": "The ratio of volume to surface area is 7:30."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2008",
      "geometry",
      "3D geometry",
      "surface area"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-16-seven-cubes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-17",
    "title": "2008 AMC 8 Problem 17: Rectangle Area Range",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 17,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "Ms. Osborne asks each student in her class to draw a rectangle with integer side lengths and a perimeter of 50 units. All of her students calculate the area of the rectangle they draw. What is the difference between the largest and smallest possible areas of the rectangles?",
    "choices": [
      {
        "label": "A",
        "text": "76"
      },
      {
        "label": "B",
        "text": "120"
      },
      {
        "label": "C",
        "text": "128"
      },
      {
        "label": "D",
        "text": "132"
      },
      {
        "label": "E",
        "text": "136"
      }
    ],
    "answer": "D",
    "shortAnswer": "132",
    "solutionSteps": [
      {
        "title": "Use the perimeter",
        "body": "If the perimeter is 50, then length + width = 25."
      },
      {
        "title": "Find the largest area",
        "body": "The closest integer sides are 12 and 13, giving area 156."
      },
      {
        "title": "Find the smallest area",
        "body": "The smallest positive integer-sided rectangle is 1 by 24, giving area 24. The difference is 156 − 24 = 132."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "geometry",
      "area",
      "optimization"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-18",
    "title": "2008 AMC 8 Problem 18: Aardvark Circular Path",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 18,
    "category": "Geometry",
    "subcategory": "Arc length",
    "difficulty": 4,
    "statement": "Two circles that share the same center have radii 10 meters and 20 meters. An aardvark runs along the path shown, starting at A and ending at K. How many meters does the aardvark run?",
    "choices": [
      {
        "label": "A",
        "text": "10π + 20"
      },
      {
        "label": "B",
        "text": "10π + 30"
      },
      {
        "label": "C",
        "text": "10π + 40"
      },
      {
        "label": "D",
        "text": "20π + 20"
      },
      {
        "label": "E",
        "text": "20π + 40"
      }
    ],
    "answer": "E",
    "shortAnswer": "20π + 40",
    "solutionSteps": [
      {
        "title": "Break the path into pieces",
        "body": "The path contains a quarter of the large circle, two quarter-arcs of the small circle, one small diameter, and two radial gaps."
      },
      {
        "title": "Add arc lengths",
        "body": "The arcs total 10π + 5π + 5π = 20π."
      },
      {
        "title": "Add straight parts",
        "body": "The straight pieces total 10 + 20 + 10 = 40, so the path length is 20π + 40."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
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
      "2008",
      "geometry",
      "circles",
      "arc length"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-18-aardvark-path.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-19",
    "title": "2008 AMC 8 Problem 19: Points Around a Square",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 19,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "Eight points are spaced around at intervals of one unit around a 2 × 2 square, as shown. Two of the 8 points are chosen at random. What is the probability that the two points are one unit apart?",
    "choices": [
      {
        "label": "A",
        "text": "1/4"
      },
      {
        "label": "B",
        "text": "2/7"
      },
      {
        "label": "C",
        "text": "4/11"
      },
      {
        "label": "D",
        "text": "1/2"
      },
      {
        "label": "E",
        "text": "4/7"
      }
    ],
    "answer": "B",
    "shortAnswer": "2/7",
    "solutionSteps": [
      {
        "title": "Count favorable pairs",
        "body": "Around the boundary of the 2 by 2 square, there are 8 adjacent one-unit pairs of points."
      },
      {
        "title": "Count all pairs",
        "body": "There are C(8,2) = 28 ways to choose two points."
      },
      {
        "title": "Compute the probability",
        "body": "The probability is 8/28 = 2/7.",
        "equation": "8/28=2/7"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "probability",
      "counting",
      "geometry"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-19-square-points.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-20",
    "title": "2008 AMC 8 Problem 20: Penmanship Test",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 20,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 4,
    "statement": "The students in Mr. Neatkin's class took a penmanship test. Two-thirds of the boys and three-fourths of the girls passed the test, and an equal number of boys and girls passed the test. What is the minimum possible number of students in the class?",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "17"
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
    "answer": "B",
    "shortAnswer": "17",
    "solutionSteps": [
      {
        "title": "Set passed numbers equal",
        "body": "Let b be boys and g be girls. Equal numbers passed means (2/3)b = (3/4)g.",
        "equation": "(2/3)b = (3/4)g"
      },
      {
        "title": "Solve the ratio",
        "body": "Multiplying gives 8b = 9g, so b:g = 9:8."
      },
      {
        "title": "Choose the minimum",
        "body": "The smallest whole-number group has 9 boys and 8 girls, for 17 students total."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "algebra",
      "ratios",
      "equations"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-21",
    "title": "2008 AMC 8 Problem 21: Bologna Wedge Volume",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 21,
    "category": "Geometry",
    "subcategory": "Volume",
    "difficulty": 4,
    "statement": "Jerry cuts a wedge from a 6-cm cylinder of bologna as shown by the dashed curve. Which answer choice is closest to the volume of his wedge in cubic centimeters?",
    "choices": [
      {
        "label": "A",
        "text": "48"
      },
      {
        "label": "B",
        "text": "75"
      },
      {
        "label": "C",
        "text": "151"
      },
      {
        "label": "D",
        "text": "192"
      },
      {
        "label": "E",
        "text": "603"
      }
    ],
    "answer": "C",
    "shortAnswer": "151",
    "solutionSteps": [
      {
        "title": "Find cylinder radius and height",
        "body": "The cylinder has diameter 8 cm, so radius 4 cm, and length 6 cm."
      },
      {
        "title": "Compute cylinder volume",
        "body": "The whole cylinder volume is π × 4² × 6 = 96π.",
        "equation": "pi*4^2*6=96pi"
      },
      {
        "title": "Take half",
        "body": "The wedge is half the cylinder, so its volume is 48π, which is closest to 151."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "geometry",
      "volume",
      "cylinder"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-21-cylinder-wedge.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-22",
    "title": "2008 AMC 8 Problem 22: Three-Digit n Values",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 22,
    "category": "Number Theory",
    "subcategory": "Inequalities",
    "difficulty": 4,
    "statement": "For how many positive integer values of n are both n/3 and 3n three-digit whole numbers?",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "21"
      },
      {
        "label": "C",
        "text": "27"
      },
      {
        "label": "D",
        "text": "33"
      },
      {
        "label": "E",
        "text": "34"
      }
    ],
    "answer": "A",
    "shortAnswer": "12",
    "solutionSteps": [
      {
        "title": "Let x = n/3",
        "body": "Then 3n = 9x. We need both x and 9x to be three-digit whole numbers."
      },
      {
        "title": "Find x range",
        "body": "The smallest possible x is 100, and 9x ≤ 999 gives x ≤ 111."
      },
      {
        "title": "Count integers",
        "body": "The integers 100 through 111 give 12 possible values."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "number theory",
      "inequalities",
      "integer values"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-23",
    "title": "2008 AMC 8 Problem 23: Triangle in a Square",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Area ratios",
    "difficulty": 4,
    "statement": "In square ABCE, AF = 2FE and CD = 2DE. What is the ratio of the area of triangle BFD to the area of square ABCE?",
    "choices": [
      {
        "label": "A",
        "text": "1/6"
      },
      {
        "label": "B",
        "text": "2/9"
      },
      {
        "label": "C",
        "text": "5/18"
      },
      {
        "label": "D",
        "text": "1/3"
      },
      {
        "label": "E",
        "text": "7/20"
      }
    ],
    "answer": "C",
    "shortAnswer": "5/18",
    "solutionSteps": [
      {
        "title": "Choose a convenient side length",
        "body": "Let the square have side length 6, so AF = 4 and FE = 2, while CD = 4 and DE = 2."
      },
      {
        "title": "Subtract surrounding triangles",
        "body": "The square has area 36. The surrounding triangles have areas 12, 12, and 2."
      },
      {
        "title": "Find the ratio",
        "body": "Triangle BFD has area 36 − 12 − 12 − 2 = 10, so the ratio is 10/36 = 5/18."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "geometry",
      "area ratios",
      "square"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-23-triangle-square.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2008-24",
    "title": "2008 AMC 8 Problem 24: Tile and Die Square Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 24,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 4,
    "statement": "Ten tiles numbered 1 through 10 are turned face down. One tile is turned up at random, and a die is rolled. What is the probability that the product of the numbers on the tile and the die will be a square?",
    "choices": [
      {
        "label": "A",
        "text": "1/10"
      },
      {
        "label": "B",
        "text": "1/6"
      },
      {
        "label": "C",
        "text": "11/60"
      },
      {
        "label": "D",
        "text": "1/5"
      },
      {
        "label": "E",
        "text": "7/30"
      }
    ],
    "answer": "C",
    "shortAnswer": "11/60",
    "solutionSteps": [
      {
        "title": "Count all outcomes",
        "body": "There are 10 possible tiles and 6 possible die rolls, for 60 equally likely outcomes."
      },
      {
        "title": "Count square products",
        "body": "The favorable pairs are (1,1), (1,4), (2,2), (4,1), (3,3), (9,1), (4,4), (8,2), (5,5), (6,6), and (9,4)."
      },
      {
        "title": "Compute probability",
        "body": "There are 11 favorable outcomes, so the probability is 11/60."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "probability",
      "squares",
      "counting"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2008-25",
    "title": "2008 AMC 8 Problem 25: Black Circle Design",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2008,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area percents",
    "difficulty": 5,
    "statement": "Margie's winning art design is shown. The smallest circle has radius 2 inches, with each successive circle's radius increasing by 2 inches. Approximately what percent of the design is black?",
    "choices": [
      {
        "label": "A",
        "text": "42"
      },
      {
        "label": "B",
        "text": "44"
      },
      {
        "label": "C",
        "text": "45"
      },
      {
        "label": "D",
        "text": "46"
      },
      {
        "label": "E",
        "text": "48"
      }
    ],
    "answer": "A",
    "shortAnswer": "42",
    "solutionSteps": [
      {
        "title": "Use circle areas",
        "body": "The circle radii are 2, 4, 6, 8, 10, and 12, so their areas are proportional to 4, 16, 36, 64, 100, and 144."
      },
      {
        "title": "Add black rings",
        "body": "The black area is (100 − 64)π + (36 − 16)π + 4π = 60π."
      },
      {
        "title": "Find the percent",
        "body": "The whole design has area 144π, and 60/144 = 5/12 ≈ 42%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the important quantities and the question being asked.",
        "visualHint": "The key numbers and relationships are highlighted."
      },
      {
        "title": "Use the main idea",
        "narration": "Apply the relevant arithmetic, geometry, counting, or probability idea step by step.",
        "visualHint": "A clean diagram or equation shows the central relationship."
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
      "2008",
      "geometry",
      "circles",
      "area"
    ],
    "sourceName": "2008 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2008/problem-25-circle-design.svg"
    ],
    "needsDiagram": true
  }
];

const amc2009Problems: Problem[] = [
  {
    "id": "amc8-2009-01",
    "title": "2009 AMC 8 Problem 1: Bridget’s Apples",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Equations",
    "difficulty": 1,
    "statement": "Bridget bought a bag of apples at the grocery store. She gave half of the apples to Ann. Then she gave Cassie 3 apples, keeping 4 apples for herself. How many apples did Bridget buy?",
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
        "text": "7"
      },
      {
        "label": "D",
        "text": "11"
      },
      {
        "label": "E",
        "text": "14"
      }
    ],
    "answer": "E",
    "shortAnswer": "14",
    "solutionSteps": [
      {
        "title": "Work backward",
        "body": "After Bridget gave half the apples away, she still had the 3 apples for Cassie and the 4 apples for herself.",
        "equation": "3+4=7"
      },
      {
        "title": "Undo giving away half",
        "body": "Those 7 apples are half of the original bag, so the original number was twice as large.",
        "equation": "2\\cdot 7=14"
      },
      {
        "title": "Conclude",
        "body": "Bridget bought 14 apples."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2009",
      "algebra",
      "equations",
      "working backward"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-02",
    "title": "2009 AMC 8 Problem 2: Sports Cars and Sedans",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 2,
    "category": "Algebra",
    "subcategory": "Ratios and proportions",
    "difficulty": 1,
    "statement": "On average, for every 4 sports cars sold at the local dealership, 7 sedans are sold. The dealership predicts that it will sell 28 sports cars next month. How many sedans does it expect to sell?",
    "choices": [
      {
        "label": "A",
        "text": "7"
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
        "text": "49"
      },
      {
        "label": "E",
        "text": "112"
      }
    ],
    "answer": "D",
    "shortAnswer": "49",
    "solutionSteps": [
      {
        "title": "Use the ratio",
        "body": "The sports-car-to-sedan ratio is 4:7."
      },
      {
        "title": "Scale the ratio",
        "body": "Since 28 sports cars is 7 times 4 sports cars, multiply the sedan count by 7 too.",
        "equation": "7\\cdot 7=49"
      },
      {
        "title": "Conclude",
        "body": "The dealership expects to sell 49 sedans."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
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
      "2009",
      "algebra",
      "ratio",
      "proportion"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-03",
    "title": "2009 AMC 8 Problem 3: Suzanna’s Bike Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Rates from graphs",
    "difficulty": 1,
    "statement": "The graph shows the constant rate at which Suzanna rides her bike. If she rides a total of a half an hour at the same speed, how many miles would she have ridden?",
    "choices": [
      {
        "label": "A",
        "text": "5"
      },
      {
        "label": "B",
        "text": "5.5"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "6.5"
      },
      {
        "label": "E",
        "text": "7"
      }
    ],
    "answer": "C",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Read the slope",
        "body": "The graph shows 1 mile in 5 minutes, so her speed is 1/5 mile per minute.",
        "equation": "1\text{ mile}/5\text{ min}"
      },
      {
        "title": "Use 30 minutes",
        "body": "A half hour is 30 minutes.",
        "equation": "30\\cdot \frac15=6"
      },
      {
        "title": "Conclude",
        "body": "Suzanna rides 6 miles."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Choice C is circled."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2009",
      "graph",
      "rates",
      "proportional relationships"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-03-bike-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-04",
    "title": "2009 AMC 8 Problem 4: Five Pieces Puzzle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 4,
    "category": "Geometry",
    "subcategory": "Spatial reasoning",
    "difficulty": 2,
    "statement": "The five pieces shown below can be arranged to form four of the five figures shown in the choices. Which figure cannot be formed?",
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
        "title": "Look at the pieces",
        "body": "The pieces are straight bars of lengths 1, 2, 3, 4, and 5 unit squares."
      },
      {
        "title": "Test the longest piece",
        "body": "Figure B has no place where the length-5 bar can fit without breaking the shape."
      },
      {
        "title": "Conclude",
        "body": "Figure B cannot be formed."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "geometry",
      "spatial reasoning",
      "polyominoes"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-04-polyomino-pieces.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-05",
    "title": "2009 AMC 8 Problem 5: Three-Term Sequence",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Sequences",
    "difficulty": 1,
    "statement": "A sequence of numbers starts with 1, 2, and 3. The fourth number of the sequence is the sum of the previous three numbers in the sequence: 1 + 2 + 3 = 6. In the same way, every number after the fourth is the sum of the previous three numbers. What is the eighth number in the sequence?",
    "choices": [
      {
        "label": "A",
        "text": "11"
      },
      {
        "label": "B",
        "text": "20"
      },
      {
        "label": "C",
        "text": "37"
      },
      {
        "label": "D",
        "text": "68"
      },
      {
        "label": "E",
        "text": "99"
      }
    ],
    "answer": "D",
    "shortAnswer": "68",
    "solutionSteps": [
      {
        "title": "Generate terms",
        "body": "Each new term is the sum of the previous three.",
        "equation": "1,2,3,6"
      },
      {
        "title": "Continue",
        "body": "The next terms are 2+3+6=11, then 3+6+11=20, then 6+11+20=37.",
        "equation": "1,2,3,6,11,20,37"
      },
      {
        "title": "Find the eighth",
        "body": "The eighth term is 11+20+37=68.",
        "equation": "11+20+37=68"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "sequences",
      "recursion",
      "arithmetic"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-06",
    "title": "2009 AMC 8 Problem 6: Filling a Pool",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 6,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 1,
    "statement": "Steve's empty swimming pool will hold 24,000 gallons of water when full. It will be filled by 4 hoses, each of which supplies 2.5 gallons of water per minute. How many hours will it take to fill Steve's pool?",
    "choices": [
      {
        "label": "A",
        "text": "40"
      },
      {
        "label": "B",
        "text": "42"
      },
      {
        "label": "C",
        "text": "44"
      },
      {
        "label": "D",
        "text": "46"
      },
      {
        "label": "E",
        "text": "48"
      }
    ],
    "answer": "A",
    "shortAnswer": "40",
    "solutionSteps": [
      {
        "title": "Find the total rate",
        "body": "Four hoses each supply 2.5 gallons per minute.",
        "equation": "4\\cdot 2.5=10"
      },
      {
        "title": "Find minutes",
        "body": "At 10 gallons per minute, 24,000 gallons takes 2,400 minutes.",
        "equation": "24000\\div 10=2400"
      },
      {
        "title": "Convert to hours",
        "body": "There are 60 minutes in an hour.",
        "equation": "2400\\div 60=40"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "rates",
      "unit conversion",
      "algebra"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-07",
    "title": "2009 AMC 8 Problem 7: Triangular Road Plot",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 7,
    "category": "Geometry",
    "subcategory": "Area of triangles",
    "difficulty": 2,
    "statement": "The triangular plot ACD lies between Aspen Road, Brown Road and a railroad. Main Street runs east and west, and the railroad runs north and south. The numbers in the diagram indicate distances in miles. The width of the railroad track can be ignored. How many square miles are in the plot of land ACD?",
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
        "text": "4.5"
      },
      {
        "label": "D",
        "text": "6"
      },
      {
        "label": "E",
        "text": "9"
      }
    ],
    "answer": "C",
    "shortAnswer": "4.5",
    "solutionSteps": [
      {
        "title": "Choose a base",
        "body": "Use CD as the base. The diagram shows CD = 3 miles."
      },
      {
        "title": "Find the height",
        "body": "The perpendicular distance from A to the railroad line is AB = 3 miles."
      },
      {
        "title": "Compute area",
        "body": "The triangular plot has area one half times base times height.",
        "equation": "\frac12\\cdot 3\\cdot 3=4.5"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "geometry",
      "area",
      "triangles"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-07-road-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-08",
    "title": "2009 AMC 8 Problem 8: Changing Rectangle Dimensions",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Area scaling",
    "difficulty": 2,
    "statement": "The length of a rectangle is increased by 10 percent and the width is decreased by 10 percent. What percent of the old area is the new area?",
    "choices": [
      {
        "label": "A",
        "text": "90"
      },
      {
        "label": "B",
        "text": "99"
      },
      {
        "label": "C",
        "text": "100"
      },
      {
        "label": "D",
        "text": "101"
      },
      {
        "label": "E",
        "text": "110"
      }
    ],
    "answer": "B",
    "shortAnswer": "99",
    "solutionSteps": [
      {
        "title": "Use simple dimensions",
        "body": "Let the old rectangle be 10 by 10, so its area is 100."
      },
      {
        "title": "Apply the changes",
        "body": "The new dimensions are 11 by 9."
      },
      {
        "title": "Compare areas",
        "body": "The new area is 99, so it is 99 percent of the old area.",
        "equation": "11\\cdot 9=99"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "geometry",
      "area",
      "percent"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-09",
    "title": "2009 AMC 8 Problem 9: Regular Polygons Chain",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 9,
    "category": "Geometry",
    "subcategory": "Polygons",
    "difficulty": 3,
    "statement": "Construct a square on one side of an equilateral triangle. On one non-adjacent side of the square, construct a regular pentagon, as shown. On a non-adjacent side of the pentagon, construct a hexagon. Continue to construct regular polygons in the same way, until you construct an octagon. How many sides does the resulting polygon have?",
    "choices": [
      {
        "label": "A",
        "text": "21"
      },
      {
        "label": "B",
        "text": "23"
      },
      {
        "label": "C",
        "text": "25"
      },
      {
        "label": "D",
        "text": "27"
      },
      {
        "label": "E",
        "text": "29"
      }
    ],
    "answer": "B",
    "shortAnswer": "23",
    "solutionSteps": [
      {
        "title": "List the shapes",
        "body": "The chain uses polygons with 3, 4, 5, 6, 7, and 8 sides."
      },
      {
        "title": "Account for glued sides",
        "body": "The end shapes lose one side each to a neighbor, and the four middle shapes lose two sides each."
      },
      {
        "title": "Count outside sides",
        "body": "The outside boundary has (3+8−2) + (4+5+6+7−8) = 9+14 = 23 sides.",
        "equation": "23"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "geometry",
      "polygons",
      "counting"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-09-polygon-chain.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-10",
    "title": "2009 AMC 8 Problem 10: Checkerboard Interior Squares",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 10,
    "category": "Counting & Probability",
    "subcategory": "Probability with grids",
    "difficulty": 2,
    "statement": "On a checkerboard composed of 64 unit squares, what is the probability that a randomly chosen unit square does not touch the outer edge of the board?",
    "choices": [
      {
        "label": "A",
        "text": "1/16"
      },
      {
        "label": "B",
        "text": "7/16"
      },
      {
        "label": "C",
        "text": "1/2"
      },
      {
        "label": "D",
        "text": "9/16"
      },
      {
        "label": "E",
        "text": "49/64"
      }
    ],
    "answer": "D",
    "shortAnswer": "9/16",
    "solutionSteps": [
      {
        "title": "Count all squares",
        "body": "An 8 by 8 checkerboard has 64 unit squares.",
        "equation": "8^2=64"
      },
      {
        "title": "Count interior squares",
        "body": "Squares not touching the edge form a 6 by 6 interior block.",
        "equation": "6^2=36"
      },
      {
        "title": "Find probability",
        "body": "The probability is 36 out of 64, which simplifies to 9/16.",
        "equation": "\frac{36}{64}=\frac{9}{16}"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "probability",
      "grid",
      "checkerboard"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-10-checkerboard.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-11",
    "title": "2009 AMC 8 Problem 11: Pencil Purchases",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 11,
    "category": "Number Theory",
    "subcategory": "Common factors",
    "difficulty": 3,
    "statement": "The Amaco Middle School bookstore sells pencils costing a whole number of cents. Some seventh graders each bought a pencil, paying a total of 1.43 dollars. Some of the 30 sixth graders each bought a pencil, and they paid a total of 1.95 dollars. How many more sixth graders than seventh graders bought a pencil?",
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
        "title": "Convert to cents",
        "body": "The totals are 143 cents and 195 cents."
      },
      {
        "title": "Find the pencil price",
        "body": "The price must divide both totals. Since 143=11·13 and 195=3·5·13, the pencil costs 13 cents."
      },
      {
        "title": "Count students",
        "body": "The seventh graders were 143/13=11 students, and the sixth graders were 195/13=15 students. The difference is 4.",
        "equation": "15-11=4"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "number theory",
      "factors",
      "word problems"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-12",
    "title": "2009 AMC 8 Problem 12: Two Spinners Prime Sum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 12,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "The two spinners shown are spun once and each lands on one of the numbered sectors. What is the probability that the sum of the numbers in the two sectors is prime?",
    "choices": [
      {
        "label": "A",
        "text": "1/2"
      },
      {
        "label": "B",
        "text": "2/3"
      },
      {
        "label": "C",
        "text": "3/4"
      },
      {
        "label": "D",
        "text": "7/9"
      },
      {
        "label": "E",
        "text": "5/6"
      }
    ],
    "answer": "D",
    "shortAnswer": "7/9",
    "solutionSteps": [
      {
        "title": "List the possible sums",
        "body": "The first spinner has 1, 3, 5 and the second has 2, 4, 6, giving 9 equally likely sums."
      },
      {
        "title": "Check primality",
        "body": "The only non-prime sum is 3+6=9. The other 8? Wait, 1+2=3, 1+4=5, 1+6=7, 3+2=5, 3+4=7, 5+2=7, 5+6=11 are prime; 5+4=9 is also non-prime. There are 7 prime sums."
      },
      {
        "title": "Find the probability",
        "body": "There are 7 favorable outcomes out of 9.",
        "equation": "\frac79"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "probability",
      "spinners",
      "prime numbers"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-12-spinners.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-13",
    "title": "2009 AMC 8 Problem 13: Digits 1, 3, and 5",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 13,
    "category": "Counting & Probability",
    "subcategory": "Permutations",
    "difficulty": 2,
    "statement": "A three-digit integer contains one of each of the digits 1, 3, and 5. What is the probability that the integer is divisible by 5?",
    "choices": [
      {
        "label": "A",
        "text": "1/6"
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
        "text": "5/6"
      }
    ],
    "answer": "B",
    "shortAnswer": "1/3",
    "solutionSteps": [
      {
        "title": "Count all numbers",
        "body": "The three digits can be arranged in 3! = 6 ways."
      },
      {
        "title": "Use divisibility by 5",
        "body": "The number must end in 5. Then the first two digits can be 1 and 3 in either order."
      },
      {
        "title": "Find probability",
        "body": "There are 2 favorable numbers out of 6.",
        "equation": "\frac{2}{6}=\frac13"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "probability",
      "permutations",
      "divisibility"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-14",
    "title": "2009 AMC 8 Problem 14: Round Trip Average Speed",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 14,
    "category": "Algebra",
    "subcategory": "Average speed",
    "difficulty": 3,
    "statement": "Austin and Temple are 50 miles apart along Interstate 35. Bonnie drove from Austin to her daughter's house in Temple, averaging 60 miles per hour. Leaving the car with her daughter, Bonnie rode a bus back to Austin along the same route and averaged 40 miles per hour on the return trip. What was the average speed for the round trip, in miles per hour?",
    "choices": [
      {
        "label": "A",
        "text": "46"
      },
      {
        "label": "B",
        "text": "48"
      },
      {
        "label": "C",
        "text": "50"
      },
      {
        "label": "D",
        "text": "52"
      },
      {
        "label": "E",
        "text": "54"
      }
    ],
    "answer": "B",
    "shortAnswer": "48",
    "solutionSteps": [
      {
        "title": "Find each time",
        "body": "The trip there took 50/60 = 5/6 hours, and the return trip took 50/40 = 5/4 hours."
      },
      {
        "title": "Add distance and time",
        "body": "The total distance is 100 miles and the total time is 5/6+5/4=25/12 hours."
      },
      {
        "title": "Compute average speed",
        "body": "Average speed is total distance divided by total time.",
        "equation": "100\\div \frac{25}{12}=48"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "algebra",
      "rates",
      "average speed"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-15",
    "title": "2009 AMC 8 Problem 15: Hot Chocolate Recipe",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 3,
    "statement": "A recipe that makes 5 servings of hot chocolate requires 2 squares of chocolate, 1/4 cup sugar, 1 cup water and 4 cups milk. Jordan has 5 squares of chocolate, 2 cups of sugar, lots of water, and 7 cups of milk. If he maintains the same ratio of ingredients, what is the greatest number of servings of hot chocolate he can make?",
    "choices": [
      {
        "label": "A",
        "text": "5 1/8"
      },
      {
        "label": "B",
        "text": "6 1/4"
      },
      {
        "label": "C",
        "text": "7 1/2"
      },
      {
        "label": "D",
        "text": "8 3/4"
      },
      {
        "label": "E",
        "text": "9 7/8"
      }
    ],
    "answer": "D",
    "shortAnswer": "8 3/4",
    "solutionSteps": [
      {
        "title": "Check each ingredient",
        "body": "Chocolate could make 12.5 servings and sugar could make 40 servings. Water is unlimited."
      },
      {
        "title": "Find the limiting ingredient",
        "body": "Milk is limiting: 4 cups make 5 servings, so 7 cups make 7/4 batches."
      },
      {
        "title": "Compute servings",
        "body": "7/4 batches of 5 servings gives 35/4 = 8 3/4 servings.",
        "equation": "5\\cdot\frac74=\frac{35}{4}=8\frac34"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
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
      "2009",
      "ratio",
      "limiting factor",
      "fractions"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-16",
    "title": "2009 AMC 8 Problem 16: Digit Product 24",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 16,
    "category": "Counting & Probability",
    "subcategory": "Permutations",
    "difficulty": 4,
    "statement": "How many 3-digit positive integers have digits whose product equals 24?",
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
    "answer": "D",
    "shortAnswer": "21",
    "solutionSteps": [
      {
        "title": "Find digit groups",
        "body": "The possible digit multisets are {1,3,8}, {1,4,6}, {2,2,6}, and {2,3,4}."
      },
      {
        "title": "Count arrangements",
        "body": "The sets with three distinct digits each give 6 numbers; {2,2,6} gives 3 numbers."
      },
      {
        "title": "Add them",
        "body": "There are 6+6+3+6 = 21 such integers.",
        "equation": "21"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "counting",
      "digits",
      "permutations"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-17",
    "title": "2009 AMC 8 Problem 17: Square and Cube Multipliers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 17,
    "category": "Number Theory",
    "subcategory": "Prime factorization",
    "difficulty": 4,
    "statement": "The positive integers x and y are the two smallest positive integers for which the product of 360 and x is a square and the product of 360 and y is a cube. What is the sum of x and y?",
    "choices": [
      {
        "label": "A",
        "text": "80"
      },
      {
        "label": "B",
        "text": "85"
      },
      {
        "label": "C",
        "text": "115"
      },
      {
        "label": "D",
        "text": "165"
      },
      {
        "label": "E",
        "text": "610"
      }
    ],
    "answer": "B",
    "shortAnswer": "85",
    "solutionSteps": [
      {
        "title": "Factor 360",
        "body": "360 = 2^3 · 3^2 · 5."
      },
      {
        "title": "Make a square",
        "body": "To make all exponents even, multiply by 2·5, so x=10."
      },
      {
        "title": "Make a cube",
        "body": "To make exponents multiples of 3, multiply by 3·5^2, so y=75. Therefore x+y=85.",
        "equation": "10+75=85"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "number theory",
      "prime factorization",
      "squares and cubes"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-18",
    "title": "2009 AMC 8 Problem 18: Tiled Floor Pattern",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 18,
    "category": "Counting & Probability",
    "subcategory": "Patterns",
    "difficulty": 3,
    "statement": "The diagram represents a 7-foot-by-7-foot floor that is tiled with 1-square-foot black tiles and white tiles. Notice that the corners have white tiles. If a 15-foot-by-15-foot floor is to be tiled in the same manner, how many white tiles will be needed?",
    "choices": [
      {
        "label": "A",
        "text": "49"
      },
      {
        "label": "B",
        "text": "57"
      },
      {
        "label": "C",
        "text": "64"
      },
      {
        "label": "D",
        "text": "96"
      },
      {
        "label": "E",
        "text": "126"
      }
    ],
    "answer": "C",
    "shortAnswer": "64",
    "solutionSteps": [
      {
        "title": "Notice the pattern",
        "body": "For odd side lengths 1, 3, 5, 7, ... the number of white tiles follows 1, 4, 9, 16, ..."
      },
      {
        "title": "Connect to squares",
        "body": "A (2n−1)-by-(2n−1) floor has n^2 white tiles."
      },
      {
        "title": "Use 15",
        "body": "Since 15 is the 8th positive odd number, the floor needs 8^2 = 64 white tiles.",
        "equation": "8^2=64"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "patterns",
      "grid",
      "counting"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-18-tiled-floor.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-19",
    "title": "2009 AMC 8 Problem 19: Isosceles Angle Cases",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Angles",
    "difficulty": 4,
    "statement": "Two angles of an isosceles triangle measure 70° and x°. What is the sum of the three possible values of x?",
    "choices": [
      {
        "label": "A",
        "text": "95"
      },
      {
        "label": "B",
        "text": "125"
      },
      {
        "label": "C",
        "text": "140"
      },
      {
        "label": "D",
        "text": "165"
      },
      {
        "label": "E",
        "text": "180"
      }
    ],
    "answer": "D",
    "shortAnswer": "165",
    "solutionSteps": [
      {
        "title": "Case 1",
        "body": "If x is the other base angle with 70°, then x=70."
      },
      {
        "title": "Case 2",
        "body": "If 70° is the vertex angle, then 2x+70=180, so x=55."
      },
      {
        "title": "Case 3",
        "body": "If x is the vertex angle and 70° is a base angle, then x+140=180, so x=40. The sum is 70+55+40=165.",
        "equation": "70+55+40=165"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2009",
      "geometry",
      "angles",
      "isosceles triangles"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-20",
    "title": "2009 AMC 8 Problem 20: Non-Congruent Dot Triangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 20,
    "category": "Geometry",
    "subcategory": "Counting triangles",
    "difficulty": 4,
    "statement": "How many non-congruent triangles have vertices at three of the eight points in the array shown below?",
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
    "answer": "D",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Use symmetry",
        "body": "Represent each triangle with a base on one row; reflecting top and bottom gives congruent triangles."
      },
      {
        "title": "Count base lengths",
        "body": "For base length 1 there are 3 types, for base length 2 there are 3 types, and for base length 3 there are 2 types."
      },
      {
        "title": "Add them",
        "body": "The total is 3+3+2 = 8.",
        "equation": "8"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Choice D is circled."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2009",
      "geometry",
      "congruence",
      "counting"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-20-dot-array.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-21",
    "title": "2009 AMC 8 Problem 21: Rows and Columns Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 21,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 4,
    "statement": "Andy and Bethany have a rectangular array of numbers with 40 rows and 75 columns. Andy adds the numbers in each row. The average of his 40 sums is A. Bethany adds the numbers in each column. The average of her 75 sums is B. What is the value of A/B?",
    "choices": [
      {
        "label": "A",
        "text": "64/225"
      },
      {
        "label": "B",
        "text": "8/15"
      },
      {
        "label": "C",
        "text": "1"
      },
      {
        "label": "D",
        "text": "15/8"
      },
      {
        "label": "E",
        "text": "225/64"
      }
    ],
    "answer": "D",
    "shortAnswer": "15/8",
    "solutionSteps": [
      {
        "title": "Let S be the total sum",
        "body": "The 40 row sums average to A, so their total is 40A. The 75 column sums average to B, so their total is 75B."
      },
      {
        "title": "Use the same total",
        "body": "Both totals are the sum of every entry in the array.",
        "equation": "40A=75B"
      },
      {
        "title": "Solve the ratio",
        "body": "Divide by 40B to get A/B=75/40=15/8.",
        "equation": "\frac AB=\frac{75}{40}=\frac{15}{8}"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "algebra",
      "averages",
      "arrays"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-22",
    "title": "2009 AMC 8 Problem 22: No Digit 1",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 22,
    "category": "Counting & Probability",
    "subcategory": "Complementary counting",
    "difficulty": 4,
    "statement": "How many whole numbers between 1 and 1000 do not contain the digit 1?",
    "choices": [
      {
        "label": "A",
        "text": "512"
      },
      {
        "label": "B",
        "text": "648"
      },
      {
        "label": "C",
        "text": "720"
      },
      {
        "label": "D",
        "text": "728"
      },
      {
        "label": "E",
        "text": "800"
      }
    ],
    "answer": "D",
    "shortAnswer": "728",
    "solutionSteps": [
      {
        "title": "Use three digit slots",
        "body": "Count numbers from 000 to 999 that do not contain 1."
      },
      {
        "title": "Count choices",
        "body": "Each slot has 9 choices: all digits except 1.",
        "equation": "9^3=729"
      },
      {
        "title": "Remove zero",
        "body": "The number 000 represents 0, which is not between 1 and 1000, so subtract 1.",
        "equation": "729-1=728"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "counting",
      "digits",
      "complementary counting"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-23",
    "title": "2009 AMC 8 Problem 23: Jelly Beans for Class",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 23,
    "category": "Algebra",
    "subcategory": "Quadratic word problems",
    "difficulty": 5,
    "statement": "On the last day of school, Mrs. Wonderful gave jelly beans to her class. She gave each boy as many jelly beans as there were boys in the class. She gave each girl as many jelly beans as there were girls in the class. She brought 400 jelly beans, and when she finished, she had six jelly beans left. There were two more boys than girls in her class. How many students were in her class?",
    "choices": [
      {
        "label": "A",
        "text": "26"
      },
      {
        "label": "B",
        "text": "28"
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
    "answer": "B",
    "shortAnswer": "28",
    "solutionSteps": [
      {
        "title": "Set variables",
        "body": "Let x be the number of girls. Then there are x+2 boys."
      },
      {
        "title": "Set up jelly beans used",
        "body": "She used 400−6=394 jelly beans. Girls receive x^2 total and boys receive (x+2)^2 total.",
        "equation": "x^2+(x+2)^2=394"
      },
      {
        "title": "Solve",
        "body": "This simplifies to x^2+2x=195, so x=13. Then there are 13 girls and 15 boys, for 28 students.",
        "equation": "13+15=28"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
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
      "2009",
      "algebra",
      "quadratic",
      "word problem"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2009-24",
    "title": "2009 AMC 8 Problem 24: Cryptarithm Digit D",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 24,
    "category": "Logic",
    "subcategory": "Cryptarithms",
    "difficulty": 5,
    "statement": "The letters A, B, C and D represent digits. If AB − CA = A and AB + CA = DA, what digit does D represent?",
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
    "answer": "E",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Use the subtraction ones column",
        "body": "From B−A ending in A and the addition ones column B+A ending in A, B must be 0."
      },
      {
        "title": "Find A",
        "body": "Since 0−A requires borrowing and gives A, we get A=5."
      },
      {
        "title": "Find C and D",
        "body": "Using the tens columns gives C=4 and D=5+C=9.",
        "equation": "D=9"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
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
      "2009",
      "logic",
      "cryptarithm",
      "digits"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-24-cryptarithm.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2009-25",
    "title": "2009 AMC 8 Problem 25: Cut and Reassembled Cube",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2009,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 5,
    "statement": "A one-cubic-foot cube is cut into four pieces by three cuts parallel to the top face of the cube. The first cut is 1/2 foot from the top face. The second cut is 1/3 foot below the first cut, and the third cut is 1/17 foot below the second cut. From the top to the bottom the pieces are labeled A, B, C, and D. The pieces are then glued together end to end as shown in the second diagram. What is the total surface area of this solid in square feet?",
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
        "text": "419/51"
      },
      {
        "label": "D",
        "text": "158/17"
      },
      {
        "label": "E",
        "text": "11"
      }
    ],
    "answer": "E",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "Top and bottom areas",
        "body": "Each piece has top area 1 and bottom area 1. The four top faces total 4 and the four bottom faces total 4, giving 8."
      },
      {
        "title": "Two long side views",
        "body": "On two opposite sides, the stacked heights add to the original cube height 1, so these sides add 2 more square feet."
      },
      {
        "title": "Front and back views",
        "body": "The front view contributes 1/2 and the back view contributes 1/2. The total is 8+2+1=11.",
        "equation": "8+2+\frac12+\frac12=11"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the quantities and what the question asks for.",
        "visualHint": "Highlight the numbers, labels, or diagram pieces that matter."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the key equation, pattern, or counting idea step by step.",
        "visualHint": "Animate the main calculation or diagram transformation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Choice E is circled."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2009",
      "geometry",
      "surface area",
      "3D geometry"
    ],
    "sourceName": "2009 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2009/problem-25-cut-cube.svg"
    ],
    "needsDiagram": true
  }
];


const amc2010Problems: Problem[] = [
  {
    "id": "amc8-2010-01",
    "title": "2010 AMC 8 Problem 1: Euclid Middle School Contest Takers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Arithmetic",
    "difficulty": 1,
    "statement": "At Euclid Middle School the mathematics teachers are Mrs. Germain, Mr. Newton, and Mrs. Young. There are 11 students in Mrs. Germain's class, 8 students in Mr. Newton's class, and 9 students in Mrs. Young's class taking the AMC 8 this year. How many mathematics students at Euclid Middle School are taking the contest?",
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
        "title": "Add the classes",
        "body": "The three class counts are separate groups of students, so add them.",
        "equation": "11+8+9=28"
      },
      {
        "title": "Conclude",
        "body": "There are 28 students taking the contest, so the answer is C."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "arithmetic",
      "addition"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-02",
    "title": "2010 AMC 8 Problem 2: Custom Operation",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 2,
    "category": "Algebra",
    "subcategory": "Operations",
    "difficulty": 1,
    "statement": "If a @ b = (a × b)/(a + b) for positive integers a and b, then what is 5 @ 10?",
    "choices": [
      {
        "label": "A",
        "text": "3/10"
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
        "text": "10/3"
      },
      {
        "label": "E",
        "text": "50"
      }
    ],
    "answer": "D",
    "shortAnswer": "10/3",
    "solutionSteps": [
      {
        "title": "Substitute",
        "body": "Use a=5 and b=10 in the definition.",
        "equation": "5@10=(5×10)/(5+10)"
      },
      {
        "title": "Simplify",
        "body": "The value is 50/15, which reduces to 10/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "algebra",
      "operations",
      "custom operation"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-03",
    "title": "2010 AMC 8 Problem 3: Gasoline Bar Graph",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 2,
    "statement": "The graph shows the price of five gallons of gasoline during the first ten months of the year. By what percent is the highest price more than the lowest price?",
    "choices": [
      {
        "label": "A",
        "text": "50"
      },
      {
        "label": "B",
        "text": "62"
      },
      {
        "label": "C",
        "text": "70"
      },
      {
        "label": "D",
        "text": "89"
      },
      {
        "label": "E",
        "text": "100"
      }
    ],
    "answer": "C",
    "shortAnswer": "70",
    "solutionSteps": [
      {
        "title": "Read the graph",
        "body": "The highest price is 17 dollars and the lowest price is 10 dollars."
      },
      {
        "title": "Compare to the lowest price",
        "body": "The increase is 7 dollars, and 7 is 70% of 10.",
        "equation": "(17-10)/10=70%"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "algebra",
      "percents",
      "bar graph",
      "percent increase"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2010/problem-03-gas-prices.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2010-04",
    "title": "2010 AMC 8 Problem 4: Mean Median Mode Sum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Statistics",
    "difficulty": 1,
    "statement": "What is the sum of the mean, median, and mode of the numbers 2, 3, 0, 3, 1, 4, 0, 3?",
    "choices": [
      {
        "label": "A",
        "text": "6.5"
      },
      {
        "label": "B",
        "text": "7"
      },
      {
        "label": "C",
        "text": "7.5"
      },
      {
        "label": "D",
        "text": "8.5"
      },
      {
        "label": "E",
        "text": "9"
      }
    ],
    "answer": "C",
    "shortAnswer": "7.5",
    "solutionSteps": [
      {
        "title": "Find mode and median",
        "body": "Ordered list: 0,0,1,2,3,3,3,4. The mode is 3 and the median is (2+3)/2=2.5."
      },
      {
        "title": "Find mean and add",
        "body": "The mean is 16/8=2, so the total is 3+2.5+2=7.5."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "statistics",
      "mean",
      "median",
      "mode"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-05",
    "title": "2010 AMC 8 Problem 5: Stool Height",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Unit conversion",
    "difficulty": 1,
    "statement": "Alice needs to replace a light bulb located 10 centimeters below the ceiling in her kitchen. The ceiling is 2.4 meters above the floor. Alice is 1.5 meters tall and can reach 46 centimeters above the top of her head. Standing on a stool, she can just reach the light bulb. What is the height of the stool, in centimeters?",
    "choices": [
      {
        "label": "A",
        "text": "32"
      },
      {
        "label": "B",
        "text": "34"
      },
      {
        "label": "C",
        "text": "36"
      },
      {
        "label": "D",
        "text": "38"
      },
      {
        "label": "E",
        "text": "40"
      }
    ],
    "answer": "B",
    "shortAnswer": "34",
    "solutionSteps": [
      {
        "title": "Convert to centimeters",
        "body": "The ceiling is 240 cm high and Alice is 150 cm tall."
      },
      {
        "title": "Subtract reach from bulb height",
        "body": "The bulb is 10 cm below the ceiling, so its height is 230 cm. Alice reaches 150+46=196 cm from the floor, so the stool is 34 cm."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "unit conversion",
      "measurement",
      "unit conversion"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-06",
    "title": "2010 AMC 8 Problem 6: Lines of Symmetry",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Symmetry",
    "difficulty": 1,
    "statement": "Which of the following figures has the greatest number of lines of symmetry?",
    "choices": [
      {
        "label": "A",
        "text": "equilateral triangle"
      },
      {
        "label": "B",
        "text": "non-square rhombus"
      },
      {
        "label": "C",
        "text": "non-square rectangle"
      },
      {
        "label": "D",
        "text": "isosceles trapezoid"
      },
      {
        "label": "E",
        "text": "square"
      }
    ],
    "answer": "E",
    "shortAnswer": "square",
    "solutionSteps": [
      {
        "title": "Count symmetry lines",
        "body": "An equilateral triangle has 3, a non-square rhombus has 2, a non-square rectangle has 2, and an isosceles trapezoid has 1."
      },
      {
        "title": "Compare with square",
        "body": "A square has 4 lines of symmetry, the greatest number listed."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "symmetry",
      "symmetry"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-07",
    "title": "2010 AMC 8 Problem 7: Smallest Coin Set",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 7,
    "category": "Counting & Probability",
    "subcategory": "Constructive counting",
    "difficulty": 2,
    "statement": "Using only pennies, nickels, dimes, and quarters, what is the smallest number of coins Freddie would need so he could pay any amount of money less than a dollar?",
    "choices": [
      {
        "label": "A",
        "text": "6"
      },
      {
        "label": "B",
        "text": "10"
      },
      {
        "label": "C",
        "text": "15"
      },
      {
        "label": "D",
        "text": "25"
      },
      {
        "label": "E",
        "text": "99"
      }
    ],
    "answer": "B",
    "shortAnswer": "10",
    "solutionSteps": [
      {
        "title": "Cover cents digits",
        "body": "Four pennies and one nickel can make any amount from 0 through 9 cents."
      },
      {
        "title": "Cover tens values",
        "body": "Three quarters make 75 cents and two dimes fill the missing tens. The total is 4+1+2+3=10 coins."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "counting & probability",
      "constructive counting",
      "coins",
      "constructive counting"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-08",
    "title": "2010 AMC 8 Problem 8: Relative Motion",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 8,
    "category": "Algebra",
    "subcategory": "Rate",
    "difficulty": 2,
    "statement": "As Emily is riding her bicycle on a long straight road, she spots Emerson skating in the same direction 1/2 mile in front of her. After she passes him, she can see him in her rear mirror until he is 1/2 mile behind her. Emily rides at a constant rate of 12 miles per hour, and Emerson skates at a constant rate of 8 miles per hour. For how many minutes can Emily see Emerson?",
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
        "title": "Use relative speed",
        "body": "Emily gains on Emerson at 12-8=4 mph."
      },
      {
        "title": "Distance seen",
        "body": "She sees him while closing 1/2 mile and then gaining another 1/2 mile, for 1 mile total. At 4 mph, that takes 1/4 hour = 15 minutes."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "algebra",
      "rate",
      "rate",
      "relative speed"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-09",
    "title": "2010 AMC 8 Problem 9: Weighted Test Average",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 1,
    "statement": "Ryan got 80% of the problems correct on a 25-problem test, 90% on a 40-problem test, and 70% on a 10-problem test. What percent of all the problems did Ryan answer correctly?",
    "choices": [
      {
        "label": "A",
        "text": "64"
      },
      {
        "label": "B",
        "text": "75"
      },
      {
        "label": "C",
        "text": "80"
      },
      {
        "label": "D",
        "text": "84"
      },
      {
        "label": "E",
        "text": "86"
      }
    ],
    "answer": "D",
    "shortAnswer": "84",
    "solutionSteps": [
      {
        "title": "Count correct answers",
        "body": "Ryan got 20, 36, and 7 correct on the three tests."
      },
      {
        "title": "Divide by total questions",
        "body": "He got 63 correct out of 75 total, which is 84%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "algebra",
      "percents",
      "weighted average",
      "percent"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-10",
    "title": "2010 AMC 8 Problem 10: Pepperoni Coverage",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 10,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "Six pepperoni circles will exactly fit across the diameter of a 12-inch pizza when placed. If a total of 24 circles of pepperoni are placed on this pizza without overlap, what fraction of the pizza is covered by pepperoni?",
    "choices": [
      {
        "label": "A",
        "text": "1/2"
      },
      {
        "label": "B",
        "text": "2/3"
      },
      {
        "label": "C",
        "text": "3/4"
      },
      {
        "label": "D",
        "text": "5/6"
      },
      {
        "label": "E",
        "text": "7/8"
      }
    ],
    "answer": "B",
    "shortAnswer": "2/3",
    "solutionSteps": [
      {
        "title": "Find pepperoni size",
        "body": "Each pepperoni has diameter 12/6=2, so radius 1."
      },
      {
        "title": "Compare areas",
        "body": "The 24 pepperonis have total area 24π. The pizza has radius 6 and area 36π, so the fraction is 24π/36π=2/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "area",
      "circle area",
      "ratio"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-11",
    "title": "2010 AMC 8 Problem 11: Tree Heights Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 2,
    "statement": "The top of one tree is 16 feet higher than the top of another tree. The heights of the two trees are in the ratio 3:4. In feet, how tall is the taller tree?",
    "choices": [
      {
        "label": "A",
        "text": "48"
      },
      {
        "label": "B",
        "text": "64"
      },
      {
        "label": "C",
        "text": "80"
      },
      {
        "label": "D",
        "text": "96"
      },
      {
        "label": "E",
        "text": "112"
      }
    ],
    "answer": "B",
    "shortAnswer": "64",
    "solutionSteps": [
      {
        "title": "Use ratio parts",
        "body": "The difference between 3 parts and 4 parts is 1 part, and that difference is 16 feet."
      },
      {
        "title": "Find taller tree",
        "body": "The taller tree is 4 parts, so its height is 4×16=64 feet."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "ratios",
      "ratios"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-12",
    "title": "2010 AMC 8 Problem 12: Removing Red Balls",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 2,
    "statement": "Of the 500 balls in a large bag, 80% are red and the rest are blue. How many of the red balls must be removed so that 75% of the remaining balls are red?",
    "choices": [
      {
        "label": "A",
        "text": "25"
      },
      {
        "label": "B",
        "text": "50"
      },
      {
        "label": "C",
        "text": "75"
      },
      {
        "label": "D",
        "text": "100"
      },
      {
        "label": "E",
        "text": "150"
      }
    ],
    "answer": "D",
    "shortAnswer": "100",
    "solutionSteps": [
      {
        "title": "Count colors",
        "body": "There are 400 red balls and 100 blue balls."
      },
      {
        "title": "Use desired percentage",
        "body": "If 75% are red, then 25% are blue. The 100 blue balls must be 25% of the bag, so 400 balls remain. Remove 100 red balls."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "algebra",
      "percents",
      "percents"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-13",
    "title": "2010 AMC 8 Problem 13: Consecutive Triangle Sides",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 13,
    "category": "Algebra",
    "subcategory": "Consecutive integers",
    "difficulty": 2,
    "statement": "The lengths of the sides of a triangle in inches are three consecutive integers. The length of the shortest side is 30% of the perimeter. What is the length of the longest side?",
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
    "answer": "E",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "Set up sides",
        "body": "Let the sides be n, n+1, and n+2. The perimeter is 3n+3."
      },
      {
        "title": "Use 30 percent",
        "body": "The shortest side is 30% of the perimeter: n=0.3(3n+3), so n=9. The longest side is 11."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "consecutive integers",
      "consecutive integers",
      "triangle"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-14",
    "title": "2010 AMC 8 Problem 14: Prime Factors of 2010",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 14,
    "category": "Number Theory",
    "subcategory": "Prime factorization",
    "difficulty": 2,
    "statement": "What is the sum of the prime factors of 2010?",
    "choices": [
      {
        "label": "A",
        "text": "67"
      },
      {
        "label": "B",
        "text": "75"
      },
      {
        "label": "C",
        "text": "77"
      },
      {
        "label": "D",
        "text": "201"
      },
      {
        "label": "E",
        "text": "210"
      }
    ],
    "answer": "C",
    "shortAnswer": "77",
    "solutionSteps": [
      {
        "title": "Factor 2010",
        "body": "2010=2×3×5×67."
      },
      {
        "title": "Add prime factors",
        "body": "The sum is 2+3+5+67=77."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "number theory",
      "prime factorization",
      "prime factorization"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-15",
    "title": "2010 AMC 8 Problem 15: Gumdrops Recolored",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Percents",
    "difficulty": 2,
    "statement": "A jar contains 5 different colors of gumdrops. 30% are blue, 20% are brown, 15% are red, 10% are yellow, and the other 30 gumdrops are green. If half of the blue gumdrops are replaced with brown gumdrops, how many gumdrops will be brown?",
    "choices": [
      {
        "label": "A",
        "text": "35"
      },
      {
        "label": "B",
        "text": "36"
      },
      {
        "label": "C",
        "text": "42"
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
    "shortAnswer": "42",
    "solutionSteps": [
      {
        "title": "Find total gumdrops",
        "body": "The listed percentages total 75%, so green is 25%. If 30 gumdrops are 25%, the jar has 120 gumdrops."
      },
      {
        "title": "Find new brown count",
        "body": "Brown becomes 20% plus half of the 30% blue, or 35% of the jar. 35% of 120 is 42."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "percents",
      "percents"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-16",
    "title": "2010 AMC 8 Problem 16: Equal Area Square and Circle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 16,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "A square and a circle have the same area. What is the ratio of the side length of the square to the radius of the circle?",
    "choices": [
      {
        "label": "A",
        "text": "sqrt(pi)/2"
      },
      {
        "label": "B",
        "text": "sqrt(pi)"
      },
      {
        "label": "C",
        "text": "pi"
      },
      {
        "label": "D",
        "text": "2pi"
      },
      {
        "label": "E",
        "text": "pi^2"
      }
    ],
    "answer": "B",
    "shortAnswer": "sqrt(pi)",
    "solutionSteps": [
      {
        "title": "Equate areas",
        "body": "If the square side is s and the circle radius is r, then s^2=πr^2."
      },
      {
        "title": "Take square roots",
        "body": "Dividing by r^2 gives (s/r)^2=π, so s/r=sqrt(π)."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "area",
      "circle area",
      "square root"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-17",
    "title": "2010 AMC 8 Problem 17: Octagon Area Bisector",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 17,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "The diagram shows an octagon consisting of 10 unit squares. The portion below PQ is a unit square and a triangle with base 5. If PQ bisects the area of the octagon, what is the ratio XQ/QY?",
    "choices": [
      {
        "label": "A",
        "text": "2/5"
      },
      {
        "label": "B",
        "text": "1/2"
      },
      {
        "label": "C",
        "text": "3/5"
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
        "title": "Half the area",
        "body": "The octagon has area 10, so the region below PQ must have area 5."
      },
      {
        "title": "Solve for QY",
        "body": "Below PQ is one unit square plus a triangle of base 5. The triangle must have area 4, so 5h/2=4 and h=8/5. Thus QY=8/5-1=3/5 and XQ=2/5."
      },
      {
        "title": "Take the ratio",
        "body": "XQ/QY=(2/5)/(3/5)=2/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "area",
      "area",
      "ratio"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2010/problem-17-octagon-bisector.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2010-18",
    "title": "2010 AMC 8 Problem 18: Decorative Window",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 18,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "A decorative window is made up of a rectangle with semicircles at either end. The ratio of AD to AB is 3:2. And AB is 30 inches. What is the ratio of the area of the rectangle to the combined area of the semicircles?",
    "choices": [
      {
        "label": "A",
        "text": "2:3"
      },
      {
        "label": "B",
        "text": "3:2"
      },
      {
        "label": "C",
        "text": "6:pi"
      },
      {
        "label": "D",
        "text": "9:pi"
      },
      {
        "label": "E",
        "text": "30:pi"
      }
    ],
    "answer": "C",
    "shortAnswer": "6:pi",
    "solutionSteps": [
      {
        "title": "Find rectangle dimensions",
        "body": "Since AD:AB=3:2 and AB=30, AD=45."
      },
      {
        "title": "Compare areas",
        "body": "The rectangle area is 30×45=1350. The two semicircles combine to one circle of radius 15, area 225π. The ratio is 1350:225π=6:π."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "area",
      "area",
      "semicircle"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2010/problem-18-window.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2010-19",
    "title": "2010 AMC 8 Problem 19: Area Between Concentric Circles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Circle geometry",
    "difficulty": 3,
    "statement": "The two circles pictured have the same center C. Chord AD is tangent to the inner circle at B, AC is 10, and chord AD has length 16. What is the area between the two circles?",
    "choices": [
      {
        "label": "A",
        "text": "36π"
      },
      {
        "label": "B",
        "text": "49π"
      },
      {
        "label": "C",
        "text": "64π"
      },
      {
        "label": "D",
        "text": "81π"
      },
      {
        "label": "E",
        "text": "100π"
      }
    ],
    "answer": "C",
    "shortAnswer": "64π",
    "solutionSteps": [
      {
        "title": "Find inner radius",
        "body": "The radius to a tangent chord bisects the chord, so AB=8. In right triangle ACB, AC=10 and AB=8, so CB=6."
      },
      {
        "title": "Subtract circle areas",
        "body": "The outer radius is 10 and the inner radius is 6, so the annulus area is 100π-36π=64π."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "circle geometry",
      "circle geometry",
      "pythagorean theorem"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2010/problem-19-concentric-circles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2010-20",
    "title": "2010 AMC 8 Problem 20: Hats and Gloves",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 20,
    "category": "Counting & Probability",
    "subcategory": "Inclusion-exclusion",
    "difficulty": 3,
    "statement": "In a room, 2/5 of the people are wearing gloves, and 3/4 of the people are wearing hats. What is the minimum number of people in the room wearing both a hat and gloves?",
    "choices": [
      {
        "label": "A",
        "text": "3"
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
        "text": "15"
      },
      {
        "label": "E",
        "text": "20"
      }
    ],
    "answer": "A",
    "shortAnswer": "3",
    "solutionSteps": [
      {
        "title": "Choose the smallest total",
        "body": "The total number of people must be a multiple of 5 and 4, so use 20."
      },
      {
        "title": "Use inclusion-exclusion",
        "body": "Then 8 wear gloves and 15 wear hats. If everyone wears at least one item, overlap is 8+15-20=3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "venn",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "counting & probability",
      "inclusion-exclusion",
      "inclusion-exclusion",
      "fractions"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-21",
    "title": "2010 AMC 8 Problem 21: Hui's Reading Plan",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 21,
    "category": "Algebra",
    "subcategory": "Equations",
    "difficulty": 4,
    "statement": "Hui is an avid reader. She bought a copy of the best seller Math is Beautiful. On the first day, Hui read 1/5 of the pages plus 12 more, and on the second day she read 1/4 of the remaining pages plus 15 pages. On the third day she read 1/3 of the remaining pages plus 18 pages. She then realized that there were only 62 pages left to read, which she read the next day. How many pages are in this book?",
    "choices": [
      {
        "label": "A",
        "text": "120"
      },
      {
        "label": "B",
        "text": "180"
      },
      {
        "label": "C",
        "text": "240"
      },
      {
        "label": "D",
        "text": "300"
      },
      {
        "label": "E",
        "text": "360"
      }
    ],
    "answer": "C",
    "shortAnswer": "240",
    "solutionSteps": [
      {
        "title": "Work with x pages",
        "body": "Let x be the total number of pages. After day 1, 4x/5-12 pages remain."
      },
      {
        "title": "Continue the remaining pages",
        "body": "After day 2, 3x/5-24 remain. After day 3, 2x/5-34 remain."
      },
      {
        "title": "Solve",
        "body": "Set 2x/5-34=62. Then 2x/5=96, so x=240."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "equations",
      "equations",
      "fractions"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-22",
    "title": "2010 AMC 8 Problem 22: Reversed Three-Digit Number",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 22,
    "category": "Algebra",
    "subcategory": "Digits",
    "difficulty": 3,
    "statement": "The hundreds digit of a three-digit number is 2 more than the units digit. The digits of the three-digit number are reversed, and the result is subtracted from the original three-digit number. What is the units digit of the result?",
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
    "answer": "E",
    "shortAnswer": "8",
    "solutionSteps": [
      {
        "title": "Use place value",
        "body": "Let the units digit be c. Then the hundreds digit is c+2."
      },
      {
        "title": "Subtract reversed number",
        "body": "The difference is 100(c+2)+10b+c - [100c+10b+(c+2)] = 198. The units digit is 8."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "algebra",
      "digits",
      "digits",
      "place value"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-23",
    "title": "2010 AMC 8 Problem 23: Semicircles Through the Center",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Coordinate geometry",
    "difficulty": 4,
    "statement": "Semicircles POQ and ROS pass through the center O. What is the ratio of the combined areas of the two semicircles to the area of circle O?",
    "choices": [
      {
        "label": "A",
        "text": "sqrt(2)/4"
      },
      {
        "label": "B",
        "text": "1/2"
      },
      {
        "label": "C",
        "text": "2/pi"
      },
      {
        "label": "D",
        "text": "2/3"
      },
      {
        "label": "E",
        "text": "sqrt(2)/2"
      }
    ],
    "answer": "B",
    "shortAnswer": "1/2",
    "solutionSteps": [
      {
        "title": "Find the large circle area",
        "body": "The large circle has radius sqrt(2), using the points (1,1) and (-1,1), so its area is 2π."
      },
      {
        "title": "Find semicircle areas",
        "body": "Each semicircle has radius 1. Together, the two semicircles have area π."
      },
      {
        "title": "Take the ratio",
        "body": "The ratio is π/(2π)=1/2."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "geometry",
      "coordinate geometry",
      "coordinate geometry",
      "circle area"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2010/problem-23-semicircles-coordinate.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2010-24",
    "title": "2010 AMC 8 Problem 24: Ordering Powers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 24,
    "category": "Number Theory",
    "subcategory": "Exponents",
    "difficulty": 4,
    "statement": "What is the correct ordering of the three numbers 10^8, 5^12, and 2^24?",
    "choices": [
      {
        "label": "A",
        "text": "2^24 < 10^8 < 5^12"
      },
      {
        "label": "B",
        "text": "2^24 < 5^12 < 10^8"
      },
      {
        "label": "C",
        "text": "5^12 < 2^24 < 10^8"
      },
      {
        "label": "D",
        "text": "10^8 < 5^12 < 2^24"
      },
      {
        "label": "E",
        "text": "10^8 < 2^24 < 5^12"
      }
    ],
    "answer": "A",
    "shortAnswer": "2^24 < 10^8 < 5^12",
    "solutionSteps": [
      {
        "title": "Take fourth roots",
        "body": "All exponents are multiples of 4, so compare fourth roots."
      },
      {
        "title": "Compare simpler numbers",
        "body": "The fourth roots are 2^6=64, 10^2=100, and 5^3=125. Therefore 2^24 < 10^8 < 5^12."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2010",
      "number theory",
      "exponents",
      "exponents",
      "comparison"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2010-25",
    "title": "2010 AMC 8 Problem 25: Climbing Six Stairs",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2010,
    "problemNumber": 25,
    "category": "Counting & Probability",
    "subcategory": "Recursion",
    "difficulty": 4,
    "statement": "Everyday at school, Jo climbs a flight of 6 stairs. Jo can take the stairs 1, 2, or 3 at a time. For example, Jo could climb 3, then 1, then 2. In how many ways can Jo climb the stairs?",
    "choices": [
      {
        "label": "A",
        "text": "13"
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
        "text": "22"
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
        "title": "Use recurrence",
        "body": "Let f(n) be the number of ways to reach step n. Then f(n)=f(n-1)+f(n-2)+f(n-3)."
      },
      {
        "title": "Build up",
        "body": "f(1)=1, f(2)=2, f(3)=4, so f(4)=7, f(5)=13, and f(6)=24."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2010",
      "counting & probability",
      "recursion",
      "recursion",
      "counting"
    ],
    "sourceName": "2010 AMC 8",
    "license": "CC BY-NC-SA"
  }
];


const amc2011Problems: Problem[] = [
  {
    "id": "amc8-2011-01",
    "title": "2011 AMC 8 Problem 1: Apple Change",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Arithmetic",
    "difficulty": 1,
    "statement": "Margie bought 3 apples at a cost of 50 cents per apple. She paid with a 5-dollar bill. How much change did Margie receive?",
    "choices": [
      {
        "label": "A",
        "text": "$1.50"
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
        "text": "$3.00"
      },
      {
        "label": "E",
        "text": "$3.50"
      }
    ],
    "answer": "E",
    "shortAnswer": "$3.50",
    "solutionSteps": [
      {
        "title": "Find the apple cost",
        "body": "Each apple costs $0.50, so 3 apples cost $1.50.",
        "equation": "3×$0.50=$1.50"
      },
      {
        "title": "Subtract from five dollars",
        "body": "Margie's change is $5.00-$1.50=$3.50."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "algebra",
      "arithmetic",
      "money",
      "subtraction"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-02",
    "title": "2011 AMC 8 Problem 2: Comparing Garden Areas",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 2,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 1,
    "statement": "Karl's rectangular vegetable garden is 20 feet by 45 feet, and Makenna's is 25 feet by 40 feet. Whose garden is larger in area?",
    "choices": [
      {
        "label": "A",
        "text": "Karl's garden is larger by 100 square feet."
      },
      {
        "label": "B",
        "text": "Karl's garden is larger by 25 square feet."
      },
      {
        "label": "C",
        "text": "The gardens are the same size."
      },
      {
        "label": "D",
        "text": "Makenna's garden is larger by 25 square feet."
      },
      {
        "label": "E",
        "text": "Makenna's garden is larger by 100 square feet."
      }
    ],
    "answer": "E",
    "shortAnswer": "Makenna's garden is larger by 100 square feet.",
    "solutionSteps": [
      {
        "title": "Compute Karl's area",
        "body": "Karl's garden has area 20×45=900 square feet."
      },
      {
        "title": "Compute Makenna's area",
        "body": "Makenna's garden has area 25×40=1000 square feet, which is 100 more."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "area",
      "rectangle area"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-03",
    "title": "2011 AMC 8 Problem 3: Black Border Tiles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 3,
    "category": "Geometry",
    "subcategory": "Counting area",
    "difficulty": 2,
    "statement": "Extend the square pattern of 8 black and 17 white square tiles by attaching a border of black tiles around the square. What is the ratio of black tiles to white tiles in the extended pattern?",
    "choices": [
      {
        "label": "A",
        "text": "8:17"
      },
      {
        "label": "B",
        "text": "25:49"
      },
      {
        "label": "C",
        "text": "36:25"
      },
      {
        "label": "D",
        "text": "32:17"
      },
      {
        "label": "E",
        "text": "36:17"
      }
    ],
    "answer": "D",
    "shortAnswer": "32:17",
    "solutionSteps": [
      {
        "title": "Count the new border",
        "body": "The original pattern is 5 by 5. Adding a one-tile border makes a 7 by 7 square, adding 49-25=24 black tiles."
      },
      {
        "title": "Add black tiles",
        "body": "The new number of black tiles is 8+24=32. The number of white tiles stays 17."
      },
      {
        "title": "Form the ratio",
        "body": "The ratio of black to white tiles is 32:17."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "counting area",
      "tiles",
      "ratio"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-03-black-border-pattern.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-04",
    "title": "2011 AMC 8 Problem 4: Fish Data Mean Median Mode",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Statistics",
    "difficulty": 2,
    "statement": "Here is a list of the numbers of fish that Tyler caught in nine outings last summer: 2, 0, 1, 3, 0, 3, 3, 1, 2. Which statement about the mean, median, and mode is true?",
    "choices": [
      {
        "label": "A",
        "text": "median < mean < mode"
      },
      {
        "label": "B",
        "text": "mean < mode < median"
      },
      {
        "label": "C",
        "text": "mean < median < mode"
      },
      {
        "label": "D",
        "text": "median < mode < mean"
      },
      {
        "label": "E",
        "text": "mode < median < mean"
      }
    ],
    "answer": "C",
    "shortAnswer": "mean < median < mode",
    "solutionSteps": [
      {
        "title": "Order the data",
        "body": "In increasing order the data are 0, 0, 1, 1, 2, 2, 3, 3, 3."
      },
      {
        "title": "Find the statistics",
        "body": "The mean is 15/9, the median is 2, and the mode is 3."
      },
      {
        "title": "Compare",
        "body": "Since 15/9 < 2 < 3, the correct order is mean < median < mode."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "algebra",
      "statistics",
      "mean",
      "median",
      "mode"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-05",
    "title": "2011 AMC 8 Problem 5: 2011 Minutes After Midnight",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Time",
    "difficulty": 1,
    "statement": "What time was it 2011 minutes after midnight on January 1, 2011?",
    "choices": [
      {
        "label": "A",
        "text": "January 1 at 9:31PM"
      },
      {
        "label": "B",
        "text": "January 1 at 11:51PM"
      },
      {
        "label": "C",
        "text": "January 2 at 3:11AM"
      },
      {
        "label": "D",
        "text": "January 2 at 9:31AM"
      },
      {
        "label": "E",
        "text": "January 2 at 6:01PM"
      }
    ],
    "answer": "D",
    "shortAnswer": "January 2 at 9:31AM",
    "solutionSteps": [
      {
        "title": "Convert minutes to hours",
        "body": "2011 minutes is 33 hours and 31 minutes."
      },
      {
        "title": "Move past one full day",
        "body": "After 24 hours it is midnight on January 2. The remaining 9 hours and 31 minutes gives January 2 at 9:31AM."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "algebra",
      "time",
      "time",
      "unit conversion"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-06",
    "title": "2011 AMC 8 Problem 6: Cars and Motorcycles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 6,
    "category": "Counting & Probability",
    "subcategory": "Inclusion-exclusion",
    "difficulty": 2,
    "statement": "In a town of 351 adults, every adult owns a car, motorcycle, or both. If 331 adults own cars and 45 adults own motorcycles, how many of the car owners do not own a motorcycle?",
    "choices": [
      {
        "label": "A",
        "text": "20"
      },
      {
        "label": "B",
        "text": "25"
      },
      {
        "label": "C",
        "text": "45"
      },
      {
        "label": "D",
        "text": "306"
      },
      {
        "label": "E",
        "text": "351"
      }
    ],
    "answer": "D",
    "shortAnswer": "306",
    "solutionSteps": [
      {
        "title": "Find the overlap",
        "body": "By inclusion-exclusion, the number who own both is 331+45-351=25."
      },
      {
        "title": "Subtract from car owners",
        "body": "The car-only owners are 331-25=306."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "venn",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2011",
      "counting & probability",
      "inclusion-exclusion",
      "inclusion-exclusion"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-07",
    "title": "2011 AMC 8 Problem 7: Bolded Area Percent",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 7,
    "category": "Geometry",
    "subcategory": "Area fractions",
    "difficulty": 3,
    "statement": "Each of the following four large congruent squares is subdivided into combinations of congruent triangles or rectangles and is partially bolded. What percent of the total area is partially bolded?",
    "choices": [
      {
        "label": "A",
        "text": "12 1/2"
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
        "text": "33 1/3"
      },
      {
        "label": "E",
        "text": "37 1/2"
      }
    ],
    "answer": "C",
    "shortAnswer": "25",
    "solutionSteps": [
      {
        "title": "Use each square as area 1",
        "body": "The four bolded areas are 1/4, 1/8, 3/8, and 1/4."
      },
      {
        "title": "Add bolded area",
        "body": "The total bolded area is 1/4+1/8+3/8+1/4=1."
      },
      {
        "title": "Convert to a percent",
        "body": "The total area of the four squares is 4, so the percent bolded is 1/4=25%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "area fractions",
      "area fractions",
      "percentage"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-07-bolded-squares.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-08",
    "title": "2011 AMC 8 Problem 8: Chip Sum Values",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 8,
    "category": "Counting & Probability",
    "subcategory": "Counting sums",
    "difficulty": 1,
    "statement": "Bag A has three chips labeled 1, 3, and 5. Bag B has three chips labeled 2, 4, and 6. If one chip is drawn from each bag, how many different values are possible for the sum of the two numbers on the chips?",
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
        "title": "List possible sums",
        "body": "The possible sums are 3, 5, 7, 9, and 11."
      },
      {
        "title": "Count distinct values",
        "body": "There are 5 different values."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "counting & probability",
      "counting sums",
      "counting",
      "sums"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-09",
    "title": "2011 AMC 8 Problem 9: Carmen's Average Speed",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Graphs",
    "difficulty": 2,
    "statement": "Carmen takes a long bike ride on a hilly highway. The graph indicates the miles traveled during the time of her ride. What is Carmen's average speed for her entire ride in miles per hour?",
    "choices": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "2.5"
      },
      {
        "label": "C",
        "text": "4"
      },
      {
        "label": "D",
        "text": "4.5"
      },
      {
        "label": "E",
        "text": "5"
      }
    ],
    "answer": "E",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Read total distance and time",
        "body": "From the graph, Carmen travels 35 miles in 7 hours."
      },
      {
        "title": "Compute average speed",
        "body": "Average speed is total distance divided by total time: 35/7=5 miles per hour."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "algebra",
      "graphs",
      "distance-time graph",
      "average speed"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-09-bike-ride-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-10",
    "title": "2011 AMC 8 Problem 10: Taxi Fare",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 10,
    "category": "Algebra",
    "subcategory": "Linear equations",
    "difficulty": 2,
    "statement": "The taxi fare in Gotham City is $2.40 for the first 1/2 mile and additional mileage charged at the rate $0.20 for each additional 0.1 mile. You plan to give the driver a $2 tip. How many miles can you ride for $10?",
    "choices": [
      {
        "label": "A",
        "text": "3.0"
      },
      {
        "label": "B",
        "text": "3.25"
      },
      {
        "label": "C",
        "text": "3.3"
      },
      {
        "label": "D",
        "text": "3.5"
      },
      {
        "label": "E",
        "text": "3.75"
      }
    ],
    "answer": "C",
    "shortAnswer": "3.3",
    "solutionSteps": [
      {
        "title": "Account for base fare and tip",
        "body": "After paying the $2.40 base fare and $2 tip, $5.60 remains for extra mileage."
      },
      {
        "title": "Convert extra mileage cost",
        "body": "At $0.20 per 0.1 mile, the extra mileage costs $2 per mile. So $5.60 buys 2.8 extra miles."
      },
      {
        "title": "Add the first half mile",
        "body": "The total distance is 0.5+2.8=3.3 miles."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "algebra",
      "linear equations",
      "linear equation",
      "rates"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-11",
    "title": "2011 AMC 8 Problem 11: Asha and Sasha Study Bars",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Bar graphs",
    "difficulty": 2,
    "statement": "The graph shows the number of minutes studied by both Asha (black bar) and Sasha (grey bar) in one week. On the average, how many more minutes per day did Sasha study than Asha?",
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
        "text": "12"
      }
    ],
    "answer": "A",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Find daily differences",
        "body": "Sasha minus Asha for the five days is 10, -10, 20, 30, and -20 minutes."
      },
      {
        "title": "Average the differences",
        "body": "The sum is 30, and 30/5=6 minutes per day."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "graph-read",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2011",
      "algebra",
      "bar graphs",
      "bar graph",
      "average"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-11-study-bar-graph.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-12",
    "title": "2011 AMC 8 Problem 12: Opposite Seats",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 12,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "Angie, Bridget, Carlos, and Diego are seated at random around a square table, one person to a side. What is the probability that Angie and Carlos are seated opposite each other?",
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
    "answer": "B",
    "shortAnswer": "1/3",
    "solutionSteps": [
      {
        "title": "Fix Angie's seat",
        "body": "Once Angie's seat is fixed, Carlos has 3 possible remaining seats."
      },
      {
        "title": "Count favorable seats",
        "body": "Only one of those seats is opposite Angie, so the probability is 1/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "counting & probability",
      "probability",
      "probability",
      "seating"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-13",
    "title": "2011 AMC 8 Problem 13: Overlapping Squares",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 13,
    "category": "Geometry",
    "subcategory": "Area percent",
    "difficulty": 2,
    "statement": "Two congruent squares, ABCD and PQRS, have side length 15. They overlap to form the 15 by 25 rectangle AQRD shown. What percent of the area of rectangle AQRD is shaded?",
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
        "text": "25"
      }
    ],
    "answer": "C",
    "shortAnswer": "20",
    "solutionSteps": [
      {
        "title": "Find the overlap width",
        "body": "The rectangle has width 25 while the two side-15 squares together would have width 30, so the overlap width is 5."
      },
      {
        "title": "Compare areas",
        "body": "The shaded overlap area is 5×15=75. The rectangle area is 25×15=375."
      },
      {
        "title": "Convert to percent",
        "body": "75/375=1/5=20%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "area percent",
      "overlap area",
      "percent"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-13-overlap-squares.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-14",
    "title": "2011 AMC 8 Problem 14: Girls at the Dance",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 14,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 2,
    "statement": "There are 270 students at Colfax Middle School, where the ratio of boys to girls is 5:4. There are 180 students at Winthrop Middle School, where the ratio of boys to girls is 4:5. The two schools hold a dance and all students from both schools attend. What fraction of the students at the dance are girls?",
    "choices": [
      {
        "label": "A",
        "text": "7/18"
      },
      {
        "label": "B",
        "text": "7/15"
      },
      {
        "label": "C",
        "text": "22/45"
      },
      {
        "label": "D",
        "text": "1/2"
      },
      {
        "label": "E",
        "text": "23/45"
      }
    ],
    "answer": "C",
    "shortAnswer": "22/45",
    "solutionSteps": [
      {
        "title": "Find girls at each school",
        "body": "At Colfax, girls are 4/9 of 270, or 120. At Winthrop, girls are 5/9 of 180, or 100."
      },
      {
        "title": "Form the fraction",
        "body": "There are 220 girls out of 450 students total. The fraction is 220/450=22/45."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2011",
      "algebra",
      "ratios",
      "ratios",
      "fractions"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-15",
    "title": "2011 AMC 8 Problem 15: Digits in a Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 15,
    "category": "Number Theory",
    "subcategory": "Exponents",
    "difficulty": 3,
    "statement": "How many digits are in the product 4^5 · 5^10?",
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
    "answer": "D",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "Rewrite powers",
        "body": "4^5=(2^2)^5=2^10."
      },
      {
        "title": "Make a power of ten",
        "body": "2^10·5^10=10^10, which is 1 followed by 10 zeros."
      },
      {
        "title": "Count digits",
        "body": "10^10 has 11 digits."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "number theory",
      "exponents",
      "exponents",
      "digits"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-16",
    "title": "2011 AMC 8 Problem 16: Areas of Isosceles Triangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 16,
    "category": "Geometry",
    "subcategory": "Triangle area",
    "difficulty": 3,
    "statement": "Let A be the area of the triangle with sides of length 25, 25, and 30. Let B be the area of the triangle with sides of length 25, 25, and 40. What is the relationship between A and B?",
    "choices": [
      {
        "label": "A",
        "text": "A = 9/16 B"
      },
      {
        "label": "B",
        "text": "A = 3/4 B"
      },
      {
        "label": "C",
        "text": "A = B"
      },
      {
        "label": "D",
        "text": "A = 4/3 B"
      },
      {
        "label": "E",
        "text": "A = 16/9 B"
      }
    ],
    "answer": "C",
    "shortAnswer": "A = B",
    "solutionSteps": [
      {
        "title": "Drop altitudes",
        "body": "The 25-25-30 triangle splits into two 15-20-25 right triangles."
      },
      {
        "title": "Compare with the second triangle",
        "body": "The 25-25-40 triangle splits into two 20-15-25 right triangles."
      },
      {
        "title": "Conclude",
        "body": "Both triangles are made from two congruent 15-20-25 right triangles, so their areas are equal."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "triangle area",
      "pythagorean theorem",
      "area"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-17",
    "title": "2011 AMC 8 Problem 17: Prime Factor Exponents",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 17,
    "category": "Number Theory",
    "subcategory": "Prime factorization",
    "difficulty": 2,
    "statement": "Let w, x, y, and z be whole numbers. If 2^w · 3^x · 5^y · 7^z = 588, then what does 2w + 3x + 5y + 7z equal?",
    "choices": [
      {
        "label": "A",
        "text": "21"
      },
      {
        "label": "B",
        "text": "25"
      },
      {
        "label": "C",
        "text": "27"
      },
      {
        "label": "D",
        "text": "35"
      },
      {
        "label": "E",
        "text": "56"
      }
    ],
    "answer": "A",
    "shortAnswer": "21",
    "solutionSteps": [
      {
        "title": "Factor 588",
        "body": "588=2^2·3^1·5^0·7^2."
      },
      {
        "title": "Substitute exponents",
        "body": "w=2, x=1, y=0, z=2, so 2w+3x+5y+7z=4+3+0+14=21."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "number theory",
      "prime factorization",
      "prime factorization",
      "exponents"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-18",
    "title": "2011 AMC 8 Problem 18: First Die at Least Second",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 18,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 3,
    "statement": "A fair 6-sided die is rolled twice. What is the probability that the first number that comes up is greater than or equal to the second number?",
    "choices": [
      {
        "label": "A",
        "text": "1/6"
      },
      {
        "label": "B",
        "text": "5/12"
      },
      {
        "label": "C",
        "text": "1/2"
      },
      {
        "label": "D",
        "text": "7/12"
      },
      {
        "label": "E",
        "text": "5/6"
      }
    ],
    "answer": "D",
    "shortAnswer": "7/12",
    "solutionSteps": [
      {
        "title": "Count equal rolls",
        "body": "There are 36 total outcomes and 6 outcomes where the two rolls are equal."
      },
      {
        "title": "Split unequal rolls",
        "body": "Of the remaining 30 outcomes, half have the first roll larger, so 15 outcomes."
      },
      {
        "title": "Add favorable outcomes",
        "body": "The favorable outcomes are 15+6=21, and 21/36=7/12."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "counting & probability",
      "probability",
      "dice",
      "probability"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-19",
    "title": "2011 AMC 8 Problem 19: Counting Rectangles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Counting geometry",
    "difficulty": 3,
    "statement": "How many rectangles are in this figure?",
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
    "answer": "D",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "Split into regions",
        "body": "The overlapping outlines divide the figure into useful rectangular sections."
      },
      {
        "title": "Count by size",
        "body": "There are 3 rectangles using one section, 5 using two sections, none using three sections, and 3 using four sections."
      },
      {
        "title": "Add",
        "body": "The total is 3+5+3=11 rectangles."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "counting geometry",
      "rectangles",
      "counting"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-19-rectangles-count.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-20",
    "title": "2011 AMC 8 Problem 20: Trapezoid Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 20,
    "category": "Geometry",
    "subcategory": "Trapezoid area",
    "difficulty": 3,
    "statement": "Quadrilateral ABCD is a trapezoid, AD = 15, AB = 50, BC = 20, and the altitude is 12. What is the area of the trapezoid?",
    "choices": [
      {
        "label": "A",
        "text": "600"
      },
      {
        "label": "B",
        "text": "650"
      },
      {
        "label": "C",
        "text": "700"
      },
      {
        "label": "D",
        "text": "750"
      },
      {
        "label": "E",
        "text": "800"
      }
    ],
    "answer": "D",
    "shortAnswer": "750",
    "solutionSteps": [
      {
        "title": "Find horizontal offsets",
        "body": "The left right triangle has hypotenuse 15 and height 12, so its base is 9. The right triangle has hypotenuse 20 and height 12, so its base is 16."
      },
      {
        "title": "Find the longer base",
        "body": "CD=9+50+16=75."
      },
      {
        "title": "Use trapezoid area",
        "body": "The area is 12(50+75)/2=750."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "trapezoid area",
      "pythagorean theorem",
      "trapezoid"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-20-trapezoid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2011-21",
    "title": "2011 AMC 8 Problem 21: Norb's Prime Age",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 21,
    "category": "Logic",
    "subcategory": "Constraints",
    "difficulty": 3,
    "statement": "Students guess that Norb's age is 24, 28, 30, 32, 36, 38, 41, 44, 47, and 49. Norb says, 'At least half of you guessed too low, two of you are off by one, and my age is a prime number.' How old is Norb?",
    "choices": [
      {
        "label": "A",
        "text": "29"
      },
      {
        "label": "B",
        "text": "31"
      },
      {
        "label": "C",
        "text": "37"
      },
      {
        "label": "D",
        "text": "43"
      },
      {
        "label": "E",
        "text": "48"
      }
    ],
    "answer": "C",
    "shortAnswer": "37",
    "solutionSteps": [
      {
        "title": "Use too-low clue",
        "body": "At least half the guesses are too low, so Norb must be older than 36."
      },
      {
        "title": "Use off-by-one clue",
        "body": "Two guesses are off by one only near possible ages 37 or 48 in the relevant range."
      },
      {
        "title": "Use prime clue",
        "body": "48 is not prime, but 37 is prime."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "logic",
      "constraints",
      "logic",
      "prime numbers"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-22",
    "title": "2011 AMC 8 Problem 22: Tens Digit of a Power",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 22,
    "category": "Number Theory",
    "subcategory": "Modular arithmetic",
    "difficulty": 4,
    "statement": "What is the tens digit of 7^2011?",
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
        "text": "3"
      },
      {
        "label": "D",
        "text": "4"
      },
      {
        "label": "E",
        "text": "7"
      }
    ],
    "answer": "D",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Work with last two digits",
        "body": "The powers of 7 modulo 100 repeat every 4 in the pattern ending 07, 49, 43, 01."
      },
      {
        "title": "Use the exponent",
        "body": "2011 leaves remainder 3 when divided by 4, so 7^2011 ends in 43."
      },
      {
        "title": "Read the tens digit",
        "body": "The tens digit is 4."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2011",
      "number theory",
      "modular arithmetic",
      "modular arithmetic",
      "powers"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-23",
    "title": "2011 AMC 8 Problem 23: Four-Digit Multiples of 5",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 23,
    "category": "Counting & Probability",
    "subcategory": "Counting cases",
    "difficulty": 4,
    "statement": "How many 4-digit positive integers have four different digits, where the leading digit is not zero, the integer is a multiple of 5, and 5 is the largest digit?",
    "choices": [
      {
        "label": "A",
        "text": "24"
      },
      {
        "label": "B",
        "text": "48"
      },
      {
        "label": "C",
        "text": "60"
      },
      {
        "label": "D",
        "text": "84"
      },
      {
        "label": "E",
        "text": "108"
      }
    ],
    "answer": "D",
    "shortAnswer": "84",
    "solutionSteps": [
      {
        "title": "Case 1: last digit is 5",
        "body": "The first digit can be 1, 2, 3, or 4. Then there are 4 choices for the second digit and 3 for the third, giving 4·4·3=48."
      },
      {
        "title": "Case 2: last digit is 0",
        "body": "One of the first three places must be 5, and the other two are distinct choices from 1,2,3,4. This gives 3·4·3=36."
      },
      {
        "title": "Add cases",
        "body": "The total is 48+36=84."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "counting & probability",
      "counting cases",
      "casework",
      "digits",
      "multiples of 5"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-24",
    "title": "2011 AMC 8 Problem 24: 10001 as Sum of Two Primes",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 24,
    "category": "Number Theory",
    "subcategory": "Prime numbers",
    "difficulty": 4,
    "statement": "In how many ways can 10001 be written as the sum of two primes?",
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
    "answer": "A",
    "shortAnswer": "0",
    "solutionSteps": [
      {
        "title": "Use parity",
        "body": "An odd sum of two primes must be 2 plus an odd prime."
      },
      {
        "title": "Check the only candidate",
        "body": "10001-2=9999, but 9999 is divisible by 3, so it is not prime."
      },
      {
        "title": "Conclude",
        "body": "There are no ways."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "number theory",
      "prime numbers",
      "prime numbers",
      "parity"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2011-25",
    "title": "2011 AMC 8 Problem 25: Circle and Two Squares",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2011,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area ratio",
    "difficulty": 4,
    "statement": "A circle with radius 1 is inscribed in a square and circumscribed about another square as shown. Which fraction is closest to the ratio of the circle's shaded area to the area between the two squares?",
    "choices": [
      {
        "label": "A",
        "text": "1/2"
      },
      {
        "label": "B",
        "text": "1"
      },
      {
        "label": "C",
        "text": "3/2"
      },
      {
        "label": "D",
        "text": "2"
      },
      {
        "label": "E",
        "text": "5/2"
      }
    ],
    "answer": "A",
    "shortAnswer": "1/2",
    "solutionSteps": [
      {
        "title": "Find the inner square area",
        "body": "The inner square has diagonal equal to the circle's diameter, 2, so its area is (2·2)/2=2."
      },
      {
        "title": "Find the circle's shaded area",
        "body": "The shaded part inside the circle is π-2."
      },
      {
        "title": "Compare with the area between squares",
        "body": "The outer square has side 2 and area 4, so the area between the squares is 4-2=2. The ratio is (π-2)/2≈0.57, closest to 1/2."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the problem",
        "narration": "Identify the key quantities and what the question asks.",
        "visualHint": "Highlight the given numbers, labels, or diagram features."
      },
      {
        "title": "Build the relationship",
        "narration": "Use the main equation, counting idea, or geometric relationship.",
        "visualHint": "Animate the central calculation or diagram step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the computed result to the correct choice.",
        "visualHint": "Circle the correct answer choice."
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
      "2011",
      "geometry",
      "area ratio",
      "circle area",
      "square area",
      "ratio"
    ],
    "sourceName": "2011 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2011/problem-25-circle-square-ratio.svg"
    ],
    "needsDiagram": true
  }
];

const amc2012Problems: Problem[] = [
  {
    "id": "amc8-2012-01",
    "title": "2012 AMC 8 Problem 1: Hamburger Meat Scaling",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Proportions",
    "difficulty": 1,
    "statement": "Rachelle uses 3 pounds of meat to make 8 hamburgers for her family. How many pounds of meat does she need to make 24 hamburgers for a neighbourhood picnic?",
    "choices": [
      {
        "label": "A",
        "text": "6"
      },
      {
        "label": "B",
        "text": "6 2/3"
      },
      {
        "label": "C",
        "text": "7 1/2"
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
    "answer": "E",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Scale the recipe",
        "body": "Twenty-four hamburgers is 3 times as many as 8 hamburgers."
      },
      {
        "title": "Scale the meat",
        "body": "Multiply the 3 pounds of meat by 3.",
        "equation": "3 × 3 = 9"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2012",
      "ratio",
      "proportion",
      "scaling"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-02",
    "title": "2012 AMC 8 Problem 2: Population Change Estimate",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 2,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 1,
    "statement": "In the country of East Westmore, statisticians estimate there is a baby born every 8 hours and a death every day. To the nearest hundred, how many people are added to the population of East Westmore each year?",
    "choices": [
      {
        "label": "A",
        "text": "600"
      },
      {
        "label": "B",
        "text": "700"
      },
      {
        "label": "C",
        "text": "800"
      },
      {
        "label": "D",
        "text": "900"
      },
      {
        "label": "E",
        "text": "1000"
      }
    ],
    "answer": "B",
    "shortAnswer": "700",
    "solutionSteps": [
      {
        "title": "Find daily births",
        "body": "A day has 24 hours, so a birth every 8 hours means 3 births per day.",
        "equation": "24 ÷ 8 = 3"
      },
      {
        "title": "Find daily increase",
        "body": "There is also 1 death per day, so the net increase is 2 people per day."
      },
      {
        "title": "Estimate yearly increase",
        "body": "Over 365 days, the increase is 730, which rounds to 700 to the nearest hundred.",
        "equation": "2 × 365 = 730"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2012",
      "rates",
      "rounding"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-03",
    "title": "2012 AMC 8 Problem 3: Correct Sunset Time",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Time arithmetic",
    "difficulty": 1,
    "statement": "On February 13 The Oshkosh Northwester listed the length of daylight as 10 hours and 24 minutes, the sunrise was 6:57 AM, and the sunset as 8:15 PM. The length of daylight and sunrise were correct, but the sunset was wrong. When did the sun really set?",
    "choices": [
      {
        "label": "A",
        "text": "5:10 PM"
      },
      {
        "label": "B",
        "text": "5:21 PM"
      },
      {
        "label": "C",
        "text": "5:41 PM"
      },
      {
        "label": "D",
        "text": "5:57 PM"
      },
      {
        "label": "E",
        "text": "6:03 PM"
      }
    ],
    "answer": "B",
    "shortAnswer": "5:21 PM",
    "solutionSteps": [
      {
        "title": "Add daylight to sunrise",
        "body": "The correct sunset is sunrise time plus the length of daylight."
      },
      {
        "title": "Add the times",
        "body": "6:57 AM plus 10 hours is 4:57 PM. Adding 24 more minutes gives 5:21 PM."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2012",
      "time",
      "arithmetic"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-04",
    "title": "2012 AMC 8 Problem 4: Pizza Fraction",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Fractions",
    "difficulty": 1,
    "statement": "Peter's family ordered a 12-slice pizza for dinner. Peter ate one slice and shared another slice equally with his brother Paul. What fraction of the pizza did Peter eat?",
    "choices": [
      {
        "label": "A",
        "text": "1/24"
      },
      {
        "label": "B",
        "text": "1/12"
      },
      {
        "label": "C",
        "text": "1/8"
      },
      {
        "label": "D",
        "text": "1/6"
      },
      {
        "label": "E",
        "text": "1/4"
      }
    ],
    "answer": "C",
    "shortAnswer": "1/8",
    "solutionSteps": [
      {
        "title": "Count Peter’s slices",
        "body": "Peter ate 1 full slice plus half of another slice.",
        "equation": "1 + 1/2 = 3/2"
      },
      {
        "title": "Compare to the whole pizza",
        "body": "The pizza has 12 slices, so Peter ate (3/2)/12 = 1/8 of the pizza."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "fractions"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-05",
    "title": "2012 AMC 8 Problem 5: Right-Angle Side Length",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 5,
    "category": "Geometry",
    "subcategory": "Perimeter and side lengths",
    "difficulty": 2,
    "statement": "In the diagram, all angles are right angles and the lengths of the sides are given in centimeters. Note the diagram is not drawn to scale. What is X, in centimeters?",
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
    "answer": "E",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Use vertical balance",
        "body": "The total vertical distance going down must equal the total vertical distance going up."
      },
      {
        "title": "Set up the equation",
        "body": "On one side the vertical lengths add to 1+1+1+2+X. On the other side they add to 1+2+1+6.",
        "equation": "1+1+1+2+X = 1+2+1+6"
      },
      {
        "title": "Solve",
        "body": "This gives 5+X=10, so X=5."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2012",
      "geometry",
      "right angles",
      "lengths"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2012/problem-05-step-polygon.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2012-06",
    "title": "2012 AMC 8 Problem 6: Photo Frame Border Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 2,
    "statement": "A rectangular photograph is placed in a frame that forms a border two inches wide on all sides of the photograph. The photograph measures 8 inches high and 10 inches wide. What is the area of the border, in square inches?",
    "choices": [
      {
        "label": "A",
        "text": "36"
      },
      {
        "label": "B",
        "text": "40"
      },
      {
        "label": "C",
        "text": "64"
      },
      {
        "label": "D",
        "text": "72"
      },
      {
        "label": "E",
        "text": "88"
      }
    ],
    "answer": "E",
    "shortAnswer": "88",
    "solutionSteps": [
      {
        "title": "Find the photo area",
        "body": "The photograph area is 8×10=80 square inches."
      },
      {
        "title": "Find the outer dimensions",
        "body": "The border adds 2 inches to each side, so the outer rectangle is 12 inches by 14 inches."
      },
      {
        "title": "Subtract",
        "body": "The border area is the outer area minus the photograph area.",
        "equation": "12×14 - 8×10 = 168 - 80 = 88"
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2012",
      "geometry",
      "area",
      "rectangles"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-07",
    "title": "2012 AMC 8 Problem 7: Lowest Third Test Score",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 2,
    "statement": "Isabella must take four 100-point tests in her math class. Her goal is to achieve an average grade of 95 on the tests. Her first two test scores were 97 and 91. After seeing her score on the third test, she realized she can still reach her goal. What is the lowest possible score she could have made on the third test?",
    "choices": [
      {
        "label": "A",
        "text": "90"
      },
      {
        "label": "B",
        "text": "92"
      },
      {
        "label": "C",
        "text": "95"
      },
      {
        "label": "D",
        "text": "96"
      },
      {
        "label": "E",
        "text": "97"
      }
    ],
    "answer": "B",
    "shortAnswer": "92",
    "solutionSteps": [
      {
        "title": "Find needed total",
        "body": "An average of 95 over 4 tests requires 380 total points.",
        "equation": "95×4=380"
      },
      {
        "title": "Use known scores",
        "body": "The first two scores total 188, so she needs 192 more points."
      },
      {
        "title": "Maximize the fourth test",
        "body": "To make the third score as low as possible, assume she gets 100 on the fourth test. Then the third score must be 92."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2012",
      "averages",
      "optimization"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-08",
    "title": "2012 AMC 8 Problem 8: Stacked Discounts",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 8,
    "category": "Algebra",
    "subcategory": "Percent",
    "difficulty": 2,
    "statement": "A shop advertises everything is \"half price in today’s sale.\" In addition, a coupon gives a 20% discount on sale prices. Using the coupon, the price today represents what percentage off the original price?",
    "choices": [
      {
        "label": "A",
        "text": "10"
      },
      {
        "label": "B",
        "text": "33"
      },
      {
        "label": "C",
        "text": "40"
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
    "answer": "D",
    "shortAnswer": "60",
    "solutionSteps": [
      {
        "title": "Start with half price",
        "body": "Half price means the sale price is 50% of the original."
      },
      {
        "title": "Apply the coupon to the sale price",
        "body": "A 20% discount leaves 80% of the sale price.",
        "equation": "0.80×0.50 = 0.40"
      },
      {
        "title": "Convert to percent off",
        "body": "The final price is 40% of the original, so the discount is 60%."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2012",
      "percent",
      "discounts"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-09",
    "title": "2012 AMC 8 Problem 9: Birds and Mammals",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Systems of equations",
    "difficulty": 2,
    "statement": "The Fort Worth Zoo has a number of two-legged birds and a number of four-legged mammals. On one visit to the zoo, Margie counted 200 heads and 522 legs. How many of the animals that Margie counted were two-legged birds?",
    "choices": [
      {
        "label": "A",
        "text": "61"
      },
      {
        "label": "B",
        "text": "122"
      },
      {
        "label": "C",
        "text": "139"
      },
      {
        "label": "D",
        "text": "150"
      },
      {
        "label": "E",
        "text": "161"
      }
    ],
    "answer": "C",
    "shortAnswer": "139",
    "solutionSteps": [
      {
        "title": "Let variables represent animals",
        "body": "Let b be birds and m be mammals. Then b+m=200 and 2b+4m=522."
      },
      {
        "title": "Compare to all two-legged animals",
        "body": "If all 200 animals had 2 legs, there would be 400 legs. The extra 122 legs come from mammals, 2 extra per mammal."
      },
      {
        "title": "Find birds",
        "body": "There are 61 mammals, so there are 200-61=139 birds."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "systems",
      "word problems"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-10",
    "title": "2012 AMC 8 Problem 10: Permutations of 2012",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 10,
    "category": "Counting & Probability",
    "subcategory": "Permutations",
    "difficulty": 2,
    "statement": "How many 4-digit numbers greater than 1000 are there that use the four digits of 2012?",
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
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Choose the first digit",
        "body": "The first digit cannot be 0. It can be 1 or 2."
      },
      {
        "title": "Case 1: starts with 1",
        "body": "The remaining digits are 0,2,2, which make 3 distinct arrangements."
      },
      {
        "title": "Case 2: starts with 2",
        "body": "The remaining digits 0,1,2 make 6 arrangements. The total is 3+6=9."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2012",
      "counting",
      "permutations"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-11",
    "title": "2012 AMC 8 Problem 11: Mean Median and Mode",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Statistics",
    "difficulty": 2,
    "statement": "The mean, median, and unique mode of the positive integers 3, 4, 5, 6, 6, 7, and x are all equal. What is the value of x?",
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
        "text": "11"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "Identify likely common value",
        "body": "Because 6 appears twice already, the unique mode is naturally 6 unless x creates another tie."
      },
      {
        "title": "Force the mean to be 6",
        "body": "The known numbers sum to 31. For 7 numbers to average 6, the total must be 42."
      },
      {
        "title": "Solve for x",
        "body": "So x=42-31=11. The median is also 6, so this works."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2012",
      "statistics",
      "mean",
      "median",
      "mode"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-12",
    "title": "2012 AMC 8 Problem 12: Units Digit of a Power",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 12,
    "category": "Number Theory",
    "subcategory": "Units digits",
    "difficulty": 2,
    "statement": "What is the units digit of 13^2012?",
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
        "text": "5"
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
    "answer": "A",
    "shortAnswer": "1",
    "solutionSteps": [
      {
        "title": "Only the units digit matters",
        "body": "The units digits of powers of 13 follow the same cycle as powers of 3."
      },
      {
        "title": "Use the cycle",
        "body": "Powers of 3 have units-digit cycle 3,9,7,1, repeating every 4."
      },
      {
        "title": "Use the exponent",
        "body": "Since 2012 is divisible by 4, the units digit is the 4th value in the cycle, 1."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2012",
      "units digit",
      "exponents"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-13",
    "title": "2012 AMC 8 Problem 13: Pencil Price GCD",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 13,
    "category": "Number Theory",
    "subcategory": "Greatest common divisor",
    "difficulty": 2,
    "statement": "Jamar bought some pencils costing more than a penny each at the school bookstore and paid $1.43. Sharona bought some of the same pencils and paid $1.87. How many more pencils did Sharona buy than Jamar?",
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
    "answer": "C",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Convert to cents",
        "body": "The totals are 143 cents and 187 cents."
      },
      {
        "title": "Find the pencil price",
        "body": "The price per pencil must divide both totals and is more than 1 cent. The greatest common divisor of 143 and 187 is 11."
      },
      {
        "title": "Count pencils",
        "body": "Jamar bought 13 pencils and Sharona bought 17, so Sharona bought 4 more."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "gcd",
      "divisibility"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-14",
    "title": "2012 AMC 8 Problem 14: Conference Games",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 14,
    "category": "Counting & Probability",
    "subcategory": "Combinations",
    "difficulty": 2,
    "statement": "In the BIG N, a middle school football conference, each team plays every other team exactly once. If a total of 21 conference games were played during the 2012 season, how many teams were members of the BIG N conference?",
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
        "title": "Use pair counting",
        "body": "Each game is a pair of teams, so n teams create n(n-1)/2 games."
      },
      {
        "title": "Set equal to 21",
        "body": "Solve n(n-1)/2=21, so n(n-1)=42."
      },
      {
        "title": "Find n",
        "body": "Since 7×6=42, there are 7 teams."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2012",
      "combinations",
      "handshake"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-15",
    "title": "2012 AMC 8 Problem 15: Remainder Two",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 15,
    "category": "Number Theory",
    "subcategory": "LCM",
    "difficulty": 2,
    "statement": "The smallest number greater than 2 that leaves a remainder of 2 when divided by 3, 4, 5, or 6 lies between what numbers?",
    "choices": [
      {
        "label": "A",
        "text": "40 and 50"
      },
      {
        "label": "B",
        "text": "51 and 55"
      },
      {
        "label": "C",
        "text": "56 and 60"
      },
      {
        "label": "D",
        "text": "61 and 65"
      },
      {
        "label": "E",
        "text": "66 and 99"
      }
    ],
    "answer": "D",
    "shortAnswer": "61 and 65",
    "solutionSteps": [
      {
        "title": "Use the remainder condition",
        "body": "If the number leaves remainder 2 when divided by 3,4,5,6, then subtracting 2 makes it divisible by all four."
      },
      {
        "title": "Find the LCM",
        "body": "The least common multiple of 3,4,5,6 is 60."
      },
      {
        "title": "Add back the remainder",
        "body": "The smallest number is 60+2=62, which lies between 61 and 65."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2012",
      "lcm",
      "remainders"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-16",
    "title": "2012 AMC 8 Problem 16: Largest Sum from Digits",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 16,
    "category": "Logic",
    "subcategory": "Place value",
    "difficulty": 3,
    "statement": "Each of the digits 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9 is used only once to make two five-digit numbers so that they have the largest possible sum. Which of the following could be one of the numbers?",
    "choices": [
      {
        "label": "A",
        "text": "76531"
      },
      {
        "label": "B",
        "text": "86724"
      },
      {
        "label": "C",
        "text": "87431"
      },
      {
        "label": "D",
        "text": "96240"
      },
      {
        "label": "E",
        "text": "97403"
      }
    ],
    "answer": "C",
    "shortAnswer": "87431",
    "solutionSteps": [
      {
        "title": "Maximize place values",
        "body": "To maximize the sum, the largest digits must go in the largest place values across the two numbers."
      },
      {
        "title": "Compare viable choices",
        "body": "The candidate must use digits in decreasing order. Choices 76531 and 87431 are the only plausible ones."
      },
      {
        "title": "Choose the better pairing",
        "body": "87431 pairs with a number beginning 96, creating a larger sum than the best pairing for 76531."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "logic",
      "place value"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-17",
    "title": "2012 AMC 8 Problem 17: Cutting a Square into 10 Squares",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 17,
    "category": "Geometry",
    "subcategory": "Square tiling",
    "difficulty": 3,
    "statement": "A square with integer side length is cut into 10 squares, all of which have integer side length and at least 8 of which have area 1. What is the smallest possible value of the length of the side of the original square?",
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
        "title": "Eliminate side length 3",
        "body": "A 3 by 3 square has area 9, so it cannot be cut into 10 positive-area squares."
      },
      {
        "title": "Try side length 4",
        "body": "A 4 by 4 square can be made from eight 1 by 1 squares and two 2 by 2 squares."
      },
      {
        "title": "Conclude",
        "body": "This gives 10 integer-sided squares with at least eight unit squares, so 4 is possible and minimal."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2012",
      "tiling",
      "squares"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-18",
    "title": "2012 AMC 8 Problem 18: Composite with Large Prime Factors",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 18,
    "category": "Number Theory",
    "subcategory": "Prime factors",
    "difficulty": 3,
    "statement": "What is the smallest positive integer that is neither prime nor square and that has no prime factor less than 50?",
    "choices": [
      {
        "label": "A",
        "text": "3127"
      },
      {
        "label": "B",
        "text": "3133"
      },
      {
        "label": "C",
        "text": "3137"
      },
      {
        "label": "D",
        "text": "3139"
      },
      {
        "label": "E",
        "text": "3149"
      }
    ],
    "answer": "A",
    "shortAnswer": "3127",
    "solutionSteps": [
      {
        "title": "Understand the restrictions",
        "body": "The number must be composite, not a square, and all prime factors must be at least 50."
      },
      {
        "title": "Use smallest possible primes",
        "body": "The two smallest primes greater than 50 are 53 and 59."
      },
      {
        "title": "Multiply",
        "body": "Their product is 53×59=3127, which is not prime and not a square."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2012",
      "prime factors",
      "composite"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-19",
    "title": "2012 AMC 8 Problem 19: Red Green Blue Marbles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 19,
    "category": "Algebra",
    "subcategory": "Systems",
    "difficulty": 3,
    "statement": "In a jar of red, green, and blue marbles, all but 6 are red marbles, all but 8 are green, and all but 4 are blue. How many marbles are in the jar?",
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
        "text": "12"
      }
    ],
    "answer": "C",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Translate each statement",
        "body": "All but 6 are red means green plus blue is 6. Similarly, red plus blue is 8 and red plus green is 4."
      },
      {
        "title": "Add equations",
        "body": "Adding gives 2 times the total number of marbles equals 18."
      },
      {
        "title": "Solve",
        "body": "The total number of marbles is 9."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "systems",
      "logic"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-20",
    "title": "2012 AMC 8 Problem 20: Ordering Fractions",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 20,
    "category": "Number Theory",
    "subcategory": "Fractions",
    "difficulty": 3,
    "statement": "What is the correct ordering of the three numbers 5/19, 7/21, and 9/23, in increasing order?",
    "choices": [
      {
        "label": "A",
        "text": "9/23 < 7/21 < 5/19"
      },
      {
        "label": "B",
        "text": "5/19 < 7/21 < 9/23"
      },
      {
        "label": "C",
        "text": "9/23 < 5/19 < 7/21"
      },
      {
        "label": "D",
        "text": "5/19 < 9/23 < 7/21"
      },
      {
        "label": "E",
        "text": "7/21 < 5/19 < 9/23"
      }
    ],
    "answer": "B",
    "shortAnswer": "5/19 < 7/21 < 9/23",
    "solutionSteps": [
      {
        "title": "Approximate or compare",
        "body": "7/21 equals 1/3. The fraction 5/19 is slightly less than 1/3, and 9/23 is greater than 1/3."
      },
      {
        "title": "Order them",
        "body": "So the increasing order is 5/19, then 7/21, then 9/23."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "B"
      }
    },
    "tags": [
      "AMC 8",
      "2012",
      "fractions",
      "ordering"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-21",
    "title": "2012 AMC 8 Problem 21: Painted Cube Faces",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 21,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 3,
    "statement": "Marla has a large white cube that has an edge of 10 feet. She also has enough green paint to cover 300 square feet. Marla uses all the paint to create a white square centered on each face, surrounded by a green border. What is the area of one of the white squares, in square feet?",
    "choices": [
      {
        "label": "A",
        "text": "5√2"
      },
      {
        "label": "B",
        "text": "10"
      },
      {
        "label": "C",
        "text": "10√2"
      },
      {
        "label": "D",
        "text": "50"
      },
      {
        "label": "E",
        "text": "50√2"
      }
    ],
    "answer": "D",
    "shortAnswer": "50",
    "solutionSteps": [
      {
        "title": "Distribute the paint",
        "body": "The 300 square feet of green paint is spread equally over 6 faces, so each face gets 50 square feet of green."
      },
      {
        "title": "Find one face area",
        "body": "Each face is a 10 by 10 square, so its area is 100 square feet."
      },
      {
        "title": "Find the white area",
        "body": "The centered white square on each face has area 100-50=50."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2012",
      "surface area",
      "cube"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-22",
    "title": "2012 AMC 8 Problem 22: Possible Medians",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 22,
    "category": "Counting & Probability",
    "subcategory": "Median",
    "difficulty": 3,
    "statement": "Let R be a set of nine distinct integers. Six of the elements are 2, 3, 4, 6, 9, and 14. What is the number of possible values of the median of R?",
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
        "text": "8"
      }
    ],
    "answer": "D",
    "shortAnswer": "7",
    "solutionSteps": [
      {
        "title": "Median is the fifth number",
        "body": "A set of 9 numbers has its median as the 5th number in increasing order."
      },
      {
        "title": "Find the smallest possible median",
        "body": "By placing the three unknown integers before 2, the fifth number can be as small as 3."
      },
      {
        "title": "Find the largest possible median",
        "body": "By placing the three unknown integers after 14, the fifth number can be as large as 9. The possible medians are 3 through 9, giving 7 values."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "number-line",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2012",
      "median",
      "counting"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-23",
    "title": "2012 AMC 8 Problem 23: Triangle and Hexagon Areas",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Similar areas",
    "difficulty": 3,
    "statement": "An equilateral triangle and a regular hexagon have equal perimeters. If the triangle’s area is 4, what is the area of the hexagon?",
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
        "text": "4√3"
      },
      {
        "label": "E",
        "text": "6√3"
      }
    ],
    "answer": "C",
    "shortAnswer": "6",
    "solutionSteps": [
      {
        "title": "Compare side lengths",
        "body": "If the triangle side is s, the perimeter is 3s. A regular hexagon with the same perimeter has side length s/2."
      },
      {
        "title": "Compare small equilateral triangles",
        "body": "The hexagon is made of 6 equilateral triangles, each with side length half the original triangle’s side."
      },
      {
        "title": "Scale area",
        "body": "Each small triangle has 1/4 the area of the original, so each has area 1. The hexagon area is 6."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "equilateral triangle",
      "hexagon",
      "area"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2012-24",
    "title": "2012 AMC 8 Problem 24: Four Arcs Star Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 24,
    "category": "Geometry",
    "subcategory": "Circle area",
    "difficulty": 4,
    "statement": "A circle of radius 2 is cut into four congruent arcs. The four arcs are joined to form the star figure shown. What is the ratio of the area of the star figure to the area of the original circle?",
    "choices": [
      {
        "label": "A",
        "text": "(4−π)/π"
      },
      {
        "label": "B",
        "text": "1/π"
      },
      {
        "label": "C",
        "text": "√2/π"
      },
      {
        "label": "D",
        "text": "(π−1)/π"
      },
      {
        "label": "E",
        "text": "3/π"
      }
    ],
    "answer": "A",
    "shortAnswer": "(4−π)/π",
    "solutionSteps": [
      {
        "title": "Enclose the star in a square",
        "body": "The star fits inside a square of side 4, the diameter of the original circle."
      },
      {
        "title": "Subtract the four quarter-circles",
        "body": "The four rounded outside pieces together form one circle of radius 2, area 4π. The square area is 16."
      },
      {
        "title": "Take the ratio",
        "body": "The star area is 16−4π. Dividing by the original circle area 4π gives (4−π)/π."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2012",
      "circle area",
      "area ratio"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2012/problem-24-star-arcs.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2012-25",
    "title": "2012 AMC 8 Problem 25: Inscribed Tilted Square",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2012,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area decomposition",
    "difficulty": 4,
    "statement": "A square with area 4 is inscribed in a square with area 5, with each vertex of the smaller square on a side of the larger square. A vertex of the smaller square divides a side of the larger square into two segments, one of length a, and the other of length b. What is the value of ab?",
    "choices": [
      {
        "label": "A",
        "text": "1/5"
      },
      {
        "label": "B",
        "text": "2/5"
      },
      {
        "label": "C",
        "text": "1/2"
      },
      {
        "label": "D",
        "text": "1"
      },
      {
        "label": "E",
        "text": "4"
      }
    ],
    "answer": "C",
    "shortAnswer": "1/2",
    "solutionSteps": [
      {
        "title": "Compare areas",
        "body": "The outer square has area 5 and the inner square has area 4, so the four corner triangles have total area 1."
      },
      {
        "title": "Use congruent triangles",
        "body": "Each corner triangle has area 1/4."
      },
      {
        "title": "Use triangle area",
        "body": "One corner triangle has legs a and b, so its area is ab/2. Thus ab/2=1/4, giving ab=1/2."
      }
    ],
    "animationFrames": [
      {
        "title": "Read the setup",
        "narration": "Identify the important quantities and what the question asks.",
        "visualHint": "Highlight the given numbers or diagram labels."
      },
      {
        "title": "Use the key idea",
        "narration": "Apply the main arithmetic, counting, or geometry relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Select the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2012",
      "square area",
      "area decomposition"
    ],
    "sourceName": "2012 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2012/problem-25-inscribed-square.svg"
    ],
    "needsDiagram": true
  }
];

const amc2013Problems: Problem[] = [
  {
    "id": "amc8-2013-01",
    "title": "2013 AMC 8 Problem 1: Model Car Rows",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Multiples",
    "difficulty": 1,
    "statement": "Danica wants to arrange her model cars in rows with exactly 6 cars in each row. She now has 23 model cars. What is the smallest number of additional cars she must buy in order to be able to arrange all her cars this way?",
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
        "title": "Find the next full row",
        "body": "Rows must have 6 cars each, so the total number of cars must be a multiple of 6."
      },
      {
        "title": "Compare to 23",
        "body": "The next multiple of 6 after 23 is 24.",
        "equation": "6×4=24"
      },
      {
        "title": "Find the extra cars",
        "body": "Danica needs 24-23=1 additional car."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2013",
      "multiples",
      "division"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-02",
    "title": "2013 AMC 8 Problem 2: Fish Market Discount",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 2,
    "category": "Algebra",
    "subcategory": "Percent discount",
    "difficulty": 1,
    "statement": "A sign at the fish market says, \"50% off, today only: half-pound packages for just $3 per package.\" What is the regular price for a full pound of fish, in dollars?",
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
        "text": "10"
      },
      {
        "label": "D",
        "text": "12"
      },
      {
        "label": "E",
        "text": "15"
      }
    ],
    "answer": "D",
    "shortAnswer": "12",
    "solutionSteps": [
      {
        "title": "Undo the 50% discount",
        "body": "If $3 is half price for a half-pound package, then the regular price for a half pound is $6."
      },
      {
        "title": "Scale to one pound",
        "body": "A full pound is two half-pound packages.",
        "equation": "2× 6=12"
      },
      {
        "title": "Conclude",
        "body": "The regular price for a full pound is $12."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2013",
      "percent",
      "unit price"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-03",
    "title": "2013 AMC 8 Problem 3: Alternating Sum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Arithmetic patterns",
    "difficulty": 2,
    "statement": "What is the value of 4(-1+2-3+4-5+6-7+⋯+1000)?",
    "choices": [
      {
        "label": "A",
        "text": "-10"
      },
      {
        "label": "B",
        "text": "0"
      },
      {
        "label": "C",
        "text": "1"
      },
      {
        "label": "D",
        "text": "500"
      },
      {
        "label": "E",
        "text": "2000"
      }
    ],
    "answer": "E",
    "shortAnswer": "2000",
    "solutionSteps": [
      {
        "title": "Group pairs",
        "body": "Pair consecutive terms inside the parentheses.",
        "equation": "(-1+2)+(-3+4)+⋯+(-999+1000)"
      },
      {
        "title": "Count pairs",
        "body": "Each pair equals 1, and there are 500 pairs."
      },
      {
        "title": "Multiply by 4",
        "body": "The expression equals 4×500=2000."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2013",
      "patterns",
      "arithmetic"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-04",
    "title": "2013 AMC 8 Problem 4: Forgotten Restaurant Money",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 4,
    "category": "Algebra",
    "subcategory": "Equal sharing",
    "difficulty": 1,
    "statement": "Eight friends ate at a restaurant and agreed to share the bill equally. Because Judi forgot her money, each of her seven friends paid an extra $2.50 to cover her portion of the total bill. What was the total bill?",
    "choices": [
      {
        "label": "A",
        "text": "$120"
      },
      {
        "label": "B",
        "text": "$128"
      },
      {
        "label": "C",
        "text": "$140"
      },
      {
        "label": "D",
        "text": "$144"
      },
      {
        "label": "E",
        "text": "$160"
      }
    ],
    "answer": "C",
    "shortAnswer": "$140",
    "solutionSteps": [
      {
        "title": "Find Judi's share",
        "body": "The seven friends together paid Judi's missing share.",
        "equation": "7× 2.50=17.50"
      },
      {
        "title": "Scale to all eight shares",
        "body": "The total bill is eight equal shares."
      },
      {
        "title": "Compute total",
        "body": "8×$17.50=$140."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2013",
      "rates",
      "sharing"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-05",
    "title": "2013 AMC 8 Problem 5: Mean vs Median Weights",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 5,
    "category": "Other",
    "subcategory": "Statistics",
    "difficulty": 2,
    "statement": "Hammie is in 6th grade and weighs 106 pounds. His quadruplet sisters are tiny babies and weigh 5, 5, 6, and 8 pounds. Which is greater, the average (mean) weight of these five children or the median weight, and by how many pounds?",
    "choices": [
      {
        "label": "A",
        "text": "median, by 60"
      },
      {
        "label": "B",
        "text": "median, by 20"
      },
      {
        "label": "C",
        "text": "average, by 5"
      },
      {
        "label": "D",
        "text": "average, by 15"
      },
      {
        "label": "E",
        "text": "average, by 20"
      }
    ],
    "answer": "E",
    "shortAnswer": "average, by 20",
    "solutionSteps": [
      {
        "title": "Order the weights",
        "body": "The weights in order are 5, 5, 6, 8, 106, so the median is 6."
      },
      {
        "title": "Find the mean",
        "body": "The sum is 130, and 130/5=26."
      },
      {
        "title": "Compare",
        "body": "The average exceeds the median by 26-6=20 pounds."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2013",
      "mean",
      "median"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-06",
    "title": "2013 AMC 8 Problem 6: Product Pyramid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 6,
    "category": "Algebra",
    "subcategory": "Working backward",
    "difficulty": 2,
    "statement": "The number in each box is the product of the numbers in the two boxes that touch it in the row above. For example, 30=6×5. What is the missing number in the top row?",
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
    "answer": "C",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Work up from 600",
        "body": "Let the missing middle-row number be x. Since 30×x=600, x=20."
      },
      {
        "title": "Use the top row",
        "body": "Let the missing top number be y. Since 5×y=20, y=4."
      },
      {
        "title": "Answer",
        "body": "The missing number in the top row is 4."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "multiplication",
      "working backward"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-06-product-pyramid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-07",
    "title": "2013 AMC 8 Problem 7: Train Cars Passing",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 2,
    "statement": "Trey and his mom stopped at a railroad crossing to let a train pass. As the train began to pass, Trey counted 6 cars in the first 10 seconds. It took the train 2 minutes and 45 seconds to clear the crossing at a constant speed. Which of the following was the most likely number of cars in the train?",
    "choices": [
      {
        "label": "A",
        "text": "60"
      },
      {
        "label": "B",
        "text": "80"
      },
      {
        "label": "C",
        "text": "100"
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
    "answer": "C",
    "shortAnswer": "100",
    "solutionSteps": [
      {
        "title": "Convert time",
        "body": "2 minutes 45 seconds is 165 seconds."
      },
      {
        "title": "Use the rate",
        "body": "6 cars in 10 seconds is the same as 3 cars in 5 seconds."
      },
      {
        "title": "Scale up",
        "body": "There are 33 groups of 5 seconds in 165 seconds, so about 3×33=99 cars, closest to 100."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "C"
      }
    },
    "tags": [
      "AMC 8",
      "2013",
      "rates",
      "proportions"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-08",
    "title": "2013 AMC 8 Problem 8: Consecutive Heads",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 8,
    "category": "Counting & Probability",
    "subcategory": "Coin probability",
    "difficulty": 2,
    "statement": "A fair coin is tossed 3 times. What is the probability of at least two consecutive heads?",
    "choices": [
      {
        "label": "A",
        "text": "1/8"
      },
      {
        "label": "B",
        "text": "1/4"
      },
      {
        "label": "C",
        "text": "3/8"
      },
      {
        "label": "D",
        "text": "1/2"
      },
      {
        "label": "E",
        "text": "3/4"
      }
    ],
    "answer": "C",
    "shortAnswer": "3/8",
    "solutionSteps": [
      {
        "title": "Count all outcomes",
        "body": "There are 2^3=8 equally likely sequences of three coin tosses."
      },
      {
        "title": "Count favorable outcomes",
        "body": "The sequences with at least two consecutive heads are HHT, THH, and HHH."
      },
      {
        "title": "Form the probability",
        "body": "There are 3 favorable outcomes out of 8."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "probability",
      "coin flips"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-09",
    "title": "2013 AMC 8 Problem 9: Hulk Jump Sequence",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Geometric sequences",
    "difficulty": 2,
    "statement": "The Incredible Hulk can double the distance he jumps with each succeeding jump. If his first jump is 1 meter, the second jump is 2 meters, the third jump is 4 meters, and so on, then on which jump will he first be able to jump more than 1 kilometer (1000 meters)?",
    "choices": [
      {
        "label": "A",
        "text": "9th"
      },
      {
        "label": "B",
        "text": "10th"
      },
      {
        "label": "C",
        "text": "11th"
      },
      {
        "label": "D",
        "text": "12th"
      },
      {
        "label": "E",
        "text": "13th"
      }
    ],
    "answer": "C",
    "shortAnswer": "11th",
    "solutionSteps": [
      {
        "title": "Recognize powers of 2",
        "body": "The jumps are 1, 2, 4, 8, ..., so the nth jump is 2^(n-1)."
      },
      {
        "title": "Find first over 1000",
        "body": "2^9=512 and 2^10=1024."
      },
      {
        "title": "Match the jump number",
        "body": "Since 2^10 is the 11th jump, the first jump over 1000 meters is the 11th."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "geometric sequence",
      "powers of 2"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-10",
    "title": "2013 AMC 8 Problem 10: LCM to GCF Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 10,
    "category": "Number Theory",
    "subcategory": "LCM and GCF",
    "difficulty": 3,
    "statement": "What is the ratio of the least common multiple of 180 and 594 to the greatest common factor of 180 and 594?",
    "choices": [
      {
        "label": "A",
        "text": "110"
      },
      {
        "label": "B",
        "text": "165"
      },
      {
        "label": "C",
        "text": "330"
      },
      {
        "label": "D",
        "text": "625"
      },
      {
        "label": "E",
        "text": "660"
      }
    ],
    "answer": "C",
    "shortAnswer": "330",
    "solutionSteps": [
      {
        "title": "Prime factorize",
        "body": "180=2^2×3^2×5 and 594=2×3^3×11."
      },
      {
        "title": "Find LCM and GCF",
        "body": "The LCM is 5940 and the GCF is 18."
      },
      {
        "title": "Take the ratio",
        "body": "5940/18=330."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "prime factorization",
      "lcm",
      "gcf"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-11",
    "title": "2013 AMC 8 Problem 11: Treadmill Time Difference",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 11,
    "category": "Algebra",
    "subcategory": "Speed and time",
    "difficulty": 2,
    "statement": "Ted's grandfather used his treadmill on 3 days this week. He went 2 miles each day. On Monday he jogged at 5 miles per hour. He walked at 3 miles per hour on Wednesday and at 4 miles per hour on Friday. If Grandfather had always walked at 4 miles per hour, he would have spent how many minutes less on the treadmill?",
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
        "title": "Find actual time",
        "body": "Two miles at 5 mph takes 24 minutes, at 3 mph takes 40 minutes, and at 4 mph takes 30 minutes, for 94 minutes total."
      },
      {
        "title": "Find all-at-4-mph time",
        "body": "At 4 mph, two miles takes 30 minutes, so three days would take 90 minutes."
      },
      {
        "title": "Subtract",
        "body": "94-90=4 minutes less."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2013",
      "speed",
      "time"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-12",
    "title": "2013 AMC 8 Problem 12: Sandals Fair Special",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 12,
    "category": "Algebra",
    "subcategory": "Percent discount",
    "difficulty": 2,
    "statement": "At the 2013 Winnebago County Fair a vendor is offering a \"fair special\" on sandals. If you buy one pair at the regular price of $50, you get a second pair at a 40% discount, and a third pair at half the regular price. Javier buys three pairs. What percentage of the $150 regular price did he save?",
    "choices": [
      {
        "label": "A",
        "text": "25"
      },
      {
        "label": "B",
        "text": "30"
      },
      {
        "label": "C",
        "text": "33"
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
    "shortAnswer": "30%",
    "solutionSteps": [
      {
        "title": "Find sale total",
        "body": "The three pairs cost $50, $30, and $25."
      },
      {
        "title": "Compare to regular price",
        "body": "The sale total is $105 compared with the regular total $150."
      },
      {
        "title": "Find percent saved",
        "body": "He saved $45 out of $150, which is 30%."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2013",
      "percent",
      "discount"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-13",
    "title": "2013 AMC 8 Problem 13: Reversed Digits Error",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 13,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 3,
    "statement": "When Clara totaled her scores, she inadvertently reversed the units digit and the tens digit of one score. By which of the following might her incorrect sum have differed from the correct one?",
    "choices": [
      {
        "label": "A",
        "text": "45"
      },
      {
        "label": "B",
        "text": "46"
      },
      {
        "label": "C",
        "text": "47"
      },
      {
        "label": "D",
        "text": "48"
      },
      {
        "label": "E",
        "text": "49"
      }
    ],
    "answer": "A",
    "shortAnswer": "45",
    "solutionSteps": [
      {
        "title": "Represent the score",
        "body": "A two-digit score with tens digit a and units digit b is 10a+b."
      },
      {
        "title": "Reverse the digits",
        "body": "The reversed score is 10b+a."
      },
      {
        "title": "Find the difference",
        "body": "The difference is |(10a+b)-(10b+a)|=9|a-b|, a multiple of 9. Only 45 is a multiple of 9."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2013",
      "digits",
      "multiples of 9"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-14",
    "title": "2013 AMC 8 Problem 14: Jelly Bean Match",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 14,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "Abe holds 1 green and 1 red jelly bean in his hand. Bob holds 1 green, 1 yellow, and 2 red jelly beans in his hand. Each randomly picks a jelly bean to show the other. What is the probability that the colors match?",
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
        "text": "3/8"
      },
      {
        "label": "D",
        "text": "1/2"
      },
      {
        "label": "E",
        "text": "2/3"
      }
    ],
    "answer": "C",
    "shortAnswer": "3/8",
    "solutionSteps": [
      {
        "title": "Green match",
        "body": "The probability both choose green is (1/2)(1/4)=1/8."
      },
      {
        "title": "Red match",
        "body": "The probability both choose red is (1/2)(2/4)=1/4."
      },
      {
        "title": "Add cases",
        "body": "The total probability is 1/8+1/4=3/8."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "probability",
      "casework"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-15",
    "title": "2013 AMC 8 Problem 15: Exponents Product",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 15,
    "category": "Algebra",
    "subcategory": "Exponents",
    "difficulty": 3,
    "statement": "If 3^p+3^4=90, 2^r+44=76, and 5^3+6^s=1421, what is the product of p, r, and s?",
    "choices": [
      {
        "label": "A",
        "text": "27"
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
        "text": "70"
      },
      {
        "label": "E",
        "text": "90"
      }
    ],
    "answer": "B",
    "shortAnswer": "40",
    "solutionSteps": [
      {
        "title": "Solve for p",
        "body": "3^4=81, so 3^p=9 and p=2."
      },
      {
        "title": "Solve for r",
        "body": "2^r=76-44=32, so r=5."
      },
      {
        "title": "Solve for s and multiply",
        "body": "6^s=1421-125=1296=6^4, so s=4. The product is 2×5×4=40."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2013",
      "exponents",
      "equations"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-16",
    "title": "2013 AMC 8 Problem 16: Fibonacci Middle Ratios",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 16,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 3,
    "statement": "A number of students from Fibonacci Middle School are taking part in a community service project. The ratio of 8th-graders to 6th-graders is 5:3, and the ratio of 8th-graders to 7th-graders is 8:5. What is the smallest number of students that could be participating in the project?",
    "choices": [
      {
        "label": "A",
        "text": "16"
      },
      {
        "label": "B",
        "text": "40"
      },
      {
        "label": "C",
        "text": "55"
      },
      {
        "label": "D",
        "text": "79"
      },
      {
        "label": "E",
        "text": "89"
      }
    ],
    "answer": "E",
    "shortAnswer": "89",
    "solutionSteps": [
      {
        "title": "Match 8th graders",
        "body": "Scale 5:3 by 8 to get 40:24 for 8th:6th."
      },
      {
        "title": "Scale the other ratio",
        "body": "Scale 8:5 by 5 to get 40:25 for 8th:7th."
      },
      {
        "title": "Add the smallest group sizes",
        "body": "The smallest total is 40+25+24=89."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
      }
    ],
    "animation": {
      "type": "bar-model",
      "data": {
        "answer": "E"
      }
    },
    "tags": [
      "AMC 8",
      "2013",
      "ratios",
      "least common multiple"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-17",
    "title": "2013 AMC 8 Problem 17: Six Consecutive Integers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 2,
    "statement": "The sum of six consecutive positive integers is 2013. What is the largest of these six integers?",
    "choices": [
      {
        "label": "A",
        "text": "335"
      },
      {
        "label": "B",
        "text": "338"
      },
      {
        "label": "C",
        "text": "340"
      },
      {
        "label": "D",
        "text": "345"
      },
      {
        "label": "E",
        "text": "350"
      }
    ],
    "answer": "B",
    "shortAnswer": "338",
    "solutionSteps": [
      {
        "title": "Find the average",
        "body": "The average of the six integers is 2013/6=335.5."
      },
      {
        "title": "Place consecutive integers around the average",
        "body": "The six integers are 333, 334, 335, 336, 337, 338."
      },
      {
        "title": "Choose largest",
        "body": "The largest is 338."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2013",
      "consecutive integers",
      "mean"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-18",
    "title": "2013 AMC 8 Problem 18: Rectangular Fort Blocks",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 18,
    "category": "Geometry",
    "subcategory": "Volume and surface layers",
    "difficulty": 4,
    "statement": "Isabella uses one-foot cubical blocks to build a rectangular fort that is 12 feet long, 10 feet wide, and 5 feet high. The floor and the four walls are all one foot thick. How many blocks does the fort contain?",
    "choices": [
      {
        "label": "A",
        "text": "204"
      },
      {
        "label": "B",
        "text": "280"
      },
      {
        "label": "C",
        "text": "320"
      },
      {
        "label": "D",
        "text": "340"
      },
      {
        "label": "E",
        "text": "600"
      }
    ],
    "answer": "B",
    "shortAnswer": "280",
    "solutionSteps": [
      {
        "title": "Count the floor",
        "body": "The floor is 12 by 10, so it uses 120 cubes."
      },
      {
        "title": "Count each wall layer",
        "body": "Above the floor there are 4 layers. Each layer around the wall uses 9+11+9+11=40 cubes."
      },
      {
        "title": "Add everything",
        "body": "The total is 120+4×40=280 cubes."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2013",
      "volume",
      "3D geometry"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-18-rectangular-fort.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-19",
    "title": "2013 AMC 8 Problem 19: Hidden Test Scores",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 19,
    "category": "Logic",
    "subcategory": "Ranking",
    "difficulty": 3,
    "statement": "Bridget, Cassie, and Hannah are discussing the results of their last math test. Hannah shows Bridget and Cassie her test, but Bridget and Cassie don't show theirs to anyone. Cassie says, 'I didn't get the lowest score in our class,' and Bridget adds, 'I didn't get the highest score.' What is the ranking of the three girls from highest to lowest?",
    "choices": [
      {
        "label": "A",
        "text": "Hannah, Cassie, Bridget"
      },
      {
        "label": "B",
        "text": "Hannah, Bridget, Cassie"
      },
      {
        "label": "C",
        "text": "Cassie, Bridget, Hannah"
      },
      {
        "label": "D",
        "text": "Cassie, Hannah, Bridget"
      },
      {
        "label": "E",
        "text": "Bridget, Cassie, Hannah"
      }
    ],
    "answer": "D",
    "shortAnswer": "Cassie, Hannah, Bridget",
    "solutionSteps": [
      {
        "title": "Interpret Cassie's statement",
        "body": "Cassie can know she is not lowest only if Hannah scored lower than Cassie."
      },
      {
        "title": "Interpret Bridget's statement",
        "body": "Bridget can know she is not highest only if Hannah scored higher than Bridget."
      },
      {
        "title": "Combine",
        "body": "Cassie scored above Hannah, and Hannah scored above Bridget."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "ranking",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2013",
      "logic",
      "ranking"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2013-20",
    "title": "2013 AMC 8 Problem 20: Rectangle in Semicircle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 20,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 3,
    "statement": "A 1×2 rectangle is inscribed in a semicircle with the longer side on the diameter. What is the area of the semicircle?",
    "choices": [
      {
        "label": "A",
        "text": "π/2"
      },
      {
        "label": "B",
        "text": "2π/3"
      },
      {
        "label": "C",
        "text": "π"
      },
      {
        "label": "D",
        "text": "4π/3"
      },
      {
        "label": "E",
        "text": "5π/3"
      }
    ],
    "answer": "C",
    "shortAnswer": "π",
    "solutionSteps": [
      {
        "title": "Locate the center",
        "body": "By symmetry, the center of the semicircle lies at the midpoint of the longer side of the rectangle."
      },
      {
        "title": "Find the radius",
        "body": "The radius from the center to an upper corner of the rectangle has legs 1 and 1, so r=√2."
      },
      {
        "title": "Find semicircle area",
        "body": "The area is half of πr^2, so it is (1/2)π(2)=π."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "semicircle",
      "pythagorean theorem"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-20-semicircle-rectangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-21",
    "title": "2013 AMC 8 Problem 21: City Park Routes",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 21,
    "category": "Counting & Probability",
    "subcategory": "Counting paths",
    "difficulty": 3,
    "statement": "Samantha lives 2 blocks west and 1 block south of the southwest corner of City Park. Her school is 2 blocks east and 2 blocks north of the northeast corner of City Park. On school days she bikes on streets to the southwest corner of City Park, then takes a diagonal path through the park to the northeast corner, and then bikes on streets to school. If her route is as short as possible, how many different routes can she take?",
    "choices": [
      {
        "label": "A",
        "text": "3"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "9"
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
    "answer": "E",
    "shortAnswer": "18",
    "solutionSteps": [
      {
        "title": "Routes to the park",
        "body": "From home to the southwest corner of the park, she must make 3 street moves: 2 east and 1 north. That gives 3 choices."
      },
      {
        "title": "Routes from the park to school",
        "body": "From the northeast corner of the park to school, she must make 4 street moves: 2 east and 2 north. That gives C(4,2)=6 choices."
      },
      {
        "title": "Multiply independent choices",
        "body": "The diagonal through the park is fixed, so the total is 3×6=18."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2013",
      "combinations",
      "grid paths"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-21-city-park-routes.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-22",
    "title": "2013 AMC 8 Problem 22: Toothpick Grid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 22,
    "category": "Counting & Probability",
    "subcategory": "Counting grid edges",
    "difficulty": 4,
    "statement": "Toothpicks are used to make a grid that is 60 toothpicks long and 32 toothpicks wide. How many toothpicks are used altogether?",
    "choices": [
      {
        "label": "A",
        "text": "1920"
      },
      {
        "label": "B",
        "text": "1952"
      },
      {
        "label": "C",
        "text": "1980"
      },
      {
        "label": "D",
        "text": "2013"
      },
      {
        "label": "E",
        "text": "3932"
      }
    ],
    "answer": "E",
    "shortAnswer": "3932",
    "solutionSteps": [
      {
        "title": "Count vertical toothpicks",
        "body": "There are 61 vertical columns, each 32 toothpicks long, for 61×32 toothpicks."
      },
      {
        "title": "Count horizontal toothpicks",
        "body": "There are 33 horizontal rows, each 60 toothpicks long, for 33×60 toothpicks."
      },
      {
        "title": "Add",
        "body": "61×32+33×60=3932."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2013",
      "counting",
      "grid"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-22-toothpick-grid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-23",
    "title": "2013 AMC 8 Problem 23: Semicircles on Triangle Sides",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 23,
    "category": "Geometry",
    "subcategory": "Right triangles and circles",
    "difficulty": 4,
    "statement": "Angle ABC of triangle ABC is a right angle. The sides of triangle ABC are the diameters of semicircles as shown. The area of the semicircle on AB equals 8π, and the arc of the semicircle on AC has length 8.5π. What is the radius of the semicircle on BC?",
    "choices": [
      {
        "label": "A",
        "text": "7"
      },
      {
        "label": "B",
        "text": "7.5"
      },
      {
        "label": "C",
        "text": "8"
      },
      {
        "label": "D",
        "text": "8.5"
      },
      {
        "label": "E",
        "text": "9"
      }
    ],
    "answer": "B",
    "shortAnswer": "7.5",
    "solutionSteps": [
      {
        "title": "Find AB",
        "body": "The semicircle on AB has area 8π, so the full circle would have area 16π. Its radius is 4 and AB=8."
      },
      {
        "title": "Find AC",
        "body": "The arc length of the semicircle on AC is 8.5π, so AC is 17."
      },
      {
        "title": "Use the Pythagorean theorem",
        "body": "Since ABC is right, BC=√(17^2-8^2)=15, so the semicircle on BC has radius 7.5."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2013",
      "pythagorean theorem",
      "semicircles"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-23-semicircles-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-24",
    "title": "2013 AMC 8 Problem 24: Three Squares Shaded Pentagon",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 24,
    "category": "Geometry",
    "subcategory": "Area ratios",
    "difficulty": 5,
    "statement": "Squares ABCD, EFGH, and GHIJ are equal in area. Points C and D are the midpoints of sides IH and HE, respectively. What is the ratio of the area of the shaded pentagon AJICB to the sum of the areas of the three squares?",
    "choices": [
      {
        "label": "A",
        "text": "1/4"
      },
      {
        "label": "B",
        "text": "7/24"
      },
      {
        "label": "C",
        "text": "1/3"
      },
      {
        "label": "D",
        "text": "3/8"
      },
      {
        "label": "E",
        "text": "5/12"
      }
    ],
    "answer": "C",
    "shortAnswer": "1/3",
    "solutionSteps": [
      {
        "title": "Use unit squares",
        "body": "Let each square have side length 1, so the total area of the three squares is 3."
      },
      {
        "title": "Decompose the shaded region",
        "body": "The shaded pentagon can be split into simple pieces whose total area is 1."
      },
      {
        "title": "Take the ratio",
        "body": "The ratio of shaded area to total square area is 1/3."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2013",
      "area decomposition",
      "ratio"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-24-three-squares-pentagon.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2013-25",
    "title": "2013 AMC 8 Problem 25: Rolling Ball Track",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2013,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Arc length",
    "difficulty": 5,
    "statement": "A ball with diameter 4 inches starts at point A to roll along the track shown. The track is comprised of 3 semicircular arcs whose radii are R1=100 inches, R2=60 inches, and R3=80 inches, respectively. The ball always remains in contact with the track and does not slip. What is the distance the center of the ball travels over the course from A to B?",
    "choices": [
      {
        "label": "A",
        "text": "238π"
      },
      {
        "label": "B",
        "text": "240π"
      },
      {
        "label": "C",
        "text": "260π"
      },
      {
        "label": "D",
        "text": "280π"
      },
      {
        "label": "E",
        "text": "500π"
      }
    ],
    "answer": "A",
    "shortAnswer": "238π",
    "solutionSteps": [
      {
        "title": "Start with track arc lengths",
        "body": "The semicircle lengths are 100π, 60π, and 80π, for a total of 240π."
      },
      {
        "title": "Adjust for the center of the ball",
        "body": "The ball has radius 2, so the path of its center is shifted from the track. The net adjustment over the three semicircles is -2π."
      },
      {
        "title": "Compute",
        "body": "The center travels 240π-2π=238π."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the quantities given and what the problem asks for.",
        "visualHint": "Highlight the key numbers, labels, or diagram parts."
      },
      {
        "title": "Apply the main idea",
        "narration": "Use the needed arithmetic, counting, geometry, or probability relationship.",
        "visualHint": "Animate the central calculation step by step."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2013",
      "arc length",
      "circles"
    ],
    "sourceName": "2013 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2013/problem-25-rolling-ball-track.svg"
    ],
    "needsDiagram": true
  }
];

const amc2014Problems: Problem[] = [
  {
    "id": "amc8-2014-01",
    "title": "2014 AMC 8 Problem 1: Parentheses Matter",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 1,
    "category": "Algebra",
    "subcategory": "Order of operations",
    "difficulty": 1,
    "statement": "Harry and Terry are each told to calculate 8 − (2 + 5). Harry gets the correct answer. Terry ignores the parentheses and calculates 8 − 2 + 5. If Harry's answer is H and Terry's answer is T, what is H − T?",
    "choices": [
      {
        "label": "A",
        "text": "−10"
      },
      {
        "label": "B",
        "text": "−6"
      },
      {
        "label": "C",
        "text": "0"
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
    "answer": "A",
    "shortAnswer": "−10",
    "solutionSteps": [
      {
        "title": "Calculate Harry's value",
        "body": "Harry follows the parentheses first: 8−(2+5)=8−7=1.",
        "equation": "H=1"
      },
      {
        "title": "Calculate Terry's value",
        "body": "Terry works left to right without parentheses: 8−2+5=6+5=11.",
        "equation": "T=11"
      },
      {
        "title": "Subtract",
        "body": "So H−T=1−11=−10."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2014",
      "algebra",
      "order of operations"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-02",
    "title": "2014 AMC 8 Problem 2: Paying 35 Cents",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 2,
    "category": "Number Theory",
    "subcategory": "Coins",
    "difficulty": 1,
    "statement": "Paul owes Paula 35 cents and has a pocket full of 5-cent coins, 10-cent coins, and 25-cent coins that he can use to pay her. What is the difference between the largest and the smallest number of coins he can use to pay her?",
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
    "answer": "E",
    "shortAnswer": "5",
    "solutionSteps": [
      {
        "title": "Use the fewest coins",
        "body": "The fewest coins are a quarter and a dime, for 2 coins."
      },
      {
        "title": "Use the most coins",
        "body": "The most coins come from all nickels: 35 cents is seven 5-cent coins."
      },
      {
        "title": "Find the difference",
        "body": "The difference is 7−2=5."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2014",
      "coins",
      "arithmetic"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-03",
    "title": "2014 AMC 8 Problem 3: Reading Pages",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Averages",
    "difficulty": 1,
    "statement": "Isabella had a week to read a book for a school assignment. She read an average of 36 pages per day for the first three days and an average of 44 pages per day for the next three days. She then finished the book by reading 10 pages on the last day. How many pages were in the book?",
    "choices": [
      {
        "label": "A",
        "text": "240"
      },
      {
        "label": "B",
        "text": "250"
      },
      {
        "label": "C",
        "text": "260"
      },
      {
        "label": "D",
        "text": "270"
      },
      {
        "label": "E",
        "text": "280"
      }
    ],
    "answer": "B",
    "shortAnswer": "250",
    "solutionSteps": [
      {
        "title": "First three days",
        "body": "She read 3·36=108 pages."
      },
      {
        "title": "Next three days",
        "body": "She read 3·44=132 pages."
      },
      {
        "title": "Add the last day",
        "body": "The total is 108+132+10=250 pages."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "averages",
      "arithmetic"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-04",
    "title": "2014 AMC 8 Problem 4: Prime Sum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 4,
    "category": "Number Theory",
    "subcategory": "Primes",
    "difficulty": 1,
    "statement": "The sum of two prime numbers is 85. What is the product of these two prime numbers?",
    "choices": [
      {
        "label": "A",
        "text": "85"
      },
      {
        "label": "B",
        "text": "91"
      },
      {
        "label": "C",
        "text": "115"
      },
      {
        "label": "D",
        "text": "133"
      },
      {
        "label": "E",
        "text": "166"
      }
    ],
    "answer": "E",
    "shortAnswer": "166",
    "solutionSteps": [
      {
        "title": "Use parity",
        "body": "An odd sum of two primes must include the only even prime, 2."
      },
      {
        "title": "Find the other prime",
        "body": "The other prime is 85−2=83."
      },
      {
        "title": "Multiply",
        "body": "The product is 2·83=166."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2014",
      "primes",
      "parity"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-05",
    "title": "2014 AMC 8 Problem 5: Gas Money",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 5,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 1,
    "statement": "Margie's car can go 32 miles on a gallon of gas, and gas currently costs $4 per gallon. How many miles can Margie drive on $20 worth of gas?",
    "choices": [
      {
        "label": "A",
        "text": "64"
      },
      {
        "label": "B",
        "text": "128"
      },
      {
        "label": "C",
        "text": "160"
      },
      {
        "label": "D",
        "text": "320"
      },
      {
        "label": "E",
        "text": "640"
      }
    ],
    "answer": "C",
    "shortAnswer": "160",
    "solutionSteps": [
      {
        "title": "Find gallons",
        "body": "At $4 per gallon, $20 buys 5 gallons."
      },
      {
        "title": "Use miles per gallon",
        "body": "At 32 miles per gallon, 5 gallons gives 5·32=160 miles."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2014",
      "rates",
      "unit rate"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-06",
    "title": "2014 AMC 8 Problem 6: Six Rectangle Areas",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 1,
    "statement": "Six rectangles each with a common base width of 2 have lengths of 1, 4, 9, 16, 25, and 36. What is the sum of the areas of the six rectangles?",
    "choices": [
      {
        "label": "A",
        "text": "91"
      },
      {
        "label": "B",
        "text": "93"
      },
      {
        "label": "C",
        "text": "162"
      },
      {
        "label": "D",
        "text": "182"
      },
      {
        "label": "E",
        "text": "202"
      }
    ],
    "answer": "D",
    "shortAnswer": "182",
    "solutionSteps": [
      {
        "title": "Factor out the common width",
        "body": "Each area is 2 times its length, so the total area is 2(1+4+9+16+25+36)."
      },
      {
        "title": "Add lengths",
        "body": "The lengths add to 91."
      },
      {
        "title": "Multiply",
        "body": "The total area is 2·91=182."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2014",
      "geometry",
      "area"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-07",
    "title": "2014 AMC 8 Problem 7: Girls and Boys Ratio",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 7,
    "category": "Algebra",
    "subcategory": "Linear equations",
    "difficulty": 1,
    "statement": "There are four more girls than boys in Ms. Raub's class of 28 students. What is the ratio of the number of girls to the number of boys in her class?",
    "choices": [
      {
        "label": "A",
        "text": "3:4"
      },
      {
        "label": "B",
        "text": "4:3"
      },
      {
        "label": "C",
        "text": "3:2"
      },
      {
        "label": "D",
        "text": "7:4"
      },
      {
        "label": "E",
        "text": "2:1"
      }
    ],
    "answer": "B",
    "shortAnswer": "4:3",
    "solutionSteps": [
      {
        "title": "Set up variables",
        "body": "Let b be the number of boys. Then the number of girls is b+4."
      },
      {
        "title": "Solve",
        "body": "b+(b+4)=28, so 2b=24 and b=12. There are 16 girls."
      },
      {
        "title": "Form the ratio",
        "body": "Girls to boys is 16:12=4:3."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "ratios",
      "linear equations"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-08",
    "title": "2014 AMC 8 Problem 8: Missing Digit Divisible by 11",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 8,
    "category": "Number Theory",
    "subcategory": "Divisibility",
    "difficulty": 2,
    "statement": "Eleven members of the Middle School Math Club each paid the same amount for a guest speaker. They paid their guest speaker $1A2. What is the missing digit A of this 3-digit number?",
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
        "title": "Use divisibility by 11",
        "body": "Because 11 members paid the same amount, 1A2 must be divisible by 11."
      },
      {
        "title": "Apply the rule",
        "body": "For 1A2, the alternating digit sum difference is 1+2−A=3−A."
      },
      {
        "title": "Choose A",
        "body": "For 3−A to be 0, A=3."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2014",
      "divisibility",
      "digits"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-09",
    "title": "2014 AMC 8 Problem 9: Triangle Angle Chase",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 9,
    "category": "Geometry",
    "subcategory": "Angles",
    "difficulty": 2,
    "statement": "In triangle ABC, D is a point on side AC such that BD=DC and angle BCD measures 70°. What is the degree measure of angle ADB?",
    "choices": [
      {
        "label": "A",
        "text": "100"
      },
      {
        "label": "B",
        "text": "120"
      },
      {
        "label": "C",
        "text": "135"
      },
      {
        "label": "D",
        "text": "140"
      },
      {
        "label": "E",
        "text": "150"
      }
    ],
    "answer": "D",
    "shortAnswer": "140°",
    "solutionSteps": [
      {
        "title": "Use the isosceles triangle",
        "body": "Since BD=DC, triangle BDC is isosceles, so angle DBC equals angle BCD, or 70°."
      },
      {
        "title": "Find angle BDC",
        "body": "The third angle in triangle BDC is 180°−70°−70°=40°."
      },
      {
        "title": "Use a straight line",
        "body": "Angles ADB and BDC are supplementary, so angle ADB=180°−40°=140°."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2014",
      "geometry",
      "angles",
      "isosceles triangle"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2014/problem-09-triangle-angle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2014-10",
    "title": "2014 AMC 8 Problem 10: Seventh AMC 8 Year",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 10,
    "category": "Other",
    "subcategory": "Calendar arithmetic",
    "difficulty": 1,
    "statement": "The first AMC 8 was given in 1985 and it has been given annually since that time. Samantha turned 12 years old the year that she took the seventh AMC 8. In what year was Samantha born?",
    "choices": [
      {
        "label": "A",
        "text": "1979"
      },
      {
        "label": "B",
        "text": "1980"
      },
      {
        "label": "C",
        "text": "1981"
      },
      {
        "label": "D",
        "text": "1982"
      },
      {
        "label": "E",
        "text": "1983"
      }
    ],
    "answer": "A",
    "shortAnswer": "1979",
    "solutionSteps": [
      {
        "title": "Find the seventh contest year",
        "body": "The first contest was in 1985, so the seventh was 6 years later: 1991."
      },
      {
        "title": "Subtract Samantha's age",
        "body": "Samantha was 12 in 1991, so she was born in 1991−12=1979."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2014",
      "calendar",
      "arithmetic"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-11",
    "title": "2014 AMC 8 Problem 11: Avoiding an Intersection",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 11,
    "category": "Counting & Probability",
    "subcategory": "Lattice paths",
    "difficulty": 3,
    "statement": "Jack wants to bike from his house to Jill's house, which is located three blocks east and two blocks north of Jack's house. After biking each block, Jack can continue either east or north, but he needs to avoid a dangerous intersection one block east and one block north of his house. In how many ways can he reach Jill's house by biking a total of five blocks?",
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
        "text": "10"
      }
    ],
    "answer": "A",
    "shortAnswer": "4",
    "solutionSteps": [
      {
        "title": "Count all shortest paths",
        "body": "A shortest path uses 3 east moves and 2 north moves, so there are C(5,2)=10 total paths."
      },
      {
        "title": "Subtract blocked paths",
        "body": "Paths through the dangerous intersection use 1 east and 1 north to reach it, then 2 east and 1 north after it: C(2,1)·C(3,1)=6."
      },
      {
        "title": "Compute safe paths",
        "body": "The number of safe paths is 10−6=4."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2014",
      "counting",
      "lattice paths",
      "complementary counting"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2014/problem-11-grid-paths.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2014-12",
    "title": "2014 AMC 8 Problem 12: Matching Baby Pictures",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 12,
    "category": "Counting & Probability",
    "subcategory": "Permutations",
    "difficulty": 2,
    "statement": "A magazine printed photos of three celebrities along with three photos of the celebrities as babies. The baby pictures did not identify the celebrities. Readers were asked to match each celebrity with the correct baby picture. What is the probability that a reader guessing at random will match all three correctly?",
    "choices": [
      {
        "label": "A",
        "text": "1/9"
      },
      {
        "label": "B",
        "text": "1/6"
      },
      {
        "label": "C",
        "text": "1/4"
      },
      {
        "label": "D",
        "text": "1/3"
      },
      {
        "label": "E",
        "text": "1/2"
      }
    ],
    "answer": "B",
    "shortAnswer": "1/6",
    "solutionSteps": [
      {
        "title": "Count arrangements",
        "body": "There are 3! = 6 possible matchings of baby pictures to celebrities."
      },
      {
        "title": "Only one works",
        "body": "Exactly one of the 6 matchings is completely correct."
      },
      {
        "title": "Find probability",
        "body": "The probability is 1/6."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "probability",
      "permutations"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-13",
    "title": "2014 AMC 8 Problem 13: Parity of Squares",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 13,
    "category": "Number Theory",
    "subcategory": "Parity",
    "difficulty": 2,
    "statement": "If n and m are integers and n²+m² is even, which of the following is impossible?",
    "choices": [
      {
        "label": "A",
        "text": "n and m are even"
      },
      {
        "label": "B",
        "text": "n and m are odd"
      },
      {
        "label": "C",
        "text": "n+m is even"
      },
      {
        "label": "D",
        "text": "n+m is odd"
      },
      {
        "label": "E",
        "text": "none of these are impossible"
      }
    ],
    "answer": "D",
    "shortAnswer": "n+m is odd",
    "solutionSteps": [
      {
        "title": "Use square parity",
        "body": "A square has the same parity as the number being squared."
      },
      {
        "title": "Make the sum even",
        "body": "For n²+m² to be even, n and m must have the same parity: both even or both odd."
      },
      {
        "title": "Conclude",
        "body": "If n and m have the same parity, n+m is always even, so n+m odd is impossible."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2014",
      "parity",
      "squares"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-14",
    "title": "2014 AMC 8 Problem 14: Rectangle and Triangle",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 14,
    "category": "Geometry",
    "subcategory": "Area and Pythagorean theorem",
    "difficulty": 3,
    "statement": "Rectangle ABCD and right triangle DCE have the same area. They are joined to form a trapezoid, as shown. What is DE?",
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
        "text": "14"
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
    "answer": "B",
    "shortAnswer": "13",
    "solutionSteps": [
      {
        "title": "Find rectangle area",
        "body": "Rectangle ABCD has area 5·6=30."
      },
      {
        "title": "Use equal triangle area",
        "body": "Triangle DCE has height DC=5, so (1/2)·5·CE=30. Thus CE=12."
      },
      {
        "title": "Use Pythagorean theorem",
        "body": "Triangle DCE is right with legs 5 and 12, so DE=13."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "geometry",
      "area",
      "pythagorean theorem"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2014/problem-14-rectangle-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2014-15",
    "title": "2014 AMC 8 Problem 15: Circle Arcs and Angles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 15,
    "category": "Geometry",
    "subcategory": "Inscribed angles",
    "difficulty": 3,
    "statement": "The circumference of the circle with center O is divided into 12 equal arcs, marked the letters A through L. What is the number of degrees in the sum of the angles x and y?",
    "choices": [
      {
        "label": "A",
        "text": "75"
      },
      {
        "label": "B",
        "text": "80"
      },
      {
        "label": "C",
        "text": "90"
      },
      {
        "label": "D",
        "text": "120"
      },
      {
        "label": "E",
        "text": "150"
      }
    ],
    "answer": "C",
    "shortAnswer": "90°",
    "solutionSteps": [
      {
        "title": "Find one arc measure",
        "body": "The circle is divided into 12 equal arcs, so each central step is 360°/12=30°."
      },
      {
        "title": "Find x",
        "body": "The central angle AOE covers 4 steps, so it is 120°. In isosceles triangle AOE, x=(180°−120°)/2=30°."
      },
      {
        "title": "Find y and add",
        "body": "The central angle GOI covers 2 steps, so it is 60°. Thus y=(180°−60°)/2=60°, and x+y=90°."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2014",
      "geometry",
      "circles",
      "angles"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2014/problem-15-circle-arcs.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2014-16",
    "title": "2014 AMC 8 Problem 16: Basketball Schedule",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 16,
    "category": "Counting & Probability",
    "subcategory": "Combinations",
    "difficulty": 2,
    "statement": "The Middle School Eight basketball conference has 8 teams. Every season, each team plays every other conference team twice, home and away, and each team also plays 4 games against non-conference opponents. What is the total number of games in a season involving the Middle School Eight teams?",
    "choices": [
      {
        "label": "A",
        "text": "60"
      },
      {
        "label": "B",
        "text": "88"
      },
      {
        "label": "C",
        "text": "96"
      },
      {
        "label": "D",
        "text": "144"
      },
      {
        "label": "E",
        "text": "160"
      }
    ],
    "answer": "B",
    "shortAnswer": "88",
    "solutionSteps": [
      {
        "title": "Conference games",
        "body": "There are C(8,2)=28 pairs of teams, and each pair plays twice, so there are 56 conference games."
      },
      {
        "title": "Non-conference games",
        "body": "Each of the 8 teams plays 4 non-conference games, giving 8·4=32 games involving these teams."
      },
      {
        "title": "Add",
        "body": "The total is 56+32=88."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "counting",
      "combinations"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-17",
    "title": "2014 AMC 8 Problem 17: Running to School",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 2,
    "statement": "George walks 1 mile to school. He leaves home at the same time each day, walks at a steady speed of 3 miles per hour, and arrives just as school begins. Today he walked the first 1/2 mile at only 2 miles per hour. At how many miles per hour must George run the last 1/2 mile in order to arrive just as school begins today?",
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
        "title": "Normal travel time",
        "body": "At 3 mph for 1 mile, the trip normally takes 1/3 hour."
      },
      {
        "title": "Slow first half",
        "body": "Today the first 1/2 mile at 2 mph takes (1/2)/2=1/4 hour."
      },
      {
        "title": "Find needed speed",
        "body": "He has 1/3−1/4=1/12 hour to travel 1/2 mile, so the speed is (1/2)/(1/12)=6 mph."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "rates",
      "distance"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-18",
    "title": "2014 AMC 8 Problem 18: Four Births",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 18,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "Four children were born at City Hospital yesterday. Assume each child is equally likely to be a boy or a girl. Which of the following outcomes is most likely?",
    "choices": [
      {
        "label": "A",
        "text": "all 4 are boys"
      },
      {
        "label": "B",
        "text": "all 4 are girls"
      },
      {
        "label": "C",
        "text": "2 are girls and 2 are boys"
      },
      {
        "label": "D",
        "text": "3 are of one gender and 1 is of the other gender"
      },
      {
        "label": "E",
        "text": "all of these outcomes are equally likely"
      }
    ],
    "answer": "D",
    "shortAnswer": "3 are of one gender and 1 is of the other gender",
    "solutionSteps": [
      {
        "title": "Count outcomes",
        "body": "There are 2^4=16 equally likely gender sequences."
      },
      {
        "title": "Compare cases",
        "body": "All boys and all girls each have 1 sequence; two and two has C(4,2)=6 sequences."
      },
      {
        "title": "Most likely",
        "body": "Three of one gender and one of the other has 4+4=8 sequences, the most."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
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
      "2014",
      "probability",
      "casework"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-19",
    "title": "2014 AMC 8 Problem 19: Minimizing White Surface Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Surface area",
    "difficulty": 4,
    "statement": "A cube with 3-inch edges is to be constructed from 27 smaller cubes with 1-inch edges. Twenty-one of the cubes are colored red and 6 are colored white. If the 3-inch cube is constructed to have the smallest possible white surface area showing, what fraction of the surface area is white?",
    "choices": [
      {
        "label": "A",
        "text": "5/54"
      },
      {
        "label": "B",
        "text": "1/9"
      },
      {
        "label": "C",
        "text": "5/27"
      },
      {
        "label": "D",
        "text": "2/9"
      },
      {
        "label": "E",
        "text": "1/3"
      }
    ],
    "answer": "A",
    "shortAnswer": "5/54",
    "solutionSteps": [
      {
        "title": "Hide one white cube",
        "body": "Place one white cube in the center, where none of its faces show."
      },
      {
        "title": "Minimize the other five",
        "body": "Place the remaining five white cubes at face centers, so each shows exactly one face."
      },
      {
        "title": "Find the fraction",
        "body": "There are 5 white unit faces showing out of total surface area 6·3²=54, so the fraction is 5/54."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "cube-net",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2014",
      "geometry",
      "surface area",
      "cube"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-20",
    "title": "2014 AMC 8 Problem 20: Rectangle Outside Circles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 20,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 4,
    "statement": "Rectangle ABCD has sides CD=3 and DA=5. A circle of radius 1 is centered at A, a circle of radius 2 is centered at B, and a circle of radius 3 is centered at C. Which of the following is closest to the area of the region inside the rectangle but outside all three circles?",
    "choices": [
      {
        "label": "A",
        "text": "3.5"
      },
      {
        "label": "B",
        "text": "4.0"
      },
      {
        "label": "C",
        "text": "4.5"
      },
      {
        "label": "D",
        "text": "5.0"
      },
      {
        "label": "E",
        "text": "5.5"
      }
    ],
    "answer": "B",
    "shortAnswer": "4.0",
    "solutionSteps": [
      {
        "title": "Rectangle area",
        "body": "The rectangle area is 3·5=15."
      },
      {
        "title": "Circle sectors inside",
        "body": "Inside the rectangle are three quarter circles with radii 1, 2, and 3, total area (π/4)(1²+2²+3²)=14π/4=7π/2."
      },
      {
        "title": "Approximate",
        "body": "15−7π/2 is about 15−11=4, so the closest choice is 4.0."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "geometry",
      "area",
      "circles"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2014/problem-20-rectangle-circles.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2014-21",
    "title": "2014 AMC 8 Problem 21: Divisibility by 3 Digits",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 21,
    "category": "Number Theory",
    "subcategory": "Digit divisibility",
    "difficulty": 4,
    "statement": "The 7-digit numbers 74A52B1 and 326AB4C are each multiples of 3. Which of the following could be the value of C?",
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
        "text": "5"
      },
      {
        "label": "E",
        "text": "8"
      }
    ],
    "answer": "A",
    "shortAnswer": "1",
    "solutionSteps": [
      {
        "title": "Use the first number",
        "body": "For 74A52B1, the digit sum is 19+A+B, so A+B must be 2 modulo 3."
      },
      {
        "title": "Use the second number",
        "body": "For 326AB4C, the digit sum is 15+A+B+C, so A+B+C must be divisible by 3."
      },
      {
        "title": "Find C",
        "body": "Since A+B is 2 modulo 3, C must be 1 modulo 3. Among the choices, only 1 works."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2014",
      "number theory",
      "digits",
      "divisibility"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-22",
    "title": "2014 AMC 8 Problem 22: Product Plus Sum Digits",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 22,
    "category": "Number Theory",
    "subcategory": "Digits",
    "difficulty": 4,
    "statement": "A 2-digit number is such that the product of the digits plus the sum of the digits is equal to the number. What is the units digit of the number?",
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
        "text": "5"
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
    "answer": "E",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Write the number",
        "body": "Let the number be 10a+b."
      },
      {
        "title": "Translate the condition",
        "body": "Product plus sum equals the number: ab+a+b=10a+b."
      },
      {
        "title": "Solve",
        "body": "This simplifies to ab=9a. Since a is nonzero, b=9."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2014",
      "digits",
      "algebra"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-23",
    "title": "2014 AMC 8 Problem 23: Softball Uniform Numbers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 23,
    "category": "Logic",
    "subcategory": "Logic with primes",
    "difficulty": 5,
    "statement": "Three members of the Euclid Middle School girls' softball team have 2-digit prime uniform numbers. Ashley says the sum of Brittany's and Caitlin's numbers is today's date. Brittany says the sum of Ashley's and Caitlin's numbers is her birthday earlier this month. Caitlin says the sum of Ashley's and Brittany's numbers is her birthday later this month. What number does Caitlin wear?",
    "choices": [
      {
        "label": "A",
        "text": "11"
      },
      {
        "label": "B",
        "text": "13"
      },
      {
        "label": "C",
        "text": "17"
      },
      {
        "label": "D",
        "text": "19"
      },
      {
        "label": "E",
        "text": "23"
      }
    ],
    "answer": "A",
    "shortAnswer": "11",
    "solutionSteps": [
      {
        "title": "List possible small prime sums",
        "body": "The sums must be dates, so they are at most 31. Possible sums of two 2-digit primes from the choices are 24, 28, and 30."
      },
      {
        "title": "Use the order of dates",
        "body": "Brittany's date is earlier, Ashley's is today, and Caitlin's is later, so Caitlin's corresponding sum is the largest."
      },
      {
        "title": "Identify Caitlin's number",
        "body": "For the other two girls to have the largest sum, Caitlin must have the smallest uniform number: 11."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
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
      "2014",
      "logic",
      "primes",
      "casework"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-24",
    "title": "2014 AMC 8 Problem 24: Maximum Median Cans",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 24,
    "category": "Counting & Probability",
    "subcategory": "Optimization",
    "difficulty": 5,
    "statement": "One day the Beverage Barn sold 252 cans of soda to 100 customers, and every customer bought at least one can. What is the maximum possible median number of cans of soda bought per customer on that day?",
    "choices": [
      {
        "label": "A",
        "text": "2.5"
      },
      {
        "label": "B",
        "text": "3.0"
      },
      {
        "label": "C",
        "text": "3.5"
      },
      {
        "label": "D",
        "text": "4.0"
      },
      {
        "label": "E",
        "text": "4.5"
      }
    ],
    "answer": "C",
    "shortAnswer": "3.5",
    "solutionSteps": [
      {
        "title": "Set up the median",
        "body": "With 100 customers, the median is the average of the 50th and 51st numbers after sorting purchases."
      },
      {
        "title": "Make the first half small",
        "body": "Give the first 49 customers one can each, leaving 203 cans for the top 51 customers."
      },
      {
        "title": "Maximize the middle pair",
        "body": "If the 50th customer had 4 cans, at least 49+51·4=253 cans would be needed. So the 50th can be 3 and the 51st can be 4, giving median 3.5."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2014",
      "optimization",
      "median",
      "counting"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2014-25",
    "title": "2014 AMC 8 Problem 25: Bike Path Semicircles",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2014,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Arc length",
    "difficulty": 5,
    "statement": "A straight one-mile stretch of highway, 40 feet wide, is closed. Robert rides his bike on a path composed of semicircles as shown. If he rides at 5 miles per hour, how many hours will it take to cover the one-mile stretch? Note: 1 mile = 5280 feet.",
    "choices": [
      {
        "label": "A",
        "text": "π/11"
      },
      {
        "label": "B",
        "text": "π/10"
      },
      {
        "label": "C",
        "text": "π/5"
      },
      {
        "label": "D",
        "text": "2π/5"
      },
      {
        "label": "E",
        "text": "2π/3"
      }
    ],
    "answer": "B",
    "shortAnswer": "π/10",
    "solutionSteps": [
      {
        "title": "Compare arc length to diameter",
        "body": "Each semicircle has length (π/2) times its diameter."
      },
      {
        "title": "Scale the whole mile",
        "body": "The whole path is therefore (π/2) times the one-mile straight stretch, or π/2 miles."
      },
      {
        "title": "Use speed",
        "body": "At 5 miles per hour, time = (π/2)/5 = π/10 hours."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the question",
        "narration": "Identify the key numbers and the relationship being used.",
        "visualHint": "Highlight the important quantities in the problem."
      },
      {
        "title": "Apply the main idea",
        "narration": "Work through the arithmetic, counting, geometry, or probability step by step.",
        "visualHint": "Animate the central calculation."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2014",
      "geometry",
      "arc length",
      "rates"
    ],
    "sourceName": "2014 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2014/problem-25-highway-semicircles.svg"
    ],
    "needsDiagram": true
  }
];

const amc2015Problems: Problem[] = [
  {
    "id": "amc8-2015-01",
    "title": "2015 AMC 8 Problem 1: Room Carpet Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 1,
    "category": "Geometry",
    "subcategory": "Area and unit conversion",
    "difficulty": 1,
    "statement": "Onkon wants to cover his room's floor with his favorite red carpet. How many square yards of red carpet are required to cover a rectangular floor that is 12 feet long and 9 feet wide? (There are 3 feet in a yard.)",
    "choices": [
      {
        "label": "A",
        "text": "12"
      },
      {
        "label": "B",
        "text": "36"
      },
      {
        "label": "C",
        "text": "108"
      },
      {
        "label": "D",
        "text": "324"
      },
      {
        "label": "E",
        "text": "972"
      }
    ],
    "answer": "A",
    "shortAnswer": "12 square yards",
    "solutionSteps": [
      {
        "title": "Find the area in square feet",
        "body": "The rectangular floor has area 12 × 9 = 108 square feet.",
        "equation": "12×9=108"
      },
      {
        "title": "Convert to square yards",
        "body": "One square yard is 3 feet by 3 feet, or 9 square feet.",
        "equation": "108÷9=12"
      },
      {
        "title": "Conclude",
        "body": "The room needs 12 square yards of carpet."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "geometry",
      "area and unit conversion",
      "area",
      "unit conversion"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-02",
    "title": "2015 AMC 8 Problem 2: Shaded Octagon Fraction",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 2,
    "category": "Geometry",
    "subcategory": "Area fractions",
    "difficulty": 2,
    "statement": "Point O is the center of regular octagon ABCDEFGH, and X is the midpoint of side AB. What fraction of the area of the octagon is shaded?",
    "choices": [
      {
        "label": "A",
        "text": "11/32"
      },
      {
        "label": "B",
        "text": "3/8"
      },
      {
        "label": "C",
        "text": "13/32"
      },
      {
        "label": "D",
        "text": "7/16"
      },
      {
        "label": "E",
        "text": "15/32"
      }
    ],
    "answer": "D",
    "shortAnswer": "7/16",
    "solutionSteps": [
      {
        "title": "Split the octagon",
        "body": "Connecting the center to all vertices splits the regular octagon into 8 congruent triangles."
      },
      {
        "title": "Count shaded pieces",
        "body": "The shaded region contains 3 full center triangles plus half of a fourth triangle.",
        "equation": "3·(1/8)+1/16"
      },
      {
        "title": "Simplify",
        "body": "The shaded fraction is 3/8 + 1/16 = 7/16."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "geometry",
      "area fractions",
      "octagon",
      "fraction"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2015/problem-02-octagon.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2015-03",
    "title": "2015 AMC 8 Problem 3: Race to the Pool",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 3,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 1,
    "statement": "Jack and Jill are going swimming at a pool that is one mile from their house. They leave home simultaneously. Jill rides her bicycle to the pool at 10 miles per hour. Jack walks to the pool at 4 miles per hour. How many minutes before Jack does Jill arrive?",
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
    "answer": "D",
    "shortAnswer": "9 minutes",
    "solutionSteps": [
      {
        "title": "Find Jill's time",
        "body": "Jill rides 1 mile at 10 miles per hour, so her time is 1/10 hour, or 6 minutes."
      },
      {
        "title": "Find Jack's time",
        "body": "Jack walks 1 mile at 4 miles per hour, so his time is 1/4 hour, or 15 minutes."
      },
      {
        "title": "Subtract",
        "body": "Jill arrives 15 − 6 = 9 minutes before Jack.",
        "equation": "15-6=9"
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "algebra",
      "rates",
      "rates",
      "time"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-04",
    "title": "2015 AMC 8 Problem 4: Chess Team Photo",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 4,
    "category": "Counting & Probability",
    "subcategory": "Permutations",
    "difficulty": 1,
    "statement": "The Centerville Middle School chess team consists of two boys and three girls. A photographer wants them to sit in a row with a boy at each end and the three girls in the middle. How many such arrangements are possible?",
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
        "text": "12"
      }
    ],
    "answer": "E",
    "shortAnswer": "12",
    "solutionSteps": [
      {
        "title": "Arrange the boys",
        "body": "The two boys can be placed on the two ends in 2! = 2 ways."
      },
      {
        "title": "Arrange the girls",
        "body": "The three girls can be arranged in the middle in 3! = 6 ways."
      },
      {
        "title": "Multiply",
        "body": "There are 2 × 6 = 12 arrangements."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2015",
      "counting & probability",
      "permutations",
      "permutations"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-05",
    "title": "2015 AMC 8 Problem 5: Basketball Statistic Change",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 5,
    "category": "Statistics",
    "subcategory": "Mean median mode range",
    "difficulty": 2,
    "statement": "Billy's basketball team scored 42, 47, 53, 53, 58, 58, 58, 61, 64, 65, and 73 points over the first 11 games. If his team scores 40 in the 12th game, which statistic will show an increase?",
    "choices": [
      {
        "label": "A",
        "text": "range"
      },
      {
        "label": "B",
        "text": "median"
      },
      {
        "label": "C",
        "text": "mean"
      },
      {
        "label": "D",
        "text": "mode"
      },
      {
        "label": "E",
        "text": "mid-range"
      }
    ],
    "answer": "A",
    "shortAnswer": "range",
    "solutionSteps": [
      {
        "title": "Check the range before",
        "body": "Before the 12th game, the range is 73 − 42 = 31."
      },
      {
        "title": "Check the range after",
        "body": "A score of 40 becomes the new minimum, so the range is 73 − 40 = 33."
      },
      {
        "title": "Conclude",
        "body": "The range increases, so the answer is A."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "statistics",
      "mean median mode range",
      "statistics",
      "range"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-06",
    "title": "2015 AMC 8 Problem 6: Isosceles Triangle Area",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 6,
    "category": "Geometry",
    "subcategory": "Triangle area",
    "difficulty": 3,
    "statement": "In triangle ABC, AB = BC = 29, and AC = 42. What is the area of triangle ABC?",
    "choices": [
      {
        "label": "A",
        "text": "100"
      },
      {
        "label": "B",
        "text": "420"
      },
      {
        "label": "C",
        "text": "500"
      },
      {
        "label": "D",
        "text": "609"
      },
      {
        "label": "E",
        "text": "701"
      }
    ],
    "answer": "B",
    "shortAnswer": "420",
    "solutionSteps": [
      {
        "title": "Use symmetry",
        "body": "The altitude from B to AC bisects AC, giving two segments of length 21."
      },
      {
        "title": "Find the height",
        "body": "Use a right triangle with hypotenuse 29 and leg 21. The height is √(29² − 21²) = 20."
      },
      {
        "title": "Find the area",
        "body": "Area = 1/2 × 42 × 20 = 420.",
        "equation": "½×42×20=420"
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2015",
      "geometry",
      "triangle area",
      "triangle",
      "pythagorean theorem"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-07",
    "title": "2015 AMC 8 Problem 7: Even Product from Chips",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 7,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 1,
    "statement": "Each of two boxes contains three chips numbered 1, 2, and 3. A chip is drawn randomly from each box and the numbers on the two chips are multiplied. What is the probability that their product is even?",
    "choices": [
      {
        "label": "A",
        "text": "1/9"
      },
      {
        "label": "B",
        "text": "2/9"
      },
      {
        "label": "C",
        "text": "4/9"
      },
      {
        "label": "D",
        "text": "1/2"
      },
      {
        "label": "E",
        "text": "5/9"
      }
    ],
    "answer": "E",
    "shortAnswer": "5/9",
    "solutionSteps": [
      {
        "title": "Count all outcomes",
        "body": "There are 3 × 3 = 9 equally likely ordered outcomes."
      },
      {
        "title": "Count even products",
        "body": "A product is even exactly when at least one chip is 2. The even outcomes are (1,2), (2,1), (2,2), (2,3), and (3,2)."
      },
      {
        "title": "Write the probability",
        "body": "There are 5 favorable outcomes out of 9, so the probability is 5/9."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice E.",
        "visualHint": "Circle answer choice E."
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
      "2015",
      "counting & probability",
      "probability",
      "probability",
      "even odd"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-08",
    "title": "2015 AMC 8 Problem 8: Triangle Perimeter Bound",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 8,
    "category": "Geometry",
    "subcategory": "Triangle inequality",
    "difficulty": 2,
    "statement": "What is the smallest whole number larger than the perimeter of any triangle with a side of length 5 and a side of length 19?",
    "choices": [
      {
        "label": "A",
        "text": "24"
      },
      {
        "label": "B",
        "text": "29"
      },
      {
        "label": "C",
        "text": "43"
      },
      {
        "label": "D",
        "text": "48"
      },
      {
        "label": "E",
        "text": "57"
      }
    ],
    "answer": "D",
    "shortAnswer": "48",
    "solutionSteps": [
      {
        "title": "Bound the third side",
        "body": "By the triangle inequality, the third side s must satisfy s < 5 + 19 = 24."
      },
      {
        "title": "Bound the perimeter",
        "body": "The perimeter is s + 5 + 19, so it must be less than 48."
      },
      {
        "title": "Conclude",
        "body": "The smallest whole number larger than any possible perimeter is 48."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "geometry",
      "triangle inequality",
      "triangle inequality"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-09",
    "title": "2015 AMC 8 Problem 9: Odd Widgets Sum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 9,
    "category": "Algebra",
    "subcategory": "Arithmetic sequences",
    "difficulty": 2,
    "statement": "On her first day of work, Janabel sold 1 widget. On day two, she sold 3 widgets. On day three, she sold 5 widgets, and on each succeeding day, she sold two more widgets than on the previous day. How many widgets in total had Janabel sold after working 20 days?",
    "choices": [
      {
        "label": "A",
        "text": "39"
      },
      {
        "label": "B",
        "text": "40"
      },
      {
        "label": "C",
        "text": "210"
      },
      {
        "label": "D",
        "text": "400"
      },
      {
        "label": "E",
        "text": "401"
      }
    ],
    "answer": "D",
    "shortAnswer": "400",
    "solutionSteps": [
      {
        "title": "Recognize odd numbers",
        "body": "The daily totals are the first 20 positive odd numbers: 1, 3, 5, ..., 39."
      },
      {
        "title": "Use the sum formula",
        "body": "The sum of the first n odd numbers is n²."
      },
      {
        "title": "Compute",
        "body": "For n = 20, the total is 20² = 400."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "algebra",
      "arithmetic sequences",
      "sequences",
      "sums"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-10",
    "title": "2015 AMC 8 Problem 10: Four Distinct Digits",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 10,
    "category": "Counting & Probability",
    "subcategory": "Counting digits",
    "difficulty": 2,
    "statement": "How many integers between 1000 and 9999 have four distinct digits?",
    "choices": [
      {
        "label": "A",
        "text": "3024"
      },
      {
        "label": "B",
        "text": "4536"
      },
      {
        "label": "C",
        "text": "5040"
      },
      {
        "label": "D",
        "text": "6480"
      },
      {
        "label": "E",
        "text": "6561"
      }
    ],
    "answer": "B",
    "shortAnswer": "4536",
    "solutionSteps": [
      {
        "title": "Choose the first digit",
        "body": "The thousands digit cannot be 0, so there are 9 choices."
      },
      {
        "title": "Choose the remaining digits",
        "body": "After the first digit, there are 9 choices for the second digit, then 8, then 7."
      },
      {
        "title": "Multiply",
        "body": "There are 9 × 9 × 8 × 7 = 4536 such integers."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2015",
      "counting & probability",
      "counting digits",
      "counting",
      "digits"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-11",
    "title": "2015 AMC 8 Problem 11: Mathland License Plate",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 11,
    "category": "Counting & Probability",
    "subcategory": "Probability",
    "difficulty": 2,
    "statement": "In Mathland, all automobile license plates have four symbols. The first must be a vowel, the second and third must be two different letters among the 21 non-vowels, and the fourth must be a digit. If the symbols are chosen at random subject to these conditions, what is the probability that the plate will read AMC8?",
    "choices": [
      {
        "label": "A",
        "text": "1/22050"
      },
      {
        "label": "B",
        "text": "1/21000"
      },
      {
        "label": "C",
        "text": "1/10500"
      },
      {
        "label": "D",
        "text": "1/2100"
      },
      {
        "label": "E",
        "text": "1/1050"
      }
    ],
    "answer": "B",
    "shortAnswer": "1/21000",
    "solutionSteps": [
      {
        "title": "Count possible plates",
        "body": "There are 5 choices for the vowel, 21 choices for the first non-vowel, 20 choices for the second non-vowel, and 10 choices for the digit."
      },
      {
        "title": "Multiply",
        "body": "The total number of possible plates is 5 × 21 × 20 × 10 = 21000."
      },
      {
        "title": "Use one favorable outcome",
        "body": "Only one plate is AMC8, so the probability is 1/21000."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2015",
      "counting & probability",
      "probability",
      "probability",
      "counting"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-12",
    "title": "2015 AMC 8 Problem 12: Parallel Edges of a Cube",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 12,
    "category": "Geometry",
    "subcategory": "Solid geometry",
    "difficulty": 2,
    "statement": "How many pairs of parallel edges, such as AB and GH or EH and FG, does a cube have?",
    "choices": [
      {
        "label": "A",
        "text": "6"
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
        "text": "24"
      },
      {
        "label": "E",
        "text": "36"
      }
    ],
    "answer": "C",
    "shortAnswer": "18",
    "solutionSteps": [
      {
        "title": "Group by direction",
        "body": "A cube has 12 edges in 3 groups of 4 mutually parallel edges."
      },
      {
        "title": "Count pairs in one group",
        "body": "In a group of 4 parallel edges, there are C(4,2) = 6 pairs."
      },
      {
        "title": "Multiply by directions",
        "body": "There are 3 directions, so the total is 3 × 6 = 18 pairs."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2015",
      "geometry",
      "solid geometry",
      "cube",
      "parallel lines"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2015/problem-12-cube.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2015-13",
    "title": "2015 AMC 8 Problem 13: Remove Two for Mean Six",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 13,
    "category": "Statistics",
    "subcategory": "Mean and subsets",
    "difficulty": 3,
    "statement": "How many subsets of two elements can be removed from the set {1,2,3,4,5,6,7,8,9,10,11} so that the mean of the remaining numbers is 6?",
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
        "title": "Find the target sum",
        "body": "After removing two numbers, 9 numbers remain with mean 6, so their sum must be 9 × 6 = 54."
      },
      {
        "title": "Find the removed sum",
        "body": "The original set sums to 66, so the removed pair must sum to 66 − 54 = 12."
      },
      {
        "title": "Count pairs",
        "body": "The pairs are {1,11}, {2,10}, {3,9}, {4,8}, and {5,7}, giving 5 subsets."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "statistics",
      "mean and subsets",
      "mean",
      "sets"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-14",
    "title": "2015 AMC 8 Problem 14: Four Consecutive Odd Integers",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 14,
    "category": "Number Theory",
    "subcategory": "Parity and expressions",
    "difficulty": 3,
    "statement": "Which of the following integers cannot be written as the sum of four consecutive odd integers?",
    "choices": [
      {
        "label": "A",
        "text": "16"
      },
      {
        "label": "B",
        "text": "40"
      },
      {
        "label": "C",
        "text": "72"
      },
      {
        "label": "D",
        "text": "100"
      },
      {
        "label": "E",
        "text": "200"
      }
    ],
    "answer": "D",
    "shortAnswer": "100",
    "solutionSteps": [
      {
        "title": "Write the sum",
        "body": "Four consecutive odd integers can be written as n, n+2, n+4, and n+6 where n is odd."
      },
      {
        "title": "Simplify",
        "body": "Their sum is 4n + 12 = 4(n+3). Since n is odd, n+3 is even, so the sum is a multiple of 8."
      },
      {
        "title": "Check choices",
        "body": "100 is not divisible by 8, so it cannot be written this way."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "number theory",
      "parity and expressions",
      "odd integers",
      "divisibility"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-15",
    "title": "2015 AMC 8 Problem 15: School Referendum",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 15,
    "category": "Counting & Probability",
    "subcategory": "Inclusion-exclusion",
    "difficulty": 3,
    "statement": "At Euler Middle School, 198 students voted on two issues in a school referendum. 149 voted in favor of the first issue and 119 voted in favor of the second issue. If exactly 29 students voted against both issues, how many students voted in favor of both issues?",
    "choices": [
      {
        "label": "A",
        "text": "49"
      },
      {
        "label": "B",
        "text": "70"
      },
      {
        "label": "C",
        "text": "79"
      },
      {
        "label": "D",
        "text": "99"
      },
      {
        "label": "E",
        "text": "149"
      }
    ],
    "answer": "D",
    "shortAnswer": "99",
    "solutionSteps": [
      {
        "title": "Find students for at least one issue",
        "body": "Since 29 voted against both, 198 − 29 = 169 students voted for at least one issue."
      },
      {
        "title": "Apply inclusion-exclusion",
        "body": "149 + 119 − both = 169."
      },
      {
        "title": "Solve",
        "body": "Both = 149 + 119 − 169 = 99."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "counting & probability",
      "inclusion-exclusion",
      "inclusion-exclusion",
      "sets"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-16",
    "title": "2015 AMC 8 Problem 16: Mentoring Buddies",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 16,
    "category": "Algebra",
    "subcategory": "Ratios",
    "difficulty": 4,
    "statement": "In a middle-school mentoring program, some sixth graders are paired with ninth graders as buddies. No ninth grader is assigned more than one sixth-grade buddy. If 1/3 of all ninth graders are paired with 2/5 of all sixth graders, what fraction of the total number of sixth and ninth graders have a buddy?",
    "choices": [
      {
        "label": "A",
        "text": "2/15"
      },
      {
        "label": "B",
        "text": "4/11"
      },
      {
        "label": "C",
        "text": "11/30"
      },
      {
        "label": "D",
        "text": "3/8"
      },
      {
        "label": "E",
        "text": "11/15"
      }
    ],
    "answer": "B",
    "shortAnswer": "4/11",
    "solutionSteps": [
      {
        "title": "Relate the group sizes",
        "body": "Let s be the number of sixth graders and n be the number of ninth graders. The paired counts are equal, so n/3 = 2s/5."
      },
      {
        "title": "Solve the ratio",
        "body": "From n/3 = 2s/5, we get n = 6s/5."
      },
      {
        "title": "Find the buddy fraction",
        "body": "The paired students are n/3 + 2s/5 = 4s/5, while the total students are n+s = 11s/5. The fraction is (4s/5)/(11s/5)=4/11."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2015",
      "algebra",
      "ratios",
      "ratios",
      "fractions"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-17",
    "title": "2015 AMC 8 Problem 17: Rush Hour Drive",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 17,
    "category": "Algebra",
    "subcategory": "Rates",
    "difficulty": 3,
    "statement": "Jeremy's father drives him to school in rush hour traffic in 20 minutes. One day there is no traffic, so his father can drive him 18 miles per hour faster and gets him to school in 12 minutes. How far in miles is it to school?",
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
        "text": "9"
      },
      {
        "label": "E",
        "text": "12"
      }
    ],
    "answer": "D",
    "shortAnswer": "9",
    "solutionSteps": [
      {
        "title": "Use times in hours",
        "body": "20 minutes is 1/3 hour and 12 minutes is 1/5 hour."
      },
      {
        "title": "Set equal distances",
        "body": "If the usual speed is v, then distance d satisfies d = v/3 and d = (v+18)/5."
      },
      {
        "title": "Solve",
        "body": "Equating gives v/3 = (v+18)/5, so v = 27 and d = 27/3 = 9 miles."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "algebra",
      "rates",
      "rates"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-18",
    "title": "2015 AMC 8 Problem 18: Arithmetic Sequence Grid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 18,
    "category": "Algebra",
    "subcategory": "Arithmetic sequences",
    "difficulty": 3,
    "statement": "Each row and each column in a 5 by 5 array is an arithmetic sequence with five terms. The top-left entry is 1, the top-right entry is 25, the bottom-left entry is 17, the bottom-right entry is 81, and the center square is labeled X. What is X?",
    "choices": [
      {
        "label": "A",
        "text": "21"
      },
      {
        "label": "B",
        "text": "31"
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
        "text": "42"
      }
    ],
    "answer": "B",
    "shortAnswer": "31",
    "solutionSteps": [
      {
        "title": "Find the top middle",
        "body": "In an arithmetic sequence, the middle term is the average of the first and last terms. The top middle is (1+25)/2 = 13."
      },
      {
        "title": "Find the bottom middle",
        "body": "The bottom middle is (17+81)/2 = 49."
      },
      {
        "title": "Find the center",
        "body": "The center is the middle of the middle column, so X = (13+49)/2 = 31."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2015",
      "algebra",
      "arithmetic sequences",
      "arithmetic sequence",
      "grid"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2015/problem-18-arithmetic-grid.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2015-19",
    "title": "2015 AMC 8 Problem 19: Triangle on a Grid",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 19,
    "category": "Geometry",
    "subcategory": "Coordinate geometry",
    "difficulty": 3,
    "statement": "A triangle with vertices A=(1,3), B=(5,1), and C=(4,4) is plotted on a 6 by 5 grid. What fraction of the grid is covered by the triangle?",
    "choices": [
      {
        "label": "A",
        "text": "1/6"
      },
      {
        "label": "B",
        "text": "1/5"
      },
      {
        "label": "C",
        "text": "1/4"
      },
      {
        "label": "D",
        "text": "1/3"
      },
      {
        "label": "E",
        "text": "1/2"
      }
    ],
    "answer": "A",
    "shortAnswer": "1/6",
    "solutionSteps": [
      {
        "title": "Find the triangle area",
        "body": "Using the coordinate area formula, the area of triangle ABC is 5 square units."
      },
      {
        "title": "Find the grid area",
        "body": "The 6 by 5 grid has area 30 square units."
      },
      {
        "title": "Form the fraction",
        "body": "The fraction covered is 5/30 = 1/6."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice A.",
        "visualHint": "Circle answer choice A."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "A"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "geometry",
      "coordinate geometry",
      "coordinate geometry",
      "area"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2015/problem-19-coordinate-triangle.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2015-20",
    "title": "2015 AMC 8 Problem 20: Sock Prices",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 20,
    "category": "Algebra",
    "subcategory": "Systems of equations",
    "difficulty": 4,
    "statement": "Ralph bought 12 pairs of socks for a total of $24. Some socks cost $1 a pair, some cost $3 a pair, and some cost $4 a pair. If he bought at least one pair of each type, how many pairs of $1 socks did Ralph buy?",
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
        "text": "8"
      }
    ],
    "answer": "D",
    "shortAnswer": "7",
    "solutionSteps": [
      {
        "title": "Set up equations",
        "body": "Let x, y, and z be the numbers of $1, $3, and $4 socks. Then x+y+z=12 and x+3y+4z=24."
      },
      {
        "title": "Subtract",
        "body": "Subtracting the first equation from the second gives 2y+3z=12."
      },
      {
        "title": "Use positive integers",
        "body": "With y,z at least 1, the solution is y=3 and z=2. Thus x=12−3−2=7."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "algebra",
      "systems of equations",
      "systems",
      "integer solutions"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-21",
    "title": "2015 AMC 8 Problem 21: Equiangular Hexagon Construction",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 21,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 5,
    "statement": "In the figure, hexagon ABCDEF is equiangular, ABJI and FEHG are squares with areas 18 and 32 respectively, triangle JBK is equilateral, and FE = BC. What is the area of triangle KBC?",
    "choices": [
      {
        "label": "A",
        "text": "6√2"
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
        "text": "9√2"
      },
      {
        "label": "E",
        "text": "32"
      }
    ],
    "answer": "C",
    "shortAnswer": "12",
    "solutionSteps": [
      {
        "title": "Find two side lengths",
        "body": "FE is a side of a square with area 32, so FE=4√2. Since FE=BC, BC=4√2. Also JB is a side of a square with area 18, so JB=3√2."
      },
      {
        "title": "Use the equilateral triangle",
        "body": "Since triangle JBK is equilateral, BK=JB=3√2."
      },
      {
        "title": "Find the area",
        "body": "Angle KBC is a right angle, so triangle KBC has legs 3√2 and 4√2. Its area is (3√2·4√2)/2=12."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2015",
      "geometry",
      "area",
      "geometry",
      "area"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2015/problem-21-hexagon-construction.svg"
    ],
    "needsDiagram": true
  },
  {
    "id": "amc8-2015-22",
    "title": "2015 AMC 8 Problem 22: Rows of Students",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 22,
    "category": "Number Theory",
    "subcategory": "Factors",
    "difficulty": 4,
    "statement": "On June 1, a group of students stands in rows with 15 students in each row. On June 2, the same group is in one long row. On June 3, just one student is in each row. On June 4, the group stands with 6 students in each row. This continues through June 12 with a different number of students per row each day, but on June 13 they cannot find a new way. What is the smallest possible number of students?",
    "choices": [
      {
        "label": "A",
        "text": "21"
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
        "text": "90"
      },
      {
        "label": "E",
        "text": "1080"
      }
    ],
    "answer": "C",
    "shortAnswer": "60",
    "solutionSteps": [
      {
        "title": "Interpret arrangements",
        "body": "A different number of students per row corresponds to a different divisor of the total number of students."
      },
      {
        "title": "Use the clues",
        "body": "The total must have exactly 12 divisors and be divisible by 15 and 6."
      },
      {
        "title": "Find the smallest",
        "body": "60 has divisors 1,2,3,4,5,6,10,12,15,20,30,60, so it works and is the smallest choice."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2015",
      "number theory",
      "factors",
      "divisors",
      "factors"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-23",
    "title": "2015 AMC 8 Problem 23: Cups and Consecutive Sums",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 23,
    "category": "Number Theory",
    "subcategory": "Logic",
    "difficulty": 5,
    "statement": "Tom has twelve slips labeled 2, 2, 2, 2.5, 2.5, 3, 3, 3, 3, 3.5, 4, and 4.5. He wants to put them into cups A, B, C, D, E so that the sums in the cups are consecutive integers increasing from A to E. If a 2 goes into cup E and a 3 goes into cup B, then the slip with 3.5 must go into what cup?",
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
    "answer": "D",
    "shortAnswer": "D",
    "solutionSteps": [
      {
        "title": "Find the target sums",
        "body": "The slips sum to 35, so the five consecutive cup sums average 7. The sums must be 5, 6, 7, 8, and 9."
      },
      {
        "title": "Use the given slips",
        "body": "Cup E already has 2 and must sum to 9. Cup B already has 3 and must sum to 6."
      },
      {
        "title": "Eliminate positions",
        "body": "The 3.5 slip cannot fit cups A, B, C, or E under the remaining sums. Therefore it must go in cup D."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice D.",
        "visualHint": "Circle answer choice D."
      }
    ],
    "animation": {
      "type": "generic",
      "data": {
        "answer": "D"
      }
    },
    "tags": [
      "AMC 8",
      "2015",
      "number theory",
      "logic",
      "logic",
      "casework"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-24",
    "title": "2015 AMC 8 Problem 24: Baseball Division Schedule",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 24,
    "category": "Algebra",
    "subcategory": "Linear equations",
    "difficulty": 4,
    "statement": "A baseball league consists of two four-team divisions. Each team plays every other team in its division N games and every team in the other division M games, with N > 2M and M > 4. Each team plays a 76-game schedule. How many games does a team play within its own division?",
    "choices": [
      {
        "label": "A",
        "text": "36"
      },
      {
        "label": "B",
        "text": "48"
      },
      {
        "label": "C",
        "text": "54"
      },
      {
        "label": "D",
        "text": "60"
      },
      {
        "label": "E",
        "text": "72"
      }
    ],
    "answer": "B",
    "shortAnswer": "48",
    "solutionSteps": [
      {
        "title": "Write the schedule equation",
        "body": "Each team has 3 division opponents and 4 non-division opponents, so 3N + 4M = 76."
      },
      {
        "title": "Test possible M",
        "body": "Since M > 4, try M = 5, 6, 7, ... . The first value giving an integer N and satisfying N > 2M is M = 7."
      },
      {
        "title": "Compute division games",
        "body": "When M=7, 3N = 76 − 28 = 48, so a team plays 48 games within its own division."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice B.",
        "visualHint": "Circle answer choice B."
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
      "2015",
      "algebra",
      "linear equations",
      "linear equations",
      "sports schedule"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA"
  },
  {
    "id": "amc8-2015-25",
    "title": "2015 AMC 8 Problem 25: Largest Square After Corner Cuts",
    "sourceType": "AMC",
    "contest": "AMC 8",
    "year": 2015,
    "problemNumber": 25,
    "category": "Geometry",
    "subcategory": "Area",
    "difficulty": 5,
    "statement": "One-inch squares are cut from the corners of a 5-inch square. What is the area in square inches of the largest square that can be fitted into the remaining space?",
    "choices": [
      {
        "label": "A",
        "text": "9"
      },
      {
        "label": "B",
        "text": "12 1/2"
      },
      {
        "label": "C",
        "text": "15"
      },
      {
        "label": "D",
        "text": "15 1/2"
      },
      {
        "label": "E",
        "text": "17"
      }
    ],
    "answer": "C",
    "shortAnswer": "15",
    "solutionSteps": [
      {
        "title": "Start with the big square",
        "body": "The original 5 by 5 square has area 25. Four corner unit squares are removed."
      },
      {
        "title": "Account for the remaining gaps",
        "body": "The largest tilted square leaves the four cut-out unit squares plus four pairs of right triangles. Those triangles have total area 6."
      },
      {
        "title": "Subtract",
        "body": "The largest square has area 25 − 4 − 6 = 15."
      }
    ],
    "animationFrames": [
      {
        "title": "Understand the problem",
        "narration": "Identify the key information and what the question is asking.",
        "visualHint": "Highlight the important quantities and target value."
      },
      {
        "title": "Work step by step",
        "narration": "Use the main arithmetic, counting, geometry, or probability idea to compute the answer.",
        "visualHint": "Animate the core calculation or diagram relationship."
      },
      {
        "title": "Choose the answer",
        "narration": "Match the result to choice C.",
        "visualHint": "Circle answer choice C."
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
      "2015",
      "geometry",
      "area",
      "area",
      "rotated square"
    ],
    "sourceName": "2015 AMC 8",
    "license": "CC BY-NC-SA",
    "imageUrls": [
      "/amc8-diagrams/2015/problem-25-corner-cuts.svg"
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
  ...amc2006Problems,
  ...amc2007Problems,
  ...amc2008Problems,
  ...amc2009Problems,
  ...amc2010Problems,
  ...amc2011Problems,
  ...amc2012Problems,
  ...amc2013Problems,
  ...amc2014Problems,
  ...amc2015Problems,
];

export { legacySampleProblems, amc2001Problems, amc2002Problems, amc2003Problems, amc2004Problems, amc2005Problems, amc2006Problems, amc2007Problems, amc2008Problems, amc2009Problems, amc2010Problems, amc2011Problems, amc2012Problems, amc2013Problems, amc2014Problems, amc2015Problems };
