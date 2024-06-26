import { useEffect, useState } from 'react';
import { ContentBoxWidth, VrcParameter } from 'cmap2-shared';
import styled from 'styled-components';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

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

    return (<ContentBox flexBasis={ContentBoxWidth.Full} contentTitle={'OSC activity history'}>
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
            <p>Waiting for OSC activity...</p>
        )}
    </ContentBox>)
}

const VrcOscHistoryTableStyled = styled.table`
  display: block;
  border-collapse: collapse;
  background: ${props => props.theme.colors.ui.background5};
  border-radius: 8px;
  padding: 10px 15px;

  thead th {
    padding: 0 15px 6px 10px;
    text-align: left;
    font-size: 18px;
    color: ${props => props.theme.colors.font.h2};
  }

  tbody {
    font-family: Noto-Sans-Regular, serif;

    td {
      text-align: left;
      padding: 3px 15px 3px 0;
    }
  }
`;
