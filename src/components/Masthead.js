import React from 'react';
import styled from 'styled-components';
import colors from '../utils/colors';

const StyledMasthead = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  background-color: ${colors.zoomdataBlue};
  padding: 5px 15px;
  width: 100%;
`;

const H1 = styled.h1`
  color: ${colors.chromium};
  margin: 0;
  font-size: 24px;
`;
const Masthead = () => (
  <StyledMasthead>
    <div>
      <H1>Embed Example</H1>
    </div>
  </StyledMasthead>
);

export default Masthead;
