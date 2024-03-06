import { useEffect, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react';
import { ContentBoxWidth, VrcParameter } from 'cmap2-shared';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

interface VrcParameterWithDate extends VrcParameter {
    date: Date;
}

export default function VrcOscHistory() {

    const [oscParameterHistory, setOscParameterHistory] = useState<VrcParameterWithDate[]>([]);

    useEffect(() => {
        const removeListener = window.electronAPI.receive('vrcParameter', (data) => {
            setOscParameterHistory(state => [{...data, date: new Date()}, ...state.slice(0, 50)]);
        });

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    return (<ContentBox flexBasis={ContentBoxWidth.Full} title={'OSC activity history'}>
        {oscParameterHistory.length > 0 ? (
            <VrcOscHistoryTableStyled>
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {oscParameterHistory.map((parameter, index) => (
                    <tr key={index}>
                        <td>{parameter.date.toLocaleTimeString()}</td>
                        <td>{parameter.path}</td>
                        <td>{parameter.value.toString()}</td>
                    </tr>
                ))}
                </tbody>
            </VrcOscHistoryTableStyled>
        ) : (
            <p>No OSC activity</p>
        )}
    </ContentBox>)
}

const VrcOscHistoryTableStyled = styled.table`
  display: block;
  border-collapse: collapse;
  background: ${colors['button-2-border']};
  border-radius: 8px;
  padding: 10px 15px;

  thead th {
    padding: 0 15px 6px 10px;
    text-align: left;
    font-size: 18px;
    color: ${colors['font-header-2']};
  }

  tbody {
    font-family: Noto-Sans-Regular, serif;

    td {
      text-align: left;
      padding: 3px 15px 3px 0;
    }
  }
`;
