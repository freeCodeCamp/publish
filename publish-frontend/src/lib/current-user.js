export function isEditor(session) {
  return session?.user?.role === 'Editor';
}
