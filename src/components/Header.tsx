import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
export default function Header() { const { user, signOut } = useAuth(); const handleSignOut = async () => { await signOut(); toast.success('Sesión cerrada'); }; return (<header><div>{user?.email ?? 'Usuario'}</div><button type="button" onClick={handleSignOut}>Salir</button></header>); }
