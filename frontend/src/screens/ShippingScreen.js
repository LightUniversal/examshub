import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckOutSteps from "../components/CheckOutSteps";
import { FaArrowCircleRight } from "react-icons/fa";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  //   check if the shippingAddress exits

  const [department, setDepartment] = useState(shippingAddress?.department || '');
  const [level, setLevel] = useState(shippingAddress?.level || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [semester, setSemester] = useState(shippingAddress?.semester || '');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        department,
        city,
        level,
        semester,
      })
    );
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckOutSteps step1 step2/>
      <h1>Details</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter Your Department"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="level" className="my-2">
          <Form.Label>Level</Form.Label>
          <Form.Control
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Enter Your Level"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="semester" className="my-2">
          <Form.Label>Semester</Form.Label>
          <Form.Control
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter semester"
          ></Form.Control>
          <Button variant="primary" className="my-2" type="submit">
            Continue <FaArrowCircleRight />
          </Button>
        </Form.Group>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
