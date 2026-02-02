import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import AdminSubPage from '../../components/AdminSubPage';

export default function UsersPending() {
  return (
    <AdminSubPage>
      <AdminUserList
        title="Pending Users"
        query={{ verify: 'pending' }}
        returnPath="/(admin)/users-pending"
      />
    </AdminSubPage>
  );
}
