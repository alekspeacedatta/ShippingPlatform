import styled from 'styled-components';

export const Card = styled.section`
  position: relative;
  z-index: 10;
  margin-left: 6%;
  margin-right: 6%;
  width: 100%;
  max-width: 32rem;
  border-radius: 1.5rem;
  background-color: #fff;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(0);
`;
