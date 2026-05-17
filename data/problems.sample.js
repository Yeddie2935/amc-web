export const problems = [
  {
    id: "orig-alg-001",
    title: "Ribbon Ratio",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Algebra",
    subcategory: "Ratios",
    difficulty: 1,
    tags: ["ratio", "linear equations"],
    question: "A blue ribbon is 3 times as long as a red ribbon. Together they are 64 inches long. How many inches long is the blue ribbon?",
    choices: ["16", "32", "40", "48", "60"],
    answerIndex: 3,
    explanation: {
      idea: "Use one variable for the smaller quantity, then build the larger quantity from it.",
      steps: [
        "Let the red ribbon be x inches.",
        "Then the blue ribbon is 3x inches, so x + 3x = 64.",
        "Solve 4x = 64 to get x = 16.",
        "The blue ribbon is 3x = 48 inches."
      ],
      animationFrames: [
        "Frame 1: Show one red block labeled x.",
        "Frame 2: Show three blue blocks, each labeled x.",
        "Frame 3: Combine four equal blocks into 64, so each block is 16.",
        "Frame 4: Highlight the three blue blocks: 16 + 16 + 16 = 48."
      ]
    }
  },
  {
    id: "orig-geo-001",
    title: "Garden Border",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Geometry",
    subcategory: "Area",
    difficulty: 2,
    tags: ["area", "rectangles"],
    question: "A rectangular garden is 10 feet by 6 feet. A path of width 1 foot is built around the outside of the garden. What is the area of the path?",
    choices: ["28", "32", "36", "40", "44"],
    answerIndex: 2,
    explanation: {
      idea: "Find the area of the larger rectangle and subtract the original garden area.",
      steps: [
        "The garden area is 10 × 6 = 60 square feet.",
        "A 1-foot border increases each dimension by 2 feet, so the outside rectangle is 12 by 8.",
        "The outside area is 12 × 8 = 96 square feet.",
        "The path area is 96 − 60 = 36 square feet."
      ],
      animationFrames: [
        "Frame 1: Draw the 10 by 6 garden.",
        "Frame 2: Expand one foot on all four sides.",
        "Frame 3: Label the outside rectangle 12 by 8.",
        "Frame 4: Shade outside minus inside: 96 − 60 = 36."
      ]
    }
  },
  {
    id: "orig-nt-001",
    title: "Remainder Ladder",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Number Theory",
    subcategory: "Remainders",
    difficulty: 2,
    tags: ["modular arithmetic", "remainders"],
    question: "What is the remainder when 7 × 8 × 9 × 10 is divided by 11?",
    choices: ["0", "1", "2", "5", "10"],
    answerIndex: 2,
    explanation: {
      idea: "Reduce each factor modulo 11 before multiplying.",
      steps: [
        "Modulo 11, the factors are 7, 8, 9, and 10.",
        "Since 10 ≡ −1, 9 ≡ −2, 8 ≡ −3, and 7 ≡ −4 modulo 11.",
        "The product is (−4)(−3)(−2)(−1) = 24.",
        "Since 24 leaves remainder 2 when divided by 11, the answer is 2."
      ],
      animationFrames: [
        "Frame 1: Place 7, 8, 9, 10 around a clock with 11 positions.",
        "Frame 2: Convert them to −4, −3, −2, −1 steps from 11.",
        "Frame 3: Multiply signs and numbers to get 24.",
        "Frame 4: Wrap 24 around 11 twice and land on 2."
      ]
    }
  },
  {
    id: "orig-cp-001",
    title: "Two Socks",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Counting & Probability",
    subcategory: "Probability",
    difficulty: 2,
    tags: ["probability", "combinations"],
    question: "A drawer contains 3 black socks and 2 white socks. If two socks are chosen at random without replacement, what is the probability that they are the same color?",
    choices: ["1/5", "2/5", "1/2", "3/5", "4/5"],
    answerIndex: 1,
    explanation: {
      idea: "Count favorable pairs and divide by all possible pairs.",
      steps: [
        "There are 5 socks total, so there are C(5,2) = 10 possible pairs.",
        "Black-black pairs: C(3,2) = 3.",
        "White-white pairs: C(2,2) = 1.",
        "Favorable pairs = 3 + 1 = 4, so the probability is 4/10 = 2/5."
      ],
      animationFrames: [
        "Frame 1: Show 5 socks as dots: B B B W W.",
        "Frame 2: Draw all 10 possible pair slots.",
        "Frame 3: Highlight 3 black-black and 1 white-white pair.",
        "Frame 4: Display 4 favorable out of 10 total = 2/5."
      ]
    }
  },
  {
    id: "orig-alg-002",
    title: "Mystery Average",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Algebra",
    subcategory: "Averages",
    difficulty: 3,
    tags: ["average", "sum"],
    question: "The average of five numbers is 18. Four of the numbers are 11, 16, 20, and 24. What is the fifth number?",
    choices: ["17", "18", "19", "20", "21"],
    answerIndex: 2,
    explanation: {
      idea: "Average tells you the total sum.",
      steps: [
        "If five numbers have average 18, their total is 5 × 18 = 90.",
        "The four known numbers have sum 11 + 16 + 20 + 24 = 71.",
        "The fifth number is 90 − 71 = 19."
      ],
      animationFrames: [
        "Frame 1: Show five empty boxes sharing total 90.",
        "Frame 2: Fill four boxes with 11, 16, 20, 24.",
        "Frame 3: Sum the filled boxes to 71.",
        "Frame 4: The missing box receives 90 − 71 = 19."
      ]
    }
  },
  {
    id: "orig-geo-002",
    title: "Triangle Turn",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Geometry",
    subcategory: "Angles",
    difficulty: 3,
    tags: ["angles", "triangles"],
    question: "In a triangle, the second angle is twice the first angle, and the third angle is 30° more than the first angle. What is the measure of the largest angle?",
    choices: ["60°", "70°", "75°", "80°", "90°"],
    answerIndex: 2,
    explanation: {
      idea: "Represent all three angles using the first angle.",
      steps: [
        "Let the first angle be x degrees.",
        "Then the second is 2x, and the third is x + 30.",
        "Since triangle angles sum to 180, x + 2x + x + 30 = 180.",
        "Thus 4x = 150, so x = 37.5. The angles are 37.5°, 75°, and 67.5°.",
        "The largest angle is 75°."
      ],
      animationFrames: [
        "Frame 1: Label the triangle angles x, 2x, and x + 30.",
        "Frame 2: Slide the angles onto a straight line totaling 180°.",
        "Frame 3: Solve 4x + 30 = 180.",
        "Frame 4: Highlight 2x = 75° as the largest angle."
      ]
    }
  },
  {
    id: "orig-nt-002",
    title: "Divisor Detective",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Number Theory",
    subcategory: "Factors",
    difficulty: 4,
    tags: ["prime factorization", "divisors"],
    question: "How many positive divisors of 72 are multiples of 6?",
    choices: ["4", "5", "6", "8", "12"],
    answerIndex: 2,
    explanation: {
      idea: "A divisor of 72 that is a multiple of 6 can be written as 6k, where 6k divides 72.",
      steps: [
        "If 6k divides 72, then k divides 72 ÷ 6 = 12.",
        "So the valid k values are exactly the positive divisors of 12.",
        "The divisors of 12 are 1, 2, 3, 4, 6, and 12.",
        "Therefore there are 6 divisors of 72 that are multiples of 6."
      ],
      animationFrames: [
        "Frame 1: Write each desired divisor as 6k.",
        "Frame 2: Show 72 ÷ 6 = 12, so k must divide 12.",
        "Frame 3: List six k values: 1, 2, 3, 4, 6, 12.",
        "Frame 4: Multiply each by 6 to form 6, 12, 18, 24, 36, 72."
      ]
    }
  },
  {
    id: "orig-cp-002",
    title: "Flag Stripes",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Counting & Probability",
    subcategory: "Counting cases",
    difficulty: 3,
    tags: ["counting", "restrictions"],
    question: "A flag has 3 vertical stripes. Each stripe is colored red, blue, green, or yellow. Adjacent stripes may not have the same color. How many different flags are possible?",
    choices: ["24", "30", "36", "48", "64"],
    answerIndex: 2,
    explanation: {
      idea: "Choose stripe colors from left to right, respecting only the previous stripe.",
      steps: [
        "The first stripe has 4 choices.",
        "The second stripe has 3 choices because it cannot match the first.",
        "The third stripe has 3 choices because it cannot match the second; it may match the first.",
        "Total flags: 4 × 3 × 3 = 36."
      ],
      animationFrames: [
        "Frame 1: Show three blank stripe slots.",
        "Frame 2: First slot branches to 4 colors.",
        "Frame 3: Second slot branches to 3 allowed colors.",
        "Frame 4: Third slot branches to 3 allowed colors, giving 36 total."
      ]
    }
  },
  {
    id: "orig-alg-003",
    title: "Ticket Table",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Algebra",
    subcategory: "Systems",
    difficulty: 4,
    tags: ["systems", "money"],
    question: "A school sold adult tickets for $8 and student tickets for $5. It sold 40 tickets and collected $254. How many student tickets were sold?",
    choices: ["18", "20", "22", "24", "26"],
    answerIndex: 2,
    explanation: {
      idea: "Compare everything to the more expensive ticket, then account for the discount on student tickets.",
      steps: [
        "If all 40 tickets were adult tickets, the total would be 40 × 8 = 320 dollars.",
        "The actual total is 254, which is 320 − 254 = 66 dollars less.",
        "Each student ticket costs 3 dollars less than an adult ticket.",
        "So the number of student tickets is 66 ÷ 3 = 22."
      ],
      animationFrames: [
        "Frame 1: Fill 40 ticket slots with $8 adult tickets.",
        "Frame 2: Show expected total $320.",
        "Frame 3: Lower the total by $66 to match $254.",
        "Frame 4: Each student swap lowers by $3, so 66 ÷ 3 = 22."
      ]
    }
  },
  {
    id: "orig-geo-003",
    title: "Folded Square",
    sourceType: "original",
    sourceLabel: "Original launch problem",
    category: "Geometry",
    subcategory: "Perimeter",
    difficulty: 5,
    tags: ["perimeter", "spatial reasoning"],
    question: "A 6 by 6 square is cut into four 3 by 3 squares. The four small squares are placed in a straight row, touching edge to edge, to form one long rectangle. By how much does the perimeter increase?",
    choices: ["6", "12", "18", "24", "30"],
    answerIndex: 0,
    explanation: {
      idea: "Compare the original perimeter with the new rectangle's perimeter.",
      steps: [
        "The original 6 by 6 square has perimeter 4 × 6 = 24.",
        "Four 3 by 3 squares in a row form a 12 by 3 rectangle.",
        "The new perimeter is 2(12 + 3) = 30.",
        "The perimeter increases by 30 − 24 = 6."
      ],
      animationFrames: [
        "Frame 1: Draw a 6 by 6 square divided into four 3 by 3 squares.",
        "Frame 2: Separate the four pieces.",
        "Frame 3: Slide the pieces into a 12 by 3 rectangle.",
        "Frame 4: Compare perimeters: 30 − 24 = 6."
      ]
    }
  }
];
