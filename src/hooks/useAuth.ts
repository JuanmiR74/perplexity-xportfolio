export function useAuth() {
  return { user: { id: 'demo-user', email: 'usuario@demo.com' }, loading: false, signIn: async () => ({ user: { id: 'demo-user', email: 'usuario@demo.com' }, error: null }), signUp: async () => ({ user: { id: 'demo-user', email: 'usuario@demo.com' }, error: null }), signOut: async () => {} };
}
