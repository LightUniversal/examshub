import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import {
  FaAddressBook,
  FaGraduationCap,
  FaImage,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
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
  const [imageUrl, setImgUrl] = useState("");

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
        toast.success("Welcome to ExamHub...");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  return (
    <div>
      <FormContainer>
        <h1 className=" shadow-sm p-2 rounded-1 ">
          Lupedia/Examhub <FaGraduationCap className=" text-success " />
        </h1>
        <Form onSubmit={submitHandler}>
          <Form.Group
            controlId="name"
            className="my-3 shadow-sm px-2 py-2 rounded-1  "
          >
            <Form.Label>
              Name <FaUserPlus className=" text-success " />
            </Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className=" p-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group
            controlId="email"
            className="my-3 shadow-sm px-2 py-2 rounded-1"
          >
            <Form.Label>
              Email Address <FaAddressBook className=" text-success " />
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="p-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group
            controlId="imgurl"
            className="my-3 shadow-sm px-2 py-2 rounded-1"
          >
            <Form.Label>
              Profile Image <FaImage className=" text-success " />
            </Form.Label>
            <Form.Control
              type="file"
              value={imageUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="p-2 rounded-0"
            ></Form.Control>
            <Form.Control
              type="text"
              value={imageUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="Enter email"
              className="p-2 rounded-0 my-1 "
            ></Form.Control>
          </Form.Group>
          <Form.Group
            controlId="password"
            className="my-3 shadow-sm px-2 py-2 rounded-1"
          >
            <Form.Label>
              Password <FaLock className=" text-success" />
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="p-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group
            controlId="confirmpassword"
            className="my-3 shadow-sm px-2 py-2 rounded-1"
          >
            <Form.Label>
              Confirm Password <FaLock className=" text-success " />
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter password"
              className="p-2 rounded-0 "
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="my-3"
            disabled={isLoading}
          >
            Register <FaUserPlus className="" />
          </Button>

          {isLoading && <Loader />}
        </Form>
        <Row>
          <Col>
            {/* after the registering, the user is redirected to the value of the redirect variable */}
            Already have an account?
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login <FaSignInAlt className=" text-primary " />
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </div>
  );
};

export default RegisterScreen;
