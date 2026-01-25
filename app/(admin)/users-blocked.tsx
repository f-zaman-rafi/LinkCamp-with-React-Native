import React from 'react';
import AdminUserList from '../../components/AdminUserList';

export default function UsersBlocked() {
  return (
    <AdminUserList
      title="Blocked Users"
      query={{ verify: 'blocked' }}
      returnPath="/(admin)/users-blocked"
    />
  );
}
