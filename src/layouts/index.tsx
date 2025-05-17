import { Body, Container, Content, Main } from 'layouts/styles'
import { ReactNode } from 'react'

export default function Layout(props: { element: ReactNode }) {
  return (
    <Container>
      <Body>
        <Main>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Content>{props.element}</Content>
          </div>
        </Main>
      </Body>
    </Container>
  )
}
