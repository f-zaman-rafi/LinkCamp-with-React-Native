import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import AdminSubPage from '../../components/AdminSubPage';

export default function UsersAll() {
  return (
    <AdminSubPage backTo="/(admin)/users">
      <AdminUserList title="All Users" returnPath="/(admin)/users-all" />
    </AdminSubPage>
  );
}
