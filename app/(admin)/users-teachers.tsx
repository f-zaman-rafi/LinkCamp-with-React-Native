import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import AdminSubPage from '../../components/AdminSubPage';

export default function UsersTeachers() {
  return (
    <AdminSubPage>
      <AdminUserList
        title="Teachers"
        query={{ role: 'teacher' }}
        returnPath="/(admin)/users-teachers"
      />
    </AdminSubPage>
  );
}
