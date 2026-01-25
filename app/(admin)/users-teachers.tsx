import React from 'react';
import AdminUserList from '../../components/AdminUserList';

export default function UsersTeachers() {
  return (
    <AdminUserList
      title="Teachers"
      query={{ role: 'teacher' }}
      returnPath="/(admin)/users-teachers"
    />
  );
}
