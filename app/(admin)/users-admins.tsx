import React from 'react';
import AdminUserList from '../../components/AdminUserList';

export default function UsersAdmins() {
  return (
    <AdminUserList title="Admins" query={{ role: 'admin' }} returnPath="/(admin)/users-admins" />
  );
}
