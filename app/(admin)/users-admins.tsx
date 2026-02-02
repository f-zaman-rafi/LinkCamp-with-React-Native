import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import AdminSubPage from '../../components/AdminSubPage';

export default function UsersAdmins() {
  return (
    <AdminSubPage>
      <AdminUserList title="Admins" query={{ role: 'admin' }} returnPath="/(admin)/users-admins" />
    </AdminSubPage>
  );
}
