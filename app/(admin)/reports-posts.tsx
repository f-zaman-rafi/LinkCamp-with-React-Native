import React from 'react';
import AdminReportList from '../../components/AdminReportList';
import AdminSubPage from '../../components/AdminSubPage';

export default function ReportsPosts() {
  return (
    <AdminSubPage backTo="/(admin)/reports">
      <AdminReportList type="posts" returnPath="/(admin)/reports-posts" />
    </AdminSubPage>
  );
}
