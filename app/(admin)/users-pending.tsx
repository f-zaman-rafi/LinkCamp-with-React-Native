import React from 'react';
import AdminUserList from '../../components/AdminUserList';

export default function UsersPending() {
  return (
    <AdminUserList
      title="Pending Users"
      query={{ verify: 'pending' }}
      returnPath="/(admin)/users-pending"
    />
  );
}
