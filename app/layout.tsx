import "./globals.css";
import React from "react";

export const metadata = {
  title: "Коммерческие предложения",
  description: "Список коммерческих предложений из 1С OData"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
