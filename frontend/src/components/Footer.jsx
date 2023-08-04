import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    const currentYr = new Date().getFullYear();
  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3 mt-4 ">
                    <p>
                        &copy;Lu {currentYr}
                    </p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer