import colors from 'cmap2-shared/src/colors.json';
import React from 'react';
import { Content, ContentBox } from 'cmap2-shared/src/components/contentBox.component';
import styled from 'styled-components';
import { ContentBoxWidth } from 'cmap2-shared/src';

export default function AboutPage() {

    return (<>
        <Content>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Third}><ButtonsBox><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Third}><ButtonsBox><Test/><Test/><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Third}><ButtonsBox><Test/><Test/><Test></Test></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Third}><ButtonsBox><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Half}><ButtonsBox><Test/><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Half}><ButtonsBox><Test/><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Half}><ButtonsBox><Test/><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Half}><ButtonsBox><Test/><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Third}><ButtonsBox><Test/><Test/><Test/></ButtonsBox></ContentBox>
            <ContentBox title='Test title' flexBasis={ContentBoxWidth.Full}><ButtonsBox><Test/><Test/><Test/><Test/><Test/></ButtonsBox></ContentBox>
        </Content>
    </>);
}

const ButtonsBox = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
`;

const Test = styled.div`
  background-color: ${colors['button-2-bg']};
  flex-grow: 2; // option two try disable this, maybe with basis on 0
  //flex-basis: 0;
  min-width: 160px;
  max-width: 200px;
  aspect-ratio: 16/9;
`;
