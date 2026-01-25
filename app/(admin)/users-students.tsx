import React from 'react';
import AdminUserList from '../../components/AdminUserList';

export default function UsersStudents() {
  return (
    <AdminUserList
      title="Students"
      query={{ role: 'student' }}
      returnPath="/(admin)/users-students"
    />
  );
}
