"use client";

export const CATEGORIES = ["addition", "subtraction", "multiplication", "comparison", "word-problems"] as const;
export type Category = (typeof CATEGORIES)[number];
export type TrainingData = Record<string, number>;

export function getConfidence(training: TrainingData, cat: string): number {
  const count = training[cat] || 0;
  return count === 0 ? 25 : count === 1 ? 55 : 90;
}

export const CAT_LABELS: Record<string, { emoji: string; label: string }> = {
  addition: { emoji: "➕", label: "Addition" },
  subtraction: { emoji: "➖", label: "Subtraction" },
  multiplication: { emoji: "✖️", label: "Multiplication" },
  comparison: { emoji: "⚖️", label: "Comparison" },
  "word-problems": { emoji: "📝", label: "Word Problems" },
};

// Training items — kid labels these to teach the robot
export const TRAIN_ITEMS = [
  { emoji: "➕", label: "3 + 4 = ?", answer: "7", category: "addition", voiceCorrect: "t_add1_y.mp3", voiceWrong: "t_add1_n.mp3" },
  { emoji: "➕", label: "8 + 5 = ?", answer: "13", category: "addition", voiceCorrect: "t_add2_y.mp3", voiceWrong: "t_add2_n.mp3" },
  { emoji: "➖", label: "9 - 4 = ?", answer: "5", category: "subtraction", voiceCorrect: "t_sub1_y.mp3", voiceWrong: "t_sub1_n.mp3" },
  { emoji: "➖", label: "15 - 7 = ?", answer: "8", category: "subtraction", voiceCorrect: "t_sub2_y.mp3", voiceWrong: "t_sub2_n.mp3" },
  { emoji: "✖️", label: "3 × 4 = ?", answer: "12", category: "multiplication", voiceCorrect: "t_mul1_y.mp3", voiceWrong: "t_mul1_n.mp3" },
  { emoji: "✖️", label: "5 × 2 = ?", answer: "10", category: "multiplication", voiceCorrect: "t_mul2_y.mp3", voiceWrong: "t_mul2_n.mp3" },
  { emoji: "⚖️", label: "Which is bigger: 14 or 9?", answer: "14", category: "comparison", voiceCorrect: "t_cmp1_y.mp3", voiceWrong: "t_cmp1_n.mp3" },
  { emoji: "⚖️", label: "Which is smaller: 6 or 11?", answer: "6", category: "comparison", voiceCorrect: "t_cmp2_y.mp3", voiceWrong: "t_cmp2_n.mp3" },
  { emoji: "📝", label: "You have 5 apples, get 3 more. How many?", answer: "8", category: "word-problems", voiceCorrect: "t_wp1_y.mp3", voiceWrong: "t_wp1_n.mp3" },
  { emoji: "📝", label: "12 cookies, eat 4. How many left?", answer: "8", category: "word-problems", voiceCorrect: "t_wp2_y.mp3", voiceWrong: "t_wp2_n.mp3" },
];

export const AI_FEATURES: Record<string, string[]> = {
  addition: ["Number detector", "Plus finder", "Sum calculator"],
  subtraction: ["Minus finder", "Difference calc", "Borrow checker"],
  multiplication: ["Times finder", "Group counter", "Product calc"],
  comparison: ["Size scanner", "Number weigher", "Order checker"],
  "word-problems": ["Word reader", "Number finder", "Operation guesser"],
};

const CONFUSIONS: Record<string, string> = {
  addition: "Calc added wrong — carried the 1 twice!",
  subtraction: "Calc subtracted backwards — oops!",
  multiplication: "Calc mixed up the times table!",
  comparison: "Calc got confused about bigger vs smaller!",
  "word-problems": "Calc couldn't figure out the right operation!",
};

