import styled from 'styled-components';

export const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #d0d4ff;
  background: #fff;
  font-size: 15px;
  color: #222;
  outline: none;
  transition: all 0.25s ease;
  &::placeholder {
    color: #aaa;
    transition: color 0.2s ease;
  }
  &:hover {
    border-color: #8b94f5;
    &::placeholder {
      color: #8b94f5;
      transition: color 0.2s ease;
    }
  }
  &:focus {
    border-color: #5a64ff;
    &::placeholder {
      color: #5b60acff;
    }
  }
`;
