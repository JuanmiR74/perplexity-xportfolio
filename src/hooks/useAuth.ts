export function useAuth() {
  return {
    user: { id: 'demo-user', email: 'usuario@demo.com' },
    loading: false,
    signIn: async (_email: string, _password: string) => ({ user: { id: 'demo-user', email: 'usuario@demo.com' }, error: null }),
    signUp: async (_email: string, _password: string) => ({ user: { id: 'demo-user', email: 'usuario@demo.com' }, error: null }),
    signOut: async () => {},
  };
}
