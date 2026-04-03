export type ActivityItem = {
  id: string;
  text: string;
  date: string;
  tone: string;
  credits?: number;
};

export const activityItems: ActivityItem[] = [
  { id: "a1", text: 'You posted a new request - "Debug React useEffect"', date: "Mar 27, 10:15 AM", tone: "teal" },
  { id: "a2", text: "Your offer for SQL window functions was accepted", date: "Mar 26, 12:30 PM", tone: "blue" },
  { id: "a3", text: 'You submitted an offer on "SQL window functions walkthrough"', date: "Mar 26, 11:10 AM", tone: "amber" },
  { id: "a4", text: "Alex Chen rated you 5 stars after your session", date: "Mar 25, 01:40 PM", tone: "gold" },
  { id: "a5", text: "Session completed - TypeScript generics with Alex Chen", date: "Mar 25, 01:35 PM", tone: "green", credits: 3 },
  { id: "a6", text: "Session completed - Big O notation with Marcus Webb", date: "Mar 20, 01:05 PM", tone: "green", credits: -6 },
  { id: "a7", text: "Credits escrowed for Big O notation session with Marcus Webb", date: "Mar 19, 10:00 AM", tone: "rose", credits: -6 },
];
