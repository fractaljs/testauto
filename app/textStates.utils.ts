export const getQuestion = (currentState: number): string => {
  if (currentState === 0) {
    return "What would you like to know?";
  }
  if (currentState >= 1 && currentState <= 2) {
    return "What is the SR conversion for this month?"; // month
  }

  if (currentState >= 3 && currentState < 5) {
    return "Why is the SR conversion for this week 54%?";
  }

  if (currentState >= 5) {
    return "Why?";
  }
  return "";
};

export const getAnswer = (currentState: number): string => {
  if (currentState === 0) {
    return "";
  }
  if (currentState >= 2 && currentState <= 5) {
    return "";
    return "<p>The SR conversion for this month is <b>54%</b></p>";
  }

  if (currentState >= 7 && currentState <= 8) {
    return "<p>Analysing across PGs</p>";
  }

  if (currentState === 9) {
    return "<h2>HDFC Reported an outage on there end last week</h2>";
  }

  return "";
};
