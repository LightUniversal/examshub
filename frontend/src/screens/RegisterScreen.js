import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { FaAddressBook, FaGraduationCap, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import React from "react";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userinfo } = useSelector((state) => state.auth);

  // Check for the redirect search parameter
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  console.log(userinfo, search);
  useEffect(() => {
    if (userinfo) {
      navigate(redirect);
    }
  }, [userinfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault(true);
    // check for password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ email, password, name }).unwrap();
        // The unwrap extracts values
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Welcome to LuProshop...");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  return (
    <div>
      <FormContainer>
        <h1>
            Register <FaGraduationCap className=" text-success "/>
        </h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>
              Name <FaUserPlus className=" text-success " />
            </Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            ></Form.Control>
            </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>
              Email Address <FaAddressBook className=" text-success " />
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>
              Password <FaLock className=" text-success" />
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmpassword" className="my-3">
            <Form.Label>
              Confirm Password <FaLock className=" text-success " />
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter password"
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="my-3"
            disabled={isLoading}
          >
            Register <FaUserPlus className=""/>
          </Button>

          {isLoading && <Loader />}
        </Form>
        <Row>
          <Col>
            {/* after the registering, the user is redirected to the value of the redirect variable */}
            Already have an account?
            <Link 
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
            >
              Login <FaSignInAlt className=" text-primary " />
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </div>
  );
};

export default RegisterScreen;