// Full question pool — 100 questions (20 per category)
export const QUESTION_POOL = [
  // Addition (20)
  { q: "2 + 3", answer: "5", choices: ["4", "5", "6", "7"], category: "addition" },
  { q: "5 + 4", answer: "9", choices: ["8", "9", "10", "7"], category: "addition" },
  { q: "7 + 3", answer: "10", choices: ["9", "11", "10", "8"], category: "addition" },
  { q: "6 + 6", answer: "12", choices: ["11", "10", "12", "13"], category: "addition" },
  { q: "8 + 5", answer: "13", choices: ["12", "14", "11", "13"], category: "addition" },
  { q: "9 + 7", answer: "16", choices: ["15", "17", "14", "16"], category: "addition" },
  { q: "4 + 8", answer: "12", choices: ["11", "13", "10", "12"], category: "addition" },
  { q: "6 + 9", answer: "15", choices: ["14", "16", "13", "15"], category: "addition" },
  { q: "7 + 7", answer: "14", choices: ["13", "15", "12", "14"], category: "addition" },
  { q: "8 + 8", answer: "16", choices: ["15", "17", "14", "16"], category: "addition" },
  { q: "15 + 5", answer: "20", choices: ["19", "21", "18", "20"], category: "addition" },
  { q: "12 + 8", answer: "20", choices: ["19", "21", "18", "20"], category: "addition" },
  { q: "25 + 5", answer: "30", choices: ["29", "31", "28", "30"], category: "addition" },
  { q: "11 + 9", answer: "20", choices: ["19", "21", "18", "20"], category: "addition" },
  { q: "14 + 6", answer: "20", choices: ["19", "21", "18", "20"], category: "addition" },
  { q: "20 + 10", answer: "30", choices: ["29", "31", "28", "30"], category: "addition" },
  { q: "33 + 7", answer: "40", choices: ["39", "41", "38", "40"], category: "addition" },
  { q: "50 + 50", answer: "100", choices: ["90", "110", "95", "100"], category: "addition" },
  { q: "45 + 5", answer: "50", choices: ["49", "51", "48", "50"], category: "addition" },
  { q: "18 + 12", answer: "30", choices: ["29", "31", "28", "30"], category: "addition" },
  // Subtraction (20)
  { q: "5 - 2", answer: "3", choices: ["2", "4", "3", "5"], category: "subtraction" },
  { q: "9 - 4", answer: "5", choices: ["4", "6", "3", "5"], category: "subtraction" },
  { q: "10 - 3", answer: "7", choices: ["6", "8", "5", "7"], category: "subtraction" },
  { q: "8 - 5", answer: "3", choices: ["2", "4", "1", "3"], category: "subtraction" },
  { q: "12 - 7", answer: "5", choices: ["4", "6", "3", "5"], category: "subtraction" },
  { q: "15 - 6", answer: "9", choices: ["8", "10", "7", "9"], category: "subtraction" },
  { q: "11 - 4", answer: "7", choices: ["6", "8", "5", "7"], category: "subtraction" },
  { q: "14 - 8", answer: "6", choices: ["5", "7", "4", "6"], category: "subtraction" },
  { q: "16 - 9", answer: "7", choices: ["6", "8", "5", "7"], category: "subtraction" },
  { q: "13 - 5", answer: "8", choices: ["7", "9", "6", "8"], category: "subtraction" },
  { q: "20 - 10", answer: "10", choices: ["9", "11", "8", "10"], category: "subtraction" },
  { q: "18 - 9", answer: "9", choices: ["8", "10", "7", "9"], category: "subtraction" },
  { q: "25 - 5", answer: "20", choices: ["19", "21", "18", "20"], category: "subtraction" },
  { q: "30 - 15", answer: "15", choices: ["14", "16", "13", "15"], category: "subtraction" },
  { q: "50 - 20", answer: "30", choices: ["29", "31", "28", "30"], category: "subtraction" },
  { q: "40 - 25", answer: "15", choices: ["14", "16", "13", "15"], category: "subtraction" },
  { q: "100 - 50", answer: "50", choices: ["45", "55", "40", "50"], category: "subtraction" },
  { q: "35 - 17", answer: "18", choices: ["17", "19", "16", "18"], category: "subtraction" },
  { q: "60 - 30", answer: "30", choices: ["29", "31", "28", "30"], category: "subtraction" },
  { q: "44 - 22", answer: "22", choices: ["21", "23", "20", "22"], category: "subtraction" },
  // Multiplication (20)
  { q: "2 × 3", answer: "6", choices: ["5", "7", "4", "6"], category: "multiplication" },
  { q: "3 × 4", answer: "12", choices: ["11", "13", "10", "12"], category: "multiplication" },
  { q: "5 × 2", answer: "10", choices: ["9", "11", "8", "10"], category: "multiplication" },
  { q: "4 × 4", answer: "16", choices: ["15", "17", "14", "16"], category: "multiplication" },
  { q: "2 × 7", answer: "14", choices: ["13", "15", "12", "14"], category: "multiplication" },
  { q: "3 × 3", answer: "9", choices: ["8", "10", "7", "9"], category: "multiplication" },
  { q: "5 × 5", answer: "25", choices: ["24", "26", "23", "25"], category: "multiplication" },
  { q: "2 × 9", answer: "18", choices: ["17", "19", "16", "18"], category: "multiplication" },
  { q: "4 × 5", answer: "20", choices: ["19", "21", "18", "20"], category: "multiplication" },
  { q: "3 × 6", answer: "18", choices: ["17", "19", "16", "18"], category: "multiplication" },
  { q: "6 × 2", answer: "12", choices: ["11", "13", "10", "12"], category: "multiplication" },
  { q: "7 × 3", answer: "21", choices: ["20", "22", "19", "21"], category: "multiplication" },
  { q: "8 × 2", answer: "16", choices: ["15", "17", "14", "16"], category: "multiplication" },
  { q: "5 × 4", answer: "20", choices: ["19", "21", "18", "20"], category: "multiplication" },
  { q: "3 × 7", answer: "21", choices: ["20", "22", "19", "21"], category: "multiplication" },
  { q: "4 × 6", answer: "24", choices: ["23", "25", "22", "24"], category: "multiplication" },
  { q: "2 × 8", answer: "16", choices: ["15", "17", "14", "16"], category: "multiplication" },
  { q: "5 × 6", answer: "30", choices: ["29", "31", "28", "30"], category: "multiplication" },
  { q: "3 × 9", answer: "27", choices: ["26", "28", "25", "27"], category: "multiplication" },
  { q: "4 × 7", answer: "28", choices: ["27", "29", "26", "28"], category: "multiplication" },
  // Comparison (20)
  { q: "Which is bigger: 7 or 3?", answer: "7", choices: ["3", "7"], category: "comparison" },
  { q: "Which is bigger: 12 or 9?", answer: "12", choices: ["9", "12"], category: "comparison" },
  { q: "Which is smaller: 5 or 8?", answer: "5", choices: ["5", "8"], category: "comparison" },
  { q: "Which is bigger: 15 or 20?", answer: "20", choices: ["15", "20"], category: "comparison" },
  { q: "Which is smaller: 11 or 6?", answer: "6", choices: ["6", "11"], category: "comparison" },
  { q: "Which is bigger: 25 or 18?", answer: "25", choices: ["18", "25"], category: "comparison" },
  { q: "Which is smaller: 30 or 14?", answer: "14", choices: ["14", "30"], category: "comparison" },
  { q: "Which is bigger: 50 or 49?", answer: "50", choices: ["49", "50"], category: "comparison" },
  { q: "Which is smaller: 22 or 33?", answer: "22", choices: ["22", "33"], category: "comparison" },
  { q: "Which is bigger: 100 or 99?", answer: "100", choices: ["99", "100"], category: "comparison" },
  { q: "Which is bigger: 45 or 54?", answer: "54", choices: ["45", "54"], category: "comparison" },
  { q: "Which is smaller: 17 or 71?", answer: "17", choices: ["17", "71"], category: "comparison" },
  { q: "Which is bigger: 88 or 80?", answer: "88", choices: ["80", "88"], category: "comparison" },
  { q: "Which is smaller: 36 or 63?", answer: "36", choices: ["36", "63"], category: "comparison" },
  { q: "Which is bigger: 29 or 31?", answer: "31", choices: ["29", "31"], category: "comparison" },
  { q: "Which is smaller: 55 or 45?", answer: "45", choices: ["45", "55"], category: "comparison" },
  { q: "Which is bigger: 67 or 76?", answer: "76", choices: ["67", "76"], category: "comparison" },
  { q: "Which is smaller: 19 or 91?", answer: "19", choices: ["19", "91"], category: "comparison" },
  { q: "Which is bigger: 40 or 44?", answer: "44", choices: ["40", "44"], category: "comparison" },
  { q: "Which is smaller: 10 or 1?", answer: "1", choices: ["1", "10"], category: "comparison" },
  // Word Problems (20)
  { q: "3 apples + 4 apples = ?", answer: "7", choices: ["6", "8", "5", "7"], category: "word-problems" },
  { q: "10 cookies - 3 eaten = ?", answer: "7", choices: ["6", "8", "5", "7"], category: "word-problems" },
  { q: "2 bags × 5 toys each = ?", answer: "10", choices: ["9", "11", "8", "10"], category: "word-problems" },
  { q: "8 birds, 3 fly away. How many left?", answer: "5", choices: ["4", "6", "3", "5"], category: "word-problems" },
  { q: "You have 6, friend gives 7. Total?", answer: "13", choices: ["12", "14", "11", "13"], category: "word-problems" },
  { q: "15 stickers, give away 6. Left?", answer: "9", choices: ["8", "10", "7", "9"], category: "word-problems" },
  { q: "3 rows × 4 chairs each = ?", answer: "12", choices: ["11", "13", "10", "12"], category: "word-problems" },
  { q: "20 grapes - 8 eaten = ?", answer: "12", choices: ["11", "13", "10", "12"], category: "word-problems" },
  { q: "5 packs × 3 pencils = ?", answer: "15", choices: ["14", "16", "13", "15"], category: "word-problems" },
  { q: "9 fish + 6 more fish = ?", answer: "15", choices: ["14", "16", "13", "15"], category: "word-problems" },
  { q: "14 balloons, 5 pop. Left?", answer: "9", choices: ["8", "10", "7", "9"], category: "word-problems" },
  { q: "4 boxes × 3 books each = ?", answer: "12", choices: ["11", "13", "10", "12"], category: "word-problems" },
  { q: "7 red + 8 blue marbles = ?", answer: "15", choices: ["14", "16", "13", "15"], category: "word-problems" },
  { q: "18 crayons - 9 broken = ?", answer: "9", choices: ["8", "10", "7", "9"], category: "word-problems" },
  { q: "2 shelves × 6 books = ?", answer: "12", choices: ["11", "13", "10", "12"], category: "word-problems" },
  { q: "11 stars + 9 stars = ?", answer: "20", choices: ["19", "21", "18", "20"], category: "word-problems" },
  { q: "25 candies - 10 shared = ?", answer: "15", choices: ["14", "16", "13", "15"], category: "word-problems" },
  { q: "5 friends × 2 slices each = ?", answer: "10", choices: ["9", "11", "8", "10"], category: "word-problems" },
  { q: "16 blocks + 4 more = ?", answer: "20", choices: ["19", "21", "18", "20"], category: "word-problems" },
  { q: "30 seeds - 12 planted = ?", answer: "18", choices: ["17", "19", "16", "18"], category: "word-problems" },
];

