import "./globals.css";

export const metadata = {
  title: "Travel Unbounded | Experiential Travel Experts",
  description:
    "Discover unforgettable journeys with Travel Unbounded. Explore India and international destinations with personally curated travel experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
