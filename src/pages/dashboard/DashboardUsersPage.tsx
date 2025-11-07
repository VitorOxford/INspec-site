// src/pages/dashboard/DashboardUsersPage.tsx

import React from 'react';
// IMPORTA O COMPONENTE RENOMEADO/ATUALIZADO
import UserManagementTable from '@/components/dashboard/UserManagementTable'; 

export default function DashboardUsersPage() {
  return (
    <div className="space-y-8">
      {/* O componente de gestão de usuários */}
      <UserManagementTable />
    </div>
  );
}