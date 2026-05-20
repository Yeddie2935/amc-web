import type { Problem } from "../types/amc";

/**
 * Structured import: 2001 AMC 8 Problems 1–25.
 * Includes recreated SVG diagrams for the visual problems, referenced by imageUrls.
 */
export const amc2001Problems: Problem[] = [
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

export default amc2001Problems;
