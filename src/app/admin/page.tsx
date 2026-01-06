import { AdminDashboard } from '@/components/Admin/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Gestion des utilisateurs et de l\'administration',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
