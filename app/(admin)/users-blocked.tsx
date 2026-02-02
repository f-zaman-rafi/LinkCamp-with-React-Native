import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import AdminSubPage from '../../components/AdminSubPage';

export default function UsersBlocked() {
  return (
    <AdminSubPage>
      <AdminUserList
        title="Blocked Users"
        query={{ verify: 'blocked' }}
        returnPath="/(admin)/users-blocked"
      />
    </AdminSubPage>
  );
}
