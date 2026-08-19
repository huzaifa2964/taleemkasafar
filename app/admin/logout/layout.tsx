/**
 * Logout layout - bypasses the parent admin layout.
 */
export default function LogoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
