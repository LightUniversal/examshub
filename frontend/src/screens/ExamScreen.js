import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Row,
  Col,
  Container,
  ListGroup,
  Button,
  Form,
} from "react-bootstrap";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaBookReader,
  FaHourglassStart,
  FaQuestionCircle,
  FaUserPlus,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetProductQuery } from "../slices/productApiSlice";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ExamScreen = () => {
  let showScore = 0;
  const [topic, setTopic] = useState("");

  const [show, setShow] = useState(false);


  // close Modal
  const handleClose = () => setShow(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [solution, setSolution] = useState("");

  const { id: productId, paidUser: userId } = useParams();
  const { userinfo } = useSelector((state) => state.auth);

  const { data: product, isLoading, error } = useGetProductQuery(productId);
  console.log(productId, product);
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const questionsAnsweredRef = useRef(0);

  const handleStartTimer = (e) => {
    e.preventDefault();
    e.target.classList.add("d-none");
    document.querySelector(".score").classList.add("d-none");
    document.querySelector("#form").classList.remove("d-none");
    setTimerActive(true);
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    // Store the interval ID in the ref to clear it later
    questionsAnsweredRef.current = interval;
  };

  const handleQuestionAnswered = () => {
    if (timerActive) {
      questionsAnsweredRef.current += 1;
    }
  };
  // Get and display soltuions
  const getSolution = (e, { question, answer, solution }) => {
    e.preventDefault();
    setShow(true);
    setAnswer(answer), setSolution(solution), setQuestion(question);
  };

  // Get all the inputs elements
  const allRadioInputs = document.querySelectorAll("input[type='radio']");
  console.log(allRadioInputs);
  const rightAns =
    !isLoading &&
    product.questions.map((quest) => {
      return quest.answer;
    });
  // Submit questions
  const handleStopTimer = (e) => {
    e.preventDefault();
    Array.from(allRadioInputs).forEach((input, i) => {
      if (input.checked) {
        // console.log(input, rightAns[0].trim())
        rightAns.forEach((ans) => {
          if (ans.trim() === input.value.trim()) {
            showScore +=
              (Number(showScore) +
                Number(i) / Number(product.questions.length)) *
              10;
          }
        });
        console.log(showScore); 
        document.querySelector("#form").classList.add("d-none");
        document.querySelector(".startBtn").classList.remove("d-none");
        document.querySelector(".score").classList.remove("d-none");
        document.querySelector(".score span").textContent = `${showScore}%`;
      }
    });
    setTimerActive(false);
    setSeconds(0);
    clearInterval(questionsAnsweredRef.current);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : userinfo._id === userId ? (
        <Container className="my-3">
          <Row>
            <Col
              md={6}
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div
                className="  time px-3 rounded-1   "
                style={{
                  position: "fixed",
                  zIndex: "100",
                  top: "70px",
                  backgroundColor: "rgb(255,255,255)",
                }}
              >
                {/* <span className=" text-center text-white">
                  <FaStopwatch />:
                </span> */}
                <div className="shadow-sm px-2 py-1  rounded-1  fw-medium text-dark fw-bold hr">
                  00 hr :
                </div>
                <div className="shadow-sm px-2 py-1  rounded-1 fw-medium text-dark fw-bold min">
                  00 mins :
                </div>
                :
                <div className="shadow-sm px-2 py-1  rounded-1  fw-medium text-dark fw-bold sec">
                  {seconds} sec
                </div>
              </div>
            </Col>
            <Col className="score mx-2 mt-5 d-none">
              <h4
                id="score"
                className=" px-4 py-3 text-success shadow    rounded-1"
              >
                Score: <span className="scoreval">70 %</span>
              </h4>
            </Col>
            <Col
              className="fw-medium py-1 mx-2"
              style={{ position: "relative", right: "-30px", top: "4px" }}
            >
              <Button
                className="startBtn rounded-1 px-4 py-2 my-1   border-0 fw-medium "
                onClick={(e) => handleStartTimer(e)}
              >
                <FaHourglassStart /> Start
              </Button>
            </Col>
          </Row>
          <div className="body my-4 border-top py-3 ">
            <Form className=" d-none " id="form">
              <Form.Group controlId="topic" className=" text-center ">
                <Form.Label
                  className=" fw-medium shadow py-3 px-3 text-white rounded-1  mx-1"
                  style={{ background: "rgba(0,0,0,0.51)" }}
                >
                  Choose Topic
                  <FaBookReader
                    style={{ position: "relative", top: "-2px" }}
                    className=" text-white "
                  />
                </Form.Label>
                <Form.Control
                  as="select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="topicselect shadow-sm fw-medium text-dark mx-1 "
                  style={{ background: "rgba(2,0,10,0.1)" }}
                >
                  {product.questions.map((question, i) => (
                    <option
                      key={question.topic + `${i}`}
                      value={question.topic}
                    >
                      {question.topic}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {product.questions.map((question, i) => (
                <Form.Group controlId={question.topic} key={i}>
                  <ListGroup
                    id="question"
                    className=" shadow-sm p-3 my-2"
                    type="none"
                  >
                    <p className="question_ py-4 px-2 ">
                      <span
                        className="mx-3 px-2 text-success  py-1 my-2 shadow-sm rounded"
                        style={{ background: "rgba(200,200,200,0.1)" }}
                      >
                        <FaQuestionCircle
                          className=" text-success mx-1 "
                          style={{ position: "relative", top: "-1.5px" }}
                        />
                        -{i + 1}
                      </span>
                      {question.question}
                    </p>

                    <li>
                      <input
                        type="radio"
                        id={(question.options[0] + `${i}`).trim()}
                        name={question.topic}
                        className=" inline"
                        value={question.options[0]}
                      />
                      <label htmlFor={(question.options[0] + `${i}`).trim()}>
                        {question.options[0]}
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id={(question.options[1] + `${i}`).trim()}
                        name={question.topic}
                        value={question.options[1]}
                      />
                      <label htmlFor={(question.options[1] + `${i}`).trim()}>
                        {question.options[1]}
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id={(question.options[2] + `${i}`).trim()}
                        name={question.topic}
                        value={question.options[2]}
                      />
                      <label htmlFor={(question.options[2] + `${i}`).trim()}>
                        {question.options[2]}
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id={(question.options[3] + `${i}`).trim()}
                        name={question.topic}
                        value={question.options[3]}
                      />
                      <label htmlFor={(question.options[3] + `${i}`).trim()}>
                        {question.options[3]}
                      </label>
                    </li>
                    <div className="actions flex justify-between">
                      <button
                        className="submit border-0 bg-danger rounded-1 text-white px-3 py-2"
                        onClick={(e) => handleStopTimer(e)}
                      >
                        Submit
                      </button>
                      <button
                        className="next shadow px-3 py-2 bg-success text-white rounded-1 "
                        onClick={(e) =>
                          getSolution(e, {
                            question: question.question,
                            answer: question.answer,
                            solution: question.solution,
                          })
                        }
                      >
                        Solution
                      </button>
                    </div>
                  </ListGroup>
                </Form.Group>
              ))}
            </Form>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title className=" w-100 text-center ">
                  <p
                    className=" bg-dark-subtle px-3 py-2 w-100 fw-light "
                    style={{ fontSize: "16px" }}
                  >
                    {question}
                  </p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p
                  className="px-4 py-1 "
                  style={{ lineHeight: "40px", textAlign: "justify" }}
                >
                  {solution}
                </p>
                <strong
                  className="px-2 py-2 mx-4"
                  style={{ backgroundColor: "rgba(200, 200, 200, 0.6)" }}
                >
                  Answer: {answer}
                </strong>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Container>
      ) : (
        <Message varient="danger">
          Your not authorized to view this page, purchase a product first
          <Link
            to="/"
            className=" text-dark mx-1 bg-white px-2 py-1 rounded-2 my-2 d-block text-center text-decoration-none "
            style={{ width: "90px" }}
          >
            <FaArrowAltCircleLeft /> Back
          </Link>
        </Message>
      )}
    </div>
  );
};

export default ExamScreen;