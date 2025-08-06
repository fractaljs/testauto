export const getQuestion = (currentState: number): string => {
  if (currentState === 0) {
    return "What would you like to know?";
  }
  if (currentState >= 1 && currentState <= 2) {
    return "What is the SR conversion for this week?";
  }

  if (currentState >= 3 && currentState <= 4) {
    return "Why is the SR conversion for this week 54%?";
  }

  if (currentState === 5) {
    return "Why?";
  }
  return "";
};

export const getAnswer = (currentState: number): string => {
  if (currentState === 0) {
    return "";
  }
  if (currentState === 2) {
    return "<p>The SR conversion for this month is <b>54%</b></p>";
  }

  if (currentState >= 3 && currentState <= 4) {
    return "<p>Let me check across dimensions</p>";
  }

  if (currentState === 6) {
    return "<p>Analysing across PGs</p>";
  }

  return "";
};
