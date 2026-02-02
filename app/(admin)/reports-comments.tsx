import React from 'react';
import AdminReportList from '../../components/AdminReportList';
import AdminSubPage from '../../components/AdminSubPage';

export default function ReportsComments() {
  return (
    <AdminSubPage backTo="/(admin)/reports">
      <AdminReportList type="comments" returnPath="/(admin)/reports-comments" />
    </AdminSubPage>
  );
}
