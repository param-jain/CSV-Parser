import * as React from 'react';
import './DataTable.css';

export default function Cell({
  content,
  header,
}) {

  const cellMarkup = header ? (
    <th className="Cell">
      {content}
    </th>
  ) : (
    <td className="Cell">
      {content}
    </td>
  );

  return (cellMarkup);
}