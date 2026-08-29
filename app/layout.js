export const metadata = {
  title: "Structured Chatbot",
  description: "A chatbot that returns structured JSON output and runs an LLM-as-judge evaluation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
