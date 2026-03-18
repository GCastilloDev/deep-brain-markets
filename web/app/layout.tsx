// Layout raíz — solo provee el HTML base, el idioma lo maneja [lang]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
