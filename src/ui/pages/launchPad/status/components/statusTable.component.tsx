import styled from 'styled-components';

const StatusTable = styled.table`
  padding: 6px;
  background: ${props => props.theme.colors.ui.background5};
  border-radius: 8px;
  width: 100%;
  
  thead {
    th h2 {
      margin: 0;
    }
    
    td {
      text-align: right;
    }
  }

  th {
    text-align: left;
  }

  th, td {
    padding: 3px;
  }
  
  tbody {
    td:first-child {
      padding-left: 10px;
      text-align: left;
    }

    td:last-child {
      text-align: right;
      padding-right: 10px;
    }
  }
`;

export default StatusTable;