import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { FaAddressBook, FaGraduationCap, FaLock } from "react-icons/fa";
import React from "react";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  const {userinfo} = useSelector((state) => state.auth)


  // Check for the redirect search parameter
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  useEffect(()=> {
    if(userinfo) {
      navigate(redirect);
    }
  }, [userinfo, redirect, navigate]);


  const submitHandler = async (e) => {
    e.preventDefault(true);
    try {
      const res = await login({ email, password }).unwrap();
      // The unwrap extracts values 
      dispatch(setCredentials({...res,}));
      navigate(redirect);
      toast.success("Welcome to ExamHub...");
    } catch (error){
      toast.error(error?.data?.message || error.error)
    }
  };
  return (
    <div>
      <FormContainer>
      {/* <h1 className=" shadow-sm p-2 rounded-1 ">
            Lupedia/Examhub <FaGraduationCap className=" text-success "/>
        </h1> */}
        <Form onSubmit={submitHandler} className=" shadow-sm p-1 rounded-1 ">
          <Form.Group controlId="email" className="my-1 px-2 py-2 rounded-1">
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
              Email Address <FaAddressBook className=" text-success " />
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="p-3 rounded-2 shadow-sm "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-1  px-2 py-2 rounded-1">
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
              Password <FaLock className=" text-success " />
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="p-3 rounded-2 shadow-sm "
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="success" className="my-3 mx-2 rounded-1 " disabled ={isLoading}>
            Sign in
          </Button>

          { isLoading && <Loader />}
        </Form>
        <Row>
          <Col>
          {/* after the registering, the user is redirected to the value of the redirect variable */}
            New User? <Link to={ redirect ? `/register?redirect=${redirect}` : "/register" } >Register</Link>
          </Col>
        </Row>
      </FormContainer>
    </div>
  );
};

export default LoginScreen;
