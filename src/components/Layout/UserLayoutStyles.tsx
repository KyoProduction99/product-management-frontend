import styled from "styled-components";
import { Layout } from "antd";
const { Content, Header } = Layout;

export const HeaderContainer = styled(Header)`
  position: fixed;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 0 64px;
  }
`;

export const ContentContainer = styled(Content)`
  padding: 0 12px;
  margin-top: 64px;
  min-height: calc(100vh - 64px - 70px);

  @media (min-width: 768px) {
    padding: 0 64px;
  }
`;

export const BannerContainer = styled.div`
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
  text-align: center;
  padding: 16px;
  margin-bottom: 48px;
  line-height: 1;

  @media (min-width: 768px) {
    height: 360px;
  }
`;

export const BannerTitleText = styled.p`
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 48px;
  }
`;

export const BannerDescText = styled.p`
  font-size: 14px;
  color: white;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;
