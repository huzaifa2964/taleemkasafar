/**
 * Login layout - bypasses the parent admin layout.
 * This prevents authentication checks on the login page itself.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
