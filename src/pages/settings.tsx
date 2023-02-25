import React from 'react';
import { TreeView, useAppContext } from '../app/ctx';

type SettingsPageProps = {};

const SettingsPage = (props: SettingsPageProps) => {
  const { setTreeView, treeView } = useAppContext();
  return (
    <div>
      <label>
        Tree View{' '}
        <select
          onChange={(e) => setTreeView(e.target.value as TreeView)}
          value={treeView}
        >
          <option value={TreeView.Default}>Default</option>
          <option value={TreeView.DTree}>Dtree</option>
          <option value={TreeView.List}>List</option>
        </select>
      </label>
    </div>
  );
};

export default SettingsPage;
