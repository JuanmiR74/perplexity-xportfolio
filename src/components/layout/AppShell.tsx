import { useAuth } from '../../hooks/useAuth';
export default function AppShell({ children }: { children: React.ReactNode }) { const { user } = useAuth(); return (<div><header>{user?.email ?? 'Usuario'}</header><main>{children}</main></div>); }
