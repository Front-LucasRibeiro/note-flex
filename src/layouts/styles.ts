import styled from 'styled-components'

export const Container = styled.div`
  /* width: 100vw; */
  height: 100vh;
  padding: 0;
  margin: 0;

  @media (max-width: 425px) {
    margin-top: 3rem;
  }
`
export const Body = styled.div`
  flex: 1;
  height: 100vh;
  /* width: 100vw; */

  @media (min-width: 425px) {
    display: flex;
  }
`
export const Main = styled.div`
  display: flex;
  flex-direction: row;
  /* margin-left: 20vw; */
  /* padding: 20px; */
  flex: 1;
`
export const Content = styled.div`
  flex: 1;
  overflow-x: hidden;
  height: 100%;
`
