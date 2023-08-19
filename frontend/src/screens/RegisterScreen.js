import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import {
  FaAddressBook,
  FaBuilding,
  FaGraduationCap,
  FaImage,
  FaLock,
  FaSchool,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import React from "react";
import Loader from "../components/Loader";
import { useRegisterMutation, useProfileImageMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [imageUrl, setImgUrl] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [profileImage, { isLoading: loadingProfileImage }] = useProfileImageMutation();
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
        const res = await register({ email, password, name, imageUrl, faculty, department, friends: [] }).unwrap();
        // The unwrap extracts values
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Welcome to ExamHub...");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  // Profile Image
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await profileImage(formData).unwrap();
      toast.success(res.message);
      setImgUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <div>
      <FormContainer>
        {/* <h1 className=" shadow-sm p-2 rounded-1 ">
          Lupedia/Examhub <FaGraduationCap className=" text-success " />
        </h1> */}
        <Form onSubmit={submitHandler} className=" shadow-sm p-1 rounded-1 ">
          <Form.Group
            controlId="name"
            className="my-0 px-2 py-2 rounded-1  "
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
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
            className="my-1 px-2 py-2 rounded-1"
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
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
            controlId="faculty"
            className="my-1 px-2 py-2 rounded-1"
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
              Faculty <FaBuilding className=" text-success " />
            </Form.Label>
            <Form.Control
              type="text"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="Enter your faculty"
              className="p-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group
            controlId="department"
            className="my-1 px-2 py-2 rounded-1"
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
              Department <FaSchool className=" text-success " />
            </Form.Label>
            <Form.Control
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter your department"
              className="p-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group
            controlId="imgurl"
            className="my-1 px-2 py-2 rounded-1"
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
              Profile Image <FaImage className=" text-success " />
            </Form.Label>
            <Form.Control
              type="text"
              value={imageUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="p-2 my-1  rounded-0"
              placeholder="Enter image url"
            ></Form.Control>
            <Form.Control
              type="file"
              label = "Choose file"
              onChange={uploadFileHandler}
              className="p-2 rounded-0"
            ></Form.Control>
            
          </Form.Group>
          <Form.Group
            controlId="password"
            className="my-1  px-2 py-2 rounded-1"
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
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
            className="my-1 px-2 py-2 rounded-1"
          >
            <Form.Label className="shadow-sm px-2 py-2 rounded-0">
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
            className="my-3 mx-2 rounded-1 "
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
