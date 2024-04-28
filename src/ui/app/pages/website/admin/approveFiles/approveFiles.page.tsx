import React, { useEffect, useState } from 'react';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import { ApproveFilesDTO, UploadedFileDTO } from 'cmap2-shared';
import styled from 'styled-components';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import ApproveFileImage from './components/approveFileImage.component';
import Content from '../../../../shared/components/contentBox/content.component';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

export default function ApproveFilesPage() {

    const cmapFetch = useCmapFetch();
    const [approveFiles, setApproveFiles] = useState<UploadedFileDTO[]>([]);
    const [parent] = useAutoAnimate();

    useEffect(() => {
        cmapFetch<ApproveFilesDTO>('admin/approveFiles', {}, data => setApproveFiles(data.files));
    }, []);

    function onApprove(file: UploadedFileDTO) {
        cmapFetch('admin/approveFiles', {
            method: 'POST',
            body: JSON.stringify(file),
            headers: { 'Content-Type': 'application/json' }
        }, () => setApproveFiles(state => state.filter(f => f.id !== file.id)));
    }

    function onDecline(file: UploadedFileDTO) {
        cmapFetch('admin/approveFiles', {
            method: 'DELETE',
            body: JSON.stringify(file),
            headers: { 'Content-Type': 'application/json' }
        }, () => setApproveFiles(state => state.filter(f => f.id !== file.id)));
    }

    return (<Content>
        <ContentBox contentTitle={'Unapproved files'}>
            <ApproveFilesWrapper ref={parent}>
                {approveFiles.slice(0, 6).map(file => <ApproveFileImage file={file} onApprove={onApprove} onDecline={onDecline} key={file.id} />)}
            </ApproveFilesWrapper>
        </ContentBox>
    </Content>);
}

const ApproveFilesWrapper = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-start;
`;