// Pick N random questions from a category
function pickFromPool(cat: string, n: number) {
  const pool = QUESTION_POOL.filter((q) => q.category === cat).sort(() => Math.random() - 0.5);
  return pool.slice(0, n);
}

export type MazeRound = {
  q: string; correct: string; choices: string[]; category: string;
  aiChoice: string; confidence: number; features: string[];
  reason?: string;
};

export function generateTestRounds(training: TrainingData): MazeRound[] {
  const rounds: MazeRound[] = [];
  for (const cat of CATEGORIES) {
    const qs = pickFromPool(cat, 1);
    for (const item of qs) {
      const conf = getConfidence(training, cat);
      const correct = Math.random() < conf / 100;
      const aiChoice = correct ? item.answer : item.choices.find((c) => c !== item.answer)!;
      rounds.push({
        q: item.q, correct: item.answer, choices: [...item.choices].sort(() => Math.random() - 0.5),
        category: cat, aiChoice, confidence: conf,
        features: AI_FEATURES[cat] || [],
        reason: correct ? undefined : CONFUSIONS[cat],
      });
    }
  }
  return rounds.sort(() => Math.random() - 0.5);
}

export type MazeEvent = {
  q: string; correct: string; choices: string[]; category: string;
  aiChoice: string; confidence: number; features: string[]; aiDelay: number;
};

export function generateMazeEvents(training: TrainingData): MazeEvent[] {
  const events: MazeEvent[] = [];
  for (const cat of CATEGORIES) {
    const qs = pickFromPool(cat, 2);
    for (const item of qs) {
      const conf = getConfidence(training, cat);
      const correct = Math.random() < conf / 100;
      const aiChoice = correct ? item.answer : item.choices.find((c) => c !== item.answer)!;
      events.push({
        q: item.q, correct: item.answer, choices: [...item.choices].sort(() => Math.random() - 0.5),
        category: cat, aiChoice, confidence: conf,
        features: AI_FEATURES[cat] || [],
        aiDelay: 800 + Math.random() * 1400,
      });
    }
  }
  return events.sort(() => Math.random() - 0.5);
}
