import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import AdminSubPage from '../../components/AdminSubPage';

export default function UsersStudents() {
  return (
    <AdminSubPage>
      <AdminUserList
        title="Students"
        query={{ role: 'student' }}
        returnPath="/(admin)/users-students"
      />
    </AdminSubPage>
  );
}
